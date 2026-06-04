// Citizen-side persistence (localStorage). Mimics ChatGPT-style conversations
// so the system can later restore context when wired to a real backend.

export type StoredMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  lang?: "fr" | "wo";
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  topic?: string; // procedure slug
  messages: StoredMessage[];
  createdAt: number;
  updatedAt: number;
};

export type ProcedureVisit = {
  slug: string;
  title: string;
  category: string;
  lastVisit: number;
  visits: number;
  listened?: boolean;
  asked?: boolean;
};

export type CitizenProfile = {
  name: string;
  phone: string;
  preferredLang: "fr" | "wo";
};

const K_CONVS = "wakhalog_conversations";
const K_FAVS = "wakhalog_favorites";
const K_VISITS = "wakhalog_visits";
const K_PROFILE = "wakhalog_profile";
const K_LEGACY = "wakhalog_history";

// ───────────────────────── Conversations ─────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function migrateLegacy(): void {
  try {
    const raw = localStorage.getItem(K_LEGACY);
    if (!raw) return;
    const msgs = JSON.parse(raw) as StoredMessage[];
    if (!Array.isArray(msgs) || msgs.length === 0) {
      localStorage.removeItem(K_LEGACY);
      return;
    }
    const convs = listConversations();
    if (convs.length > 0) {
      localStorage.removeItem(K_LEGACY);
      return;
    }
    const firstUser = msgs.find((m) => m.role === "user");
    const conv: Conversation = {
      id: `c_${Date.now()}`,
      title: firstUser?.text.slice(0, 60) ?? "Conversation",
      messages: msgs,
      createdAt: msgs[0].createdAt,
      updatedAt: msgs[msgs.length - 1].createdAt,
    };
    write(K_CONVS, [conv]);
    localStorage.removeItem(K_LEGACY);
  } catch {
    /* ignore */
  }
}

export function listConversations(): Conversation[] {
  return read<Conversation[]>(K_CONVS, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getConversation(id: string): Conversation | undefined {
  return listConversations().find((c) => c.id === id);
}

export function getLastConversation(): Conversation | undefined {
  return listConversations()[0];
}

export function createConversation(opts: { topic?: string; title?: string } = {}): Conversation {
  const now = Date.now();
  const conv: Conversation = {
    id: `c_${now}_${Math.random().toString(36).slice(2, 7)}`,
    title: opts.title ?? "Nouvelle conversation",
    topic: opts.topic,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  const all = read<Conversation[]>(K_CONVS, []);
  all.push(conv);
  write(K_CONVS, all);
  return conv;
}

export function saveConversation(conv: Conversation): void {
  const all = read<Conversation[]>(K_CONVS, []);
  const idx = all.findIndex((c) => c.id === conv.id);
  conv.updatedAt = Date.now();
  if (idx === -1) all.push(conv);
  else all[idx] = conv;
  write(K_CONVS, all);
}

export function deleteConversation(id: string): void {
  const all = read<Conversation[]>(K_CONVS, []).filter((c) => c.id !== id);
  write(K_CONVS, all);
}

export function renameConversation(id: string, title: string): void {
  const all = read<Conversation[]>(K_CONVS, []);
  const c = all.find((x) => x.id === id);
  if (!c) return;
  c.title = title;
  c.updatedAt = Date.now();
  write(K_CONVS, all);
}

export function clearConversations(): void {
  localStorage.removeItem(K_CONVS);
}

// Group conversations by date bucket (Today/Yesterday/Week/Older) — ChatGPT-style.
export type ConvBucket = "today" | "yesterday" | "week" | "older";
export const BUCKET_LABEL: Record<ConvBucket, string> = {
  today: "Aujourd'hui",
  yesterday: "Hier",
  week: "Cette semaine",
  older: "Plus ancien",
};
export function bucketOf(ts: number): ConvBucket {
  const d = new Date(ts);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startYesterday = startToday - 86_400_000;
  const startWeek = startToday - 6 * 86_400_000;
  if (d.getTime() >= startToday) return "today";
  if (d.getTime() >= startYesterday) return "yesterday";
  if (d.getTime() >= startWeek) return "week";
  return "older";
}

// ───────────────────────── Favorites ─────────────────────────

export type Favorite = { slug: string; title: string; category: string; addedAt: number };

export function listFavorites(): Favorite[] {
  return read<Favorite[]>(K_FAVS, []).sort((a, b) => b.addedAt - a.addedAt);
}
export function isFavorite(slug: string): boolean {
  return listFavorites().some((f) => f.slug === slug);
}
export function toggleFavorite(fav: Omit<Favorite, "addedAt">): boolean {
  const all = read<Favorite[]>(K_FAVS, []);
  const idx = all.findIndex((f) => f.slug === fav.slug);
  if (idx === -1) {
    all.push({ ...fav, addedAt: Date.now() });
    write(K_FAVS, all);
    return true;
  }
  all.splice(idx, 1);
  write(K_FAVS, all);
  return false;
}

// ───────────────────────── Procedure visits ─────────────────────────

export function listVisits(): ProcedureVisit[] {
  return read<ProcedureVisit[]>(K_VISITS, []).sort((a, b) => b.lastVisit - a.lastVisit);
}
export function recordVisit(v: Omit<ProcedureVisit, "lastVisit" | "visits"> & Partial<Pick<ProcedureVisit, "listened" | "asked">>): void {
  const all = read<ProcedureVisit[]>(K_VISITS, []);
  const existing = all.find((x) => x.slug === v.slug);
  if (existing) {
    existing.lastVisit = Date.now();
    existing.visits += 1;
    if (v.listened) existing.listened = true;
    if (v.asked) existing.asked = true;
  } else {
    all.push({
      slug: v.slug,
      title: v.title,
      category: v.category,
      lastVisit: Date.now(),
      visits: 1,
      listened: v.listened,
      asked: v.asked,
    });
  }
  write(K_VISITS, all);
}

// ───────────────────────── Profile ─────────────────────────

export function getProfile(): CitizenProfile {
  return read<CitizenProfile>(K_PROFILE, { name: "Mamadou D.", phone: "+221 77 000 00 00", preferredLang: "fr" });
}
export function saveProfile(p: CitizenProfile): void {
  write(K_PROFILE, p);
}
