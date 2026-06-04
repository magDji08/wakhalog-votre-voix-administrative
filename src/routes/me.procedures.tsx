import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Clock, Coins, ArrowRight, CheckCircle2 } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { loadConversations, uniqueTopics, type Conversation } from "@/lib/me-store";
import { getService } from "@/lib/services-catalog";

export const Route = createFileRoute("/me/procedures")({
  head: () => ({ meta: [{ title: "Mes démarches · Wakhalog" }] }),
  component: ProceduresPage,
});

function ProceduresPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  useEffect(() => setConvs(loadConversations()), []);
  const topics = uniqueTopics(convs);

  return (
    <MeShell
      title="Mes démarches"
      subtitle="Les procédures que vous avez consultées avec Wakhalog."
    >
      {topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Aucune démarche consultée</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Posez une question sur une démarche depuis le chat ou la bibliothèque.
          </p>
          <Link
            to="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Explorer les démarches
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {topics.map((t) => {
            const meta = getService(t.slug);
            const lastConv = convs.find((c) => c.topic === t.slug);
            return (
              <article
                key={t.slug}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="eyebrow text-accent">{meta.category}</p>
                    <h3 className="mt-1 font-display text-lg font-bold">{meta.title}</h3>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {t.count}× consultée
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1.5">
                    <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{meta.cost}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{meta.delay}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Lu la procédure
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Posé une question
                  </p>
                  <p className="text-[11px]">
                    Dernière consultation : {new Date(t.lastAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to="/services/$slug"
                    params={{ slug: t.slug }}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs hover:bg-muted"
                  >
                    Voir la fiche
                  </Link>
                  <Link
                    to="/chat"
                    search={{ topic: t.slug, c: lastConv?.id }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Reprendre <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </MeShell>
  );
}
