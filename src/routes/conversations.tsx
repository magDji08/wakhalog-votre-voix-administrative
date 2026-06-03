import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";
import { Search, Play, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/conversations")({
  head: () => ({ meta: [{ title: "Conversations · Wakhalog" }] }),
  component: () => (
    <RoleGuard permission="page:conversations">
      <ConversationsPage />
    </RoleGuard>
  ),
});

const CONVERSATIONS = [
  { id: 1, user: "Mamadou Diop", q: "Naka laay ame extrait de naissance ?", intent: "demande_extrait", lang: "Wolof", date: "03/06/2026 14:22", t: "1.4s", asr: "Naka laay ame extrait de naissance", trad: "Comment puis-je obtenir un extrait de naissance ?", resp: "Pour obtenir un extrait de naissance, rendez-vous à la mairie de votre commune avec une pièce d'identité..." },
  { id: 2, user: "Awa Sow", q: "Comment renouveler ma CNI ?", intent: "demande_cni", lang: "Français", date: "03/06/2026 13:58", t: "1.1s", asr: "Comment renouveler ma CNI", trad: "—", resp: "Le renouvellement de la CNI se fait au commissariat ou à la sous-préfecture..." },
  { id: 3, user: "Ibrahima Fall", q: "Yabal ma casier judiciaire", intent: "demande_casier", lang: "Wolof", date: "03/06/2026 12:10", t: "1.7s", asr: "Yabal ma casier judiciaire", trad: "Envoyez-moi un casier judiciaire", resp: "Le casier judiciaire (bulletin n°3) s'obtient au tribunal de votre lieu de naissance..." },
  { id: 4, user: "Fatou Ndiaye", q: "Délai pour un passeport ?", intent: "demande_passeport", lang: "Français", date: "03/06/2026 11:44", t: "0.9s", asr: "Délai pour un passeport", trad: "—", resp: "Le délai moyen d'obtention d'un passeport biométrique est de 10 à 15 jours ouvrés..." },
];

function ConversationsPage() {
  const [selected, setSelected] = useState(CONVERSATIONS[0]);

  return (
    <AppShell title="Conversations" subtitle="Historique complet des échanges">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* List */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Rechercher..."
                  className="w-full rounded-lg border border-border bg-input pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2 text-sm hover:bg-muted">
                <Filter className="h-4 w-4" /> Filtrer
              </button>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {CONVERSATIONS.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c)}
                  className={`w-full px-4 py-4 text-left transition hover:bg-muted/30 ${
                    selected.id === c.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{c.user}</p>
                    <span className="text-xs text-muted-foreground">{c.date.split(" ")[1]}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{c.q}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{c.intent}</span>
                    <span className="text-xs text-muted-foreground">{c.lang}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Detail */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{selected.user}</h2>
              <p className="text-sm text-muted-foreground">{selected.date} · {selected.t}</p>
            </div>
            <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {selected.intent}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <Section title="🎙️ Audio utilisateur">
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                <Play className="h-4 w-4" /> Écouter (4.2s)
              </button>
            </Section>
            <Section title="📝 Texte ASR (Whisper-Wolof)">
              <p className="rounded-lg bg-muted/40 p-3 text-sm">{selected.asr}</p>
            </Section>
            <Section title="🌐 Traduction Gemini">
              <p className="rounded-lg bg-muted/40 p-3 text-sm">{selected.trad}</p>
            </Section>
            <Section title="📚 Chunks RAG utilisés">
              <ul className="space-y-2 text-sm">
                <li className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-secondary">Source: senegalservices.sn</p>
                  <p className="mt-1 text-muted-foreground">Extrait de naissance — procédure et coûts...</p>
                </li>
              </ul>
            </Section>
            <Section title="💬 Réponse finale">
              <p className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">{selected.resp}</p>
            </Section>
            <Section title="🔊 Audio TTS (SpeechT5 Wolof)">
              <button className="inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20">
                <Play className="h-4 w-4" /> Écouter la réponse
              </button>
            </Section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
