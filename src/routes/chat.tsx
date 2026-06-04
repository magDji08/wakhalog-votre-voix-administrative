import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Send,
  Paperclip,
  ArrowLeft,
  Bot,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bug,
  Clock,
  Coins,
  FileCheck2,
  BadgeCheck,
  Languages,
  Volume2,
  PanelRightClose,
  PanelRightOpen,
  Wand2,
} from "lucide-react";
import { useTTS } from "@/lib/use-tts";

// ───────────────────────────────────────────────────────────
// Search params
// ───────────────────────────────────────────────────────────

type ChatSearch = {
  voice?: 1 | 0;
  intent?: "discovery" | undefined;
  topic?: string;
};

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Wakhalog · Assistant vocal Wolof–Français" },
      {
        name: "description",
        content:
          "Posez vos questions sur les démarches administratives sénégalaises en wolof ou en français.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): ChatSearch => ({
    voice: s.voice === "1" || s.voice === 1 ? 1 : undefined,
    intent: s.intent === "discovery" ? "discovery" : undefined,
    topic: typeof s.topic === "string" ? s.topic : undefined,
  }),
  component: ChatPage,
});

// ───────────────────────────────────────────────────────────
// Mock topic catalog (mirrors /services slugs)
// ───────────────────────────────────────────────────────────

type TopicCtx = {
  slug: string;
  title: string;
  category: string;
  cost: string;
  delay: string;
  docs: number;
  source: string;
};

const TOPICS: Record<string, TopicCtx> = {
  "extrait-naissance": {
    slug: "extrait-naissance",
    title: "Extrait de naissance",
    category: "État civil",
    cost: "1 000 FCFA",
    delay: "1 jour",
    docs: 2,
    source: "senegalservices.sn",
  },
  cni: {
    slug: "cni",
    title: "Carte nationale d'identité (CEDEAO)",
    category: "Identité",
    cost: "5 000 FCFA",
    delay: "7-15 jours",
    docs: 3,
    source: "passeport.sec.gouv.sn",
  },
  passeport: {
    slug: "passeport",
    title: "Passeport biométrique",
    category: "Identité",
    cost: "20 000 FCFA",
    delay: "10-15 jours",
    docs: 4,
    source: "passeport.sec.gouv.sn",
  },
  "certificat-residence": {
    slug: "certificat-residence",
    title: "Certificat de résidence",
    category: "État civil",
    cost: "1 000 FCFA",
    delay: "1 jour",
    docs: 2,
    source: "Mairie de commune",
  },
};

// ───────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────

type DebugMeta = {
  asr?: string;
  intent: string;
  sources: string[];
  latencyMs: number;
  model: string;
  confidence: number;
};

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  lang?: "fr" | "wo";
  debug?: DebugMeta;
  createdAt: number;
};

const MODEL = "gemini-3-flash-preview · whisper-large-v3 · xtts-wolof-v1";

// Tiny deterministic mock responder so the demo feels alive without a backend.
function mockReply(q: string, topic?: TopicCtx): { text: string; debug: DebugMeta } {
  const lower = q.toLowerCase();
  const intent =
    /(coût|cout|combien|prix|tarif)/.test(lower)
      ? "info_cout"
      : /(délai|delai|temps|jour|combien de temps)/.test(lower)
        ? "info_delai"
        : /(document|papier|pièce|piece)/.test(lower)
          ? "info_documents"
          : topic
            ? `demande_${topic.slug.replace(/-/g, "_")}`
            : "discovery_generale";

  let text = "";
  if (topic) {
    if (intent === "info_cout") text = `Le coût est de ${topic.cost} (source : ${topic.source}).`;
    else if (intent === "info_delai") text = `Le délai moyen est de ${topic.delay}.`;
    else if (intent === "info_documents")
      text = `Vous aurez besoin de ${topic.docs} documents principaux. La liste détaillée est sur la fiche.`;
    else
      text = `Pour « ${topic.title} », je peux vous expliquer les étapes, le coût (${topic.cost}), le délai (${topic.delay}) ou les documents requis. Que voulez-vous savoir ?`;
  } else {
    text = `Je peux vous orienter vers une démarche. Précisez votre besoin : naissance, identité, passeport, casier judiciaire, résidence…`;
  }

  return {
    text,
    debug: {
      asr: undefined,
      intent,
      sources: topic ? [topic.source, "service-public.sn"] : ["service-public.sn"],
      latencyMs: 800 + Math.floor(Math.random() * 600),
      model: MODEL,
      confidence: 0.78 + Math.random() * 0.18,
    },
  };
}

// ───────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────

function ChatPage() {
  const { voice, intent, topic } = Route.useSearch();
  const topicCtx = topic ? TOPICS[topic] : undefined;

  const [lang, setLang] = useState<"fr" | "wo">("fr");
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(() => seedMessages(intent, topicCtx));
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Auto-start listening if ?voice=1
  useEffect(() => {
    if (voice === 1) setListening(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist conversation in localStorage so /me/history works.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wakhalog_history");
      const arr = raw ? (JSON.parse(raw) as Message[]) : [];
      const lastSaved = arr[arr.length - 1]?.id;
      const newOnes = messages.filter((m) => m.role === "bot" || m.role === "user");
      if (newOnes.length && newOnes[newOnes.length - 1].id !== lastSaved) {
        localStorage.setItem("wakhalog_history", JSON.stringify(messages));
      }
    } catch {
      /* ignore */
    }
  }, [messages]);

  const send = (raw?: string) => {
    const q = (raw ?? input).trim();
    if (!q) return;
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      text: q,
      lang,
      createdAt: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    // Simulated streaming reply
    setTimeout(() => {
      const { text, debug } = mockReply(q, topicCtx);
      const botMsg: Message = {
        id: `b_${Date.now()}`,
        role: "bot",
        text,
        lang,
        debug: { ...debug, asr: listening ? q : undefined },
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
    }, 650);
  };

  const toggleMic = () => {
    setListening((v) => !v);
    if (!listening) {
      // Demo: simulate a recognized utterance after a short pause
      setTimeout(() => {
        send(topicCtx ? `Combien coûte ${topicCtx.title.toLowerCase()} ?` : "Comment obtenir un passeport ?");
        setListening(false);
      }, 1800);
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "wo" ? "fr-FR" : "fr-FR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const suggestions = useMemo(
    () =>
      topicCtx
        ? [
            `Combien coûte ${topicCtx.title.toLowerCase()} ?`,
            `Quel est le délai pour ${topicCtx.title.toLowerCase()} ?`,
            `Quels documents pour ${topicCtx.title.toLowerCase()} ?`,
          ]
        : [
            "Ma fille vient de naître",
            "Je veux voyager à l'étranger",
            "J'ai perdu ma carte d'identité",
            "Comment obtenir un casier judiciaire ?",
          ],
    [topicCtx],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Wakhalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 text-xs md:flex">
              {(["fr", "wo"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {l === "fr" && <Languages className="h-3 w-3" />}
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              to="/services"
              className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" /> Démarches
            </Link>
            {topicCtx && (
              <button
                onClick={() => setContextOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground lg:hidden"
                title="Contexte de la démarche"
              >
                {contextOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Body — 2 columns on desktop */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-4 lg:gap-6 lg:py-6">
        {/* Conversation column */}
        <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm">
          {/* Conversation header */}
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Wakhalog</p>
                <p className="text-[11px] text-muted-foreground">
                  {listening ? "À l'écoute…" : "En ligne · Wolof & Français"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDebugOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
              title="Afficher les détails IA"
            >
              <Bug className="h-3.5 w-3.5" />
              {debugOpen ? "Masquer" : "Détails IA"}
              {debugOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} m={m} debugOpen={debugOpen} onSpeak={speak} />
            ))}
            {listening && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative grid h-6 w-6 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
                  <Mic className="relative h-3.5 w-3.5 text-accent" />
                </span>
                Wakhalog vous écoute…
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-2.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => send("Je ne sais pas quelle démarche choisir")}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20"
              >
                <Mic className="h-3 w-3" />
                Je ne sais pas quelle démarche choisir
              </button>
            </div>
          )}

          {/* Composer */}
          <div className="border-t border-border/60 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2">
              <button
                title="Pièce jointe (bientôt)"
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder={
                  lang === "wo"
                    ? "Bindal sa laaj walla wax ko…"
                    : "Écrivez ou parlez à Wakhalog…"
                }
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={toggleMic}
                className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                  listening
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
                title="Parler"
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                title="Envoyer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Démo — réponses générées localement. Whisper + Gemini + RAG arrivent avec le backend.
            </p>
          </div>
        </section>

        {/* Context column */}
        {contextOpen && (
          <aside className="hidden w-80 shrink-0 flex-col gap-4 lg:flex">
            <ContextPanel topic={topicCtx} />
          </aside>
        )}
        {/* Mobile contextual sheet */}
        {contextOpen && topicCtx && (
          <div className="fixed inset-x-0 bottom-0 z-30 max-h-[60vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-4 shadow-2xl lg:hidden">
            <ContextPanel topic={topicCtx} />
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────────────────

function MessageBubble({
  m,
  debugOpen,
  onSpeak,
}: {
  m: Message;
  debugOpen: boolean;
  onSpeak: (text: string) => void;
}) {
  const isUser = m.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-2xl rounded-tl-sm border border-border/60 bg-muted text-foreground"
          }`}
        >
          {m.text}
        </div>
        {!isUser && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSpeak(m.text)}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              <Volume2 className="h-3 w-3" /> Écouter
            </button>
            {m.debug && debugOpen && <DebugChip d={m.debug} />}
          </div>
        )}
      </div>
      {isUser && (
        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          <UserIcon className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}

function DebugChip({ d }: { d: DebugMeta }) {
  return (
    <details className="text-[10px] text-muted-foreground">
      <summary className="cursor-pointer rounded-md border border-dashed border-border px-2 py-0.5 hover:text-foreground">
        Confiance IA : {(d.confidence * 100).toFixed(0)}% · {d.latencyMs}ms
      </summary>
      <div className="mt-1.5 space-y-1 rounded-lg border border-border bg-muted/40 p-2.5 font-mono text-[10px]">
        {d.asr && (
          <p>
            <span className="text-accent">ASR</span> → {d.asr}
          </p>
        )}
        <p>
          <span className="text-accent">Intent</span> → {d.intent}
        </p>
        <p>
          <span className="text-accent">Sources</span> → {d.sources.join(", ")}
        </p>
        <p>
          <span className="text-accent">Modèle</span> → {d.model}
        </p>
        <p>
          <span className="text-accent">Latence</span> → {d.latencyMs} ms
        </p>
      </div>
    </details>
  );
}

function ContextPanel({ topic }: { topic?: TopicCtx }) {
  if (!topic) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Mode découverte
        </div>
        <h3 className="mt-3 font-display text-lg font-bold">Aucune démarche sélectionnée</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Décrivez votre besoin et Wakhalog vous orientera vers la bonne procédure.
        </p>
        <Link
          to="/services"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted"
        >
          <Wand2 className="h-3.5 w-3.5" /> Parcourir les démarches
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="eyebrow text-accent">{topic.category}</p>
      <h3 className="mt-1 font-display text-xl font-bold">{topic.title}</h3>

      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3 text-center text-xs">
        <div>
          <dt className="text-[10px] uppercase text-muted-foreground">Docs</dt>
          <dd className="mt-0.5 font-bold">{topic.docs}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-muted-foreground">Coût</dt>
          <dd className="mt-0.5 font-bold">{topic.cost}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-muted-foreground">Délai</dt>
          <dd className="mt-0.5 font-bold">{topic.delay}</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-2 text-xs">
        <Row icon={<FileCheck2 className="h-3.5 w-3.5" />} label="Documents" value={`${topic.docs} requis`} />
        <Row icon={<Coins className="h-3.5 w-3.5" />} label="Coût" value={topic.cost} />
        <Row icon={<Clock className="h-3.5 w-3.5" />} label="Délai" value={topic.delay} />
        <Row icon={<BadgeCheck className="h-3.5 w-3.5 text-green-600" />} label="Source" value={topic.source} />
      </div>

      <Link
        to="/services/$slug"
        params={{ slug: topic.slug }}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
      >
        Voir la fiche complète
      </Link>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background px-3 py-2">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function seedMessages(intent: ChatSearch["intent"], topic?: TopicCtx): Message[] {
  const greeting =
    intent === "discovery"
      ? "Bonjour ! Décrivez-moi votre situation et je vous orienterai vers la bonne démarche. Vous pouvez parler en wolof ou en français."
      : topic
        ? `Bonjour ! Je peux vous aider sur « ${topic.title} ». Posez-moi votre question.`
        : "Bonjour, je suis Wakhalog. Comment puis-je vous aider aujourd'hui ?";
  return [
    {
      id: "seed",
      role: "bot",
      text: greeting,
      createdAt: Date.now(),
      debug: {
        intent: intent ?? "greeting",
        sources: [],
        latencyMs: 0,
        model: MODEL,
        confidence: 1,
      },
    },
  ];
}
