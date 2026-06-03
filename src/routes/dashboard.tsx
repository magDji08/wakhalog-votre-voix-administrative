import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Users, MessagesSquare, Mic, Clock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord · Wakhalog" }] }),
  component: Dashboard,
});

const daily = [
  { day: "Lun", n: 42 },
  { day: "Mar", n: 58 },
  { day: "Mer", n: 71 },
  { day: "Jeu", n: 65 },
  { day: "Ven", n: 89 },
  { day: "Sam", n: 53 },
  { day: "Dim", n: 38 },
];

const recent = [
  { user: "Mamadou D.", q: "Naka laay ame extrait de naissance ?", intent: "demande_extrait", lang: "Wolof", t: "1.4s" },
  { user: "Awa S.", q: "Comment renouveler ma CNI ?", intent: "demande_cni", lang: "Français", t: "1.1s" },
  { user: "Ibrahima F.", q: "Yabal ma casier judiciaire", intent: "demande_casier", lang: "Wolof", t: "1.7s" },
  { user: "Fatou N.", q: "Délai pour un passeport ?", intent: "demande_passeport", lang: "Français", t: "0.9s" },
  { user: "Cheikh B.", q: "Ñaata la CMU di jar ?", intent: "demande_cmu", lang: "Wolof", t: "1.3s" },
];

function Dashboard() {
  const max = Math.max(...daily.map((d) => d.n));
  return (
    <AppShell title="Tableau de bord" subtitle="Vue d'ensemble de l'activité Wakhalog">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Utilisateurs" value="1 248" delta="+12% cette semaine" icon={Users} />
        <StatCard label="Conversations" value="3 612" delta="+8.4%" icon={MessagesSquare} />
        <StatCard label="Questions traitées" value="9 871" delta="+18%" icon={Mic} />
        <StatCard label="Temps moyen" value="1.2s" delta="-120ms" icon={Clock} trend="up" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Activité quotidienne</h2>
              <p className="text-sm text-muted-foreground">Conversations traitées sur 7 jours</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              <TrendingUp className="h-3 w-3" /> +18%
            </span>
          </div>
          <div className="mt-8 flex h-48 items-end gap-3">
            {daily.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary transition hover:opacity-80"
                  style={{ height: `${(d.n / max) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">Répartition langues</h2>
          <p className="text-sm text-muted-foreground">Sur les 30 derniers jours</p>
          <div className="mt-6 space-y-4">
            {[
              { lang: "Wolof", pct: 64, color: "bg-primary" },
              { lang: "Français", pct: 28, color: "bg-secondary" },
              { lang: "Code-switching", pct: 8, color: "bg-accent" },
            ].map((l) => (
              <div key={l.lang}>
                <div className="flex justify-between text-sm">
                  <span>{l.lang}</span>
                  <span className="text-muted-foreground">{l.pct}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className={`h-full rounded-full ${l.color}`} style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="font-display text-lg font-bold">Dernières conversations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3">Utilisateur</th>
                <th className="px-6 py-3">Question</th>
                <th className="px-6 py-3">Intent</th>
                <th className="px-6 py-3">Langue</th>
                <th className="px-6 py-3">Réponse</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">{r.user}</td>
                  <td className="px-6 py-3 text-muted-foreground">{r.q}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{r.intent}</span>
                  </td>
                  <td className="px-6 py-3">{r.lang}</td>
                  <td className="px-6 py-3 font-mono text-xs">{r.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
