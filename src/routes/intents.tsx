import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";
import { Target, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/intents")({
  head: () => ({ meta: [{ title: "Intentions · Wakhalog" }] }),
  component: () => (
    <RoleGuard permission="page:intents">
      <IntentsPage />
    </RoleGuard>
  ),
});

const INTENTS = [
  { name: "demande_extrait_naissance", usage: 1248, success: 96, confidence: 0.92 },
  { name: "demande_cni", usage: 892, success: 94, confidence: 0.89 },
  { name: "demande_passeport", usage: 745, success: 91, confidence: 0.88 },
  { name: "demande_casier", usage: 612, success: 95, confidence: 0.91 },
  { name: "demande_cmu", usage: 421, success: 87, confidence: 0.83 },
  { name: "demande_residence", usage: 388, success: 93, confidence: 0.9 },
  { name: "faq_general", usage: 287, success: 82, confidence: 0.78 },
  { name: "fournir_information", usage: 1502, success: 88, confidence: 0.85 },
];

function IntentsPage() {
  return (
    <AppShell title="Intentions" subtitle="Détection NLU et performances par intent">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-4">Intent</th>
              <th className="px-6 py-4">Utilisations</th>
              <th className="px-6 py-4">Taux de réussite</th>
              <th className="px-6 py-4">Confiance moyenne</th>
              <th className="px-6 py-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {INTENTS.map((it) => (
              <tr key={it.name} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Target className="h-4 w-4" />
                    </div>
                    <code className="font-mono text-sm">{it.name}</code>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{it.usage.toLocaleString("fr-FR")}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${it.success >= 90 ? "bg-accent" : it.success >= 80 ? "bg-secondary" : "bg-destructive"}`}
                        style={{ width: `${it.success}%` }}
                      />
                    </div>
                    <span className="text-xs">{it.success}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">{it.confidence.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {it.confidence >= 0.85 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                      <TrendingUp className="h-3 w-3" /> Bon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-xs text-secondary">
                      <AlertCircle className="h-3 w-3" /> À affiner
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
