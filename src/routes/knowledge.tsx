import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Plus, FileUp, Edit3, Archive, ExternalLink } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Base de connaissances · Wakhalog" }] }),
  component: KnowledgePage,
});

const CATEGORIES = [
  { id: "etat-civil", label: "État civil", count: 8 },
  { id: "justice", label: "Justice", count: 4 },
  { id: "sante", label: "Santé", count: 6 },
  { id: "education", label: "Éducation", count: 5 },
  { id: "identite", label: "Identité", count: 7 },
  { id: "social", label: "Social", count: 3 },
];

const PROCEDURES = [
  { cat: "etat-civil", title: "Extrait de naissance", cost: "1 000 FCFA", delay: "24-48h", source: "senegalservices.sn", updated: "12/05/2026" },
  { cat: "identite", title: "Carte nationale d'identité (CEDEAO)", cost: "5 000 FCFA", delay: "7-15 jours", source: "passeport.sec.gouv.sn", updated: "20/05/2026" },
  { cat: "identite", title: "Passeport biométrique", cost: "20 000 FCFA", delay: "10-15 jours", source: "passeport.sec.gouv.sn", updated: "18/05/2026" },
  { cat: "justice", title: "Casier judiciaire (Bulletin n°3)", cost: "1 200 FCFA", delay: "48h", source: "justice.gouv.sn", updated: "02/06/2026" },
  { cat: "etat-civil", title: "Certificat de résidence", cost: "1 000 FCFA", delay: "24h", source: "Mairie de commune", updated: "10/05/2026" },
  { cat: "sante", title: "Carte CMU", cost: "Gratuit", delay: "Variable", source: "agencecmu.sn", updated: "28/04/2026" },
];

function KnowledgePage() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? PROCEDURES : PROCEDURES.filter((p) => p.cat === active);

  return (
    <AppShell
      title="Base de connaissances"
      subtitle="Procédures administratives officielles indexées par RAG"
      actions={
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted">
            <FileUp className="h-4 w-4" /> Importer PDF
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Nouvelle fiche
          </button>
        </div>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Pill active={active === "all"} onClick={() => setActive("all")}>
          Toutes ({PROCEDURES.length})
        </Pill>
        {CATEGORIES.map((c) => (
          <Pill key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
            {c.label} ({c.count})
          </Pill>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.title} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-bold">{p.title}</h3>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {CATEGORIES.find((c) => c.id === p.cat)?.label}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Coût" value={p.cost} />
              <Row label="Délai" value={p.delay} />
              <Row label="Source" value={p.source} />
              <Row label="Mise à jour" value={p.updated} />
            </dl>
            <div className="mt-5 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                <Edit3 className="h-3.5 w-3.5" /> Modifier
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/70">
                <ExternalLink className="h-3.5 w-3.5" /> Voir
              </button>
              <button className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Archive className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
