// Lightweight client-side store for the citizen space.
// Persists conversations, favorites and profile preferences in localStorage.
// When the FastAPI backend lands, swap these helpers for fetch() calls without
// touching the UI components.

export type ConvMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  lang?: "fr" | "wo";
  createdAt: number;
  // Optional debug metadata mirrored from chat.tsx (kept loose on purpose).
  debug?: Record<string, unknown>;
};

export type Conversation = {
  id: string;
  title: string;
  topic?: string; // services slug if any
  createdAt: number;
  updatedAt: number;
  messages: ConvMessage[];
};

export type ProfilePrefs = {
  name: string;
  phone: string;
  lang: "fr" | "wo";
};

const K_CONV = "wakhalog_conversations";
const K_FAV = "wakhalog_favorites";
const K_PROFILE = "wakhalog_profile";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// ── Conversations ─────────────────────────────────────────────
export function loadConversations(): Conversation[] {
  return read<Conversation[]>(K_CONV, []);
}

export function saveConversation(conv: Conversation) {
  const all = loadConversations();
  const idx = all.findIndex((c) => c.id === conv.id);
  if (idx >= 0) all[idx] = conv;
  else all.unshift(conv);
  write(K_CONV, all);
}

export function getConversation(id: string): Conversation | undefined {
  return loadConversations().find((c) => c.id === id);
}

export function deleteConversation(id: string) {
  write(
    K_CONV,
    loadConversations().filter((c) => c.id !== id),
  );
}

export function clearConversations() {
  write(K_CONV, []);
}

export function newConversationId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Favorites ─────────────────────────────────────────────────
export function loadFavorites(): string[] {
  return read<string[]>(K_FAV, []);
}

export function toggleFavorite(slug: string): string[] {
  const cur = loadFavorites();
  const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
  write(K_FAV, next);
  return next;
}

export function isFavorite(slug: string): boolean {
  return loadFavorites().includes(slug);
}

// ── Profile ───────────────────────────────────────────────────
export function loadProfile(): ProfilePrefs {
  return read<ProfilePrefs>(K_PROFILE, {
    name: "Citoyen",
    phone: "",
    lang: "fr",
  });
}

export function saveProfile(p: ProfilePrefs) {
  write(K_PROFILE, p);
}

// ── Derived helpers ───────────────────────────────────────────
export function groupByDay(convs: Conversation[]) {
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const week: Conversation[] = [];
  const older: Conversation[] = [];
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayMs = 86_400_000;
  for (const c of convs) {
    const d = c.updatedAt;
    if (d >= startOfDay) today.push(c);
    else if (d >= startOfDay - dayMs) yesterday.push(c);
    else if (d >= startOfDay - 7 * dayMs) week.push(c);
    else older.push(c);
  }
  return { today, yesterday, week, older };
}

export function uniqueTopics(convs: Conversation[]): {
  slug: string;
  count: number;
  lastAt: number;
}[] {
  const map = new Map<string, { slug: string; count: number; lastAt: number }>();
  for (const c of convs) {
    if (!c.topic) continue;
    const cur = map.get(c.topic);
    if (cur) {
      cur.count += 1;
      cur.lastAt = Math.max(cur.lastAt, c.updatedAt);
    } else {
      map.set(c.topic, { slug: c.topic, count: 1, lastAt: c.updatedAt });
    }
  }
  return [...map.values()].sort((a, b) => b.lastAt - a.lastAt);
}
