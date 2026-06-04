import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, ExternalLink, CheckCircle2, Mic } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { listVisits, type ProcedureVisit } from "@/lib/citizen-store";

export const Route = createFileRoute("/me/procedures")({
  head: () => ({ meta: [{ title: "Mes démarches · Wakhalog" }] }),
  component: MyProcedures,
});

function MyProcedures() {
  const [visits, setVisits] = useState<ProcedureVisit[]>([]);
  useEffect(() => setVisits(listVisits()), []);

  return (
    <MeShell title="Mes démarches" subtitle="Les fiches que vous avez consultées">
      {visits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Aucune démarche consultée</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Parcourez le catalogue pour découvrir les procédures.
          </p>
          <Link
            to="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Voir les démarches
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visits.map((v) => (
            <article key={v.slug} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[11px] uppercase tracking-wide text-accent">{v.category}</p>
              <h3 className="mt-1 font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Dernière consultation : {new Date(v.lastVisit).toLocaleDateString("fr-FR")} · {v.visits}{" "}
                visite{v.visits > 1 ? "s" : ""}
              </p>

              <div className="mt-3 space-y-1.5 text-xs">
                <Check label="Fiche consultée" ok />
                <Check label="Écoutée en wolof" ok={!!v.listened} />
                <Check label="Question posée" ok={!!v.asked} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/services/$slug"
                  params={{ slug: v.slug }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
                >
                  <ExternalLink className="h-3 w-3" /> Voir la fiche
                </Link>
                <Link
                  to="/chat"
                  search={{ topic: v.slug } as never}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  <Mic className="h-3 w-3" /> Poser une question
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </MeShell>
  );
}

function Check({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${ok ? "text-foreground" : "text-muted-foreground/60"}`}>
      <CheckCircle2 className={`h-3.5 w-3.5 ${ok ? "text-green-600" : "text-muted-foreground/40"}`} />
      {label}
    </div>
  );
}
