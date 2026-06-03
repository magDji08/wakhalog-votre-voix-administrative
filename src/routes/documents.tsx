import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { FileText, Download, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents simulés · Wakhalog" }] }),
  component: DocsPage,
});

const DOCS = [
  { title: "Extrait de naissance", count: 312, type: "État civil" },
  { title: "Casier judiciaire B3", count: 187, type: "Justice" },
  { title: "Certificat de résidence", count: 144, type: "État civil" },
  { title: "Attestation CMU", count: 98, type: "Santé" },
];

function DocsPage() {
  return (
    <AppShell title="Documents simulés" subtitle="PDF de démonstration générés par le pipeline">
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-secondary/40 bg-secondary/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <div>
          <p className="font-medium text-secondary">Documents simulés — sans valeur juridique</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ces PDF sont générés à des fins de démonstration. Pour obtenir des documents officiels,
            le citoyen doit suivre la procédure administrative réelle. Wakhalog fournit uniquement
            l'information sur la démarche.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DOCS.map((d) => (
          <div key={d.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{d.title}</h3>
            <p className="text-xs text-muted-foreground">{d.type}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm">
                <span className="font-bold">{d.count}</span> générés
              </span>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                <Download className="h-3.5 w-3.5" /> Modèle
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
