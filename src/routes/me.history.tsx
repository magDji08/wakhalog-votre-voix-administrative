import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mic, History, Trash2, MessageCircle, Search } from "lucide-react";

export const Route = createFileRoute("/me/history")({
  head: () => ({
    meta: [
      { title: "Mon historique · Wakhalog" },
      { name: "description", content: "Retrouvez vos questions posées à l'assistant Wakhalog." },
    ],
  }),
  component: HistoryPage,
});

type StoredMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  createdAt: number;
};

type Pair = {
  id: string;
  question: string;
  answer: string;
  category: string;
  date: number;
};

function inferCategory(q: string): string {
  const l = q.toLowerCase();
  if (/(naissance|extrait)/.test(l)) return "État civil";
  if (/(passeport|voyage|cni|carte d'identité|identité)/.test(l)) return "Identité";
  if (/(casier|justice)/.test(l)) return "Justice";
  if (/(santé|cmu|maladie)/.test(l)) return "Santé";
  if (/(bourse|école|étudiant)/.test(l)) return "Éducation";
  return "Général";
}

function HistoryPage() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wakhalog_history");
      if (raw) setMessages(JSON.parse(raw) as StoredMessage[]);
    } catch {
      /* ignore */
    }
  }, []);

  const pairs: Pair[] = useMemo(() => {
    const out: Pair[] = [];
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      if (m.role === "user") {
        const next = messages[i + 1];
        out.push({
          id: m.id,
          question: m.text,
          answer: next?.role === "bot" ? next.text : "—",
          category: inferCategory(m.text),
          date: m.createdAt,
        });
      }
    }
    return out.reverse();
  }, [messages]);

  const filtered = pairs.filter((p) =>
    query.trim() === ""
      ? true
      : p.question.toLowerCase().includes(query.toLowerCase()) ||
        p.answer.toLowerCase().includes(query.toLowerCase()),
  );

  const clearAll = () => {
    localStorage.removeItem("wakhalog_history");
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Wakhalog</span>
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au chat
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">
              <History className="h-3.5 w-3.5" /> Mon historique
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Vos questions à <span className="text-gradient">Wakhalog</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Retrouvez vos précédentes questions, leurs réponses et leur catégorie.
            </p>
          </div>
          {pairs.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Tout effacer
            </button>
          )}
        </div>

        {pairs.length > 0 && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans vos questions…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        )}

        <div className="mt-8 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-display text-lg font-semibold">Aucune question pour l'instant</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Commencez à parler avec Wakhalog pour voir apparaître votre historique ici.
              </p>
              <Link
                to="/chat"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Mic className="h-4 w-4" /> Parler à Wakhalog
              </Link>
            </div>
          ) : (
            filtered.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5">
                    {p.category}
                  </span>
                  <time>{new Date(p.date).toLocaleString("fr-FR")}</time>
                </div>
                <h2 className="mt-2 font-display text-base font-bold">{p.question}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.answer}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
