import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Trash2, MessageCircle, Mic, Plus } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import {
  listConversations,
  deleteConversation,
  migrateLegacy,
  bucketOf,
  BUCKET_LABEL,
  type Conversation,
  type ConvBucket,
} from "@/lib/citizen-store";

export const Route = createFileRoute("/me/conversations")({
  head: () => ({ meta: [{ title: "Mes conversations · Wakhalog" }] }),
  component: ConvList,
});

function ConvList() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    migrateLegacy();
    setConvs(listConversations());
  }, []);

  const filtered = convs.filter((c) =>
    q.trim() === ""
      ? true
      : c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q.toLowerCase())),
  );

  const grouped = filtered.reduce<Record<ConvBucket, Conversation[]>>(
    (acc, c) => {
      acc[bucketOf(c.updatedAt)].push(c);
      return acc;
    },
    { today: [], yesterday: [], week: [], older: [] },
  );

  const onDelete = (id: string) => {
    if (!confirm("Supprimer cette conversation ?")) return;
    deleteConversation(id);
    setConvs(listConversations());
  };

  return (
    <MeShell title="Mes conversations" subtitle="Historique de vos échanges avec Wakhalog">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher une conversation…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nouvelle conversation
        </Link>
      </div>

      {convs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Aucune conversation</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Démarrez une discussion avec Wakhalog pour la retrouver ici.
          </p>
          <Link
            to="/chat"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Mic className="h-4 w-4" /> Parler à Wakhalog
          </Link>
        </div>
      ) : (
        (Object.keys(grouped) as ConvBucket[]).map((bk) =>
          grouped[bk].length === 0 ? null : (
            <section key={bk} className="mb-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {BUCKET_LABEL[bk]}
              </h2>
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">
                {grouped[bk].map((c) => (
                  <div key={c.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
                    <Link
                      to="/me/conversations/$id"
                      params={{ id: c.id }}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {c.messages.length} message{c.messages.length > 1 ? "s" : ""} ·{" "}
                          {new Date(c.updatedAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ),
        )
      )}
    </MeShell>
  );
}
