import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, MessageSquare, Trash2, PlayCircle, Plus } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import {
  clearConversations,
  deleteConversation,
  groupByDay,
  loadConversations,
  type Conversation,
} from "@/lib/me-store";
import { getService } from "@/lib/services-catalog";

export const Route = createFileRoute("/me/conversations")({
  head: () => ({ meta: [{ title: "Mes conversations · Wakhalog" }] }),
  component: ConversationsPage,
});

function ConversationsPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setConvs(loadConversations());
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return convs;
    const q = query.toLowerCase();
    return convs.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q)),
    );
  }, [convs, query]);

  const groups = groupByDay(filtered);

  const removeOne = (id: string) => {
    deleteConversation(id);
    setConvs(loadConversations());
  };

  return (
    <MeShell
      title="Mes conversations"
      subtitle="Retrouvez toutes vos discussions avec Wakhalog, comme une boîte de réception."
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans vos conversations…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          {convs.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Tout effacer ? Cette action est irréversible.")) {
                  clearConversations();
                  setConvs([]);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Tout effacer
            </button>
          )}
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvelle
          </Link>
        </div>
      </div>

      {convs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Aucune conversation</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez votre première discussion avec Wakhalog.
          </p>
          <Link
            to="/chat"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Lancer une conversation
          </Link>
        </div>
      )}

      <Section label="Aujourd'hui" items={groups.today} onDelete={removeOne} />
      <Section label="Hier" items={groups.yesterday} onDelete={removeOne} />
      <Section label="Cette semaine" items={groups.week} onDelete={removeOne} />
      <Section label="Plus ancien" items={groups.older} onDelete={removeOne} />
    </MeShell>
  );
}

function Section({
  label,
  items,
  onDelete,
}: {
  label: string;
  items: Conversation[];
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </h2>
      <div className="space-y-2">
        {items.map((c) => {
          const lastMsg = c.messages[c.messages.length - 1];
          return (
            <article
              key={c.id}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30"
            >
              <Link
                to="/chat"
                search={{ c: c.id, topic: c.topic }}
                className="min-w-0 flex-1"
              >
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-sm font-bold">{c.title}</p>
                  {c.topic && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {getService(c.topic).category}
                    </span>
                  )}
                </div>
                {lastMsg && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {lastMsg.role === "user" ? "Vous : " : "Wakhalog : "}
                    {lastMsg.text}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {new Date(c.updatedAt).toLocaleString("fr-FR")} · {c.messages.length} messages
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <Link
                  to="/chat"
                  search={{ c: c.id, topic: c.topic }}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                  title="Reprendre"
                >
                  <PlayCircle className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => onDelete(c.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
