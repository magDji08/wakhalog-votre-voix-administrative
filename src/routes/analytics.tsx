import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";
import { Activity, Clock, TrendingDown, Mic, Brain, Volume2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Statistiques IA · Wakhalog" }] }),
  component: () => (
    <RoleGuard permission="page:analytics">
      <AnalyticsPage />
    </RoleGuard>
  ),
});

function AnalyticsPage() {
  return (
    <AppShell title="Statistiques IA" subtitle="Performances ASR · NLU · TTS">
      <div className="space-y-8">
        {/* ASR */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-gradient">ASR — Whisper Wolof</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="WER moyen" value="19.4%" delta="-2.1pts" icon={TrendingDown} />
            <StatCard label="Temps transcription" value="0.42s" delta="audio 4s" icon={Clock} />
            <StatCard label="Audios transcrits" value="9 871" delta="+18%" icon={Activity} />
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Erreurs fréquentes (top 5)</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { w: "extrait → estrè", n: 24 },
                { w: "judiciaire → jusiciè", n: 19 },
                { w: "passeport → passpor", n: 15 },
                { w: "biométrique → bimétric", n: 12 },
                { w: "résidence → résdans", n: 9 },
              ].map((e) => (
                <li key={e.w} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <code className="font-mono text-xs">{e.w}</code>
                  <span className="text-xs text-muted-foreground">{e.n} occurrences</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* NLU */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary" />
            <h2 className="font-display text-xl font-bold text-gradient">NLU — Gemini</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="F1 Score" value="0.89" delta="+0.04" icon={Activity} />
            <StatCard label="Intentions détectées" value="91.2%" delta="confiance ≥0.8" icon={Brain} />
            <StatCard label="Intentions ratées" value="8.8%" delta="-1.3pts" trend="up" icon={TrendingDown} />
          </div>
        </section>

        {/* TTS */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-gradient">TTS — SpeechT5 Wolof</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Temps génération" value="1.1s" delta="par 100 caractères" icon={Clock} />
            <StatCard label="Audios générés" value="9 412" delta="+15%" icon={Volume2} />
            <StatCard label="Note qualité" value="4.2 / 5" delta="évaluation MOS" icon={Activity} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
