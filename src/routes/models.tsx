import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Mic, Brain, Volume2, ExternalLink, Cpu } from "lucide-react";

export const Route = createFileRoute("/models")({
  head: () => ({ meta: [{ title: "Modèles IA · Wakhalog" }] }),
  component: ModelsPage,
});

const MODELS = [
  {
    type: "ASR",
    name: "Whisper-Wolof-Mag-ASR",
    base: "openai/whisper-small",
    version: "v1.2",
    metric: "WER 19.4%",
    date: "28/05/2026",
    icon: Mic,
    color: "primary",
    link: "huggingface.co/Magdji08/whisper-wolof-mag-asr",
    active: true,
  },
  {
    type: "Traduction + NLU",
    name: "Gemini 1.5 Flash",
    base: "google/gemini-1.5-flash",
    version: "API",
    metric: "F1 0.89",
    date: "—",
    icon: Brain,
    color: "secondary",
    link: "ai.google.dev",
    active: true,
  },
  {
    type: "LLM local (fallback)",
    name: "Llama 3.2 (Ollama)",
    base: "meta-llama/Llama-3.2-3B",
    version: "3B-Instruct",
    metric: "Local CPU",
    date: "10/04/2026",
    icon: Cpu,
    color: "accent",
    link: "ollama.com/library/llama3.2",
    active: false,
  },
  {
    type: "TTS",
    name: "SpeechT5 Wolof",
    base: "microsoft/speecht5_tts",
    version: "fine-tuned",
    metric: "MOS 4.2/5",
    date: "15/05/2026",
    icon: Volume2,
    color: "primary",
    link: "huggingface.co",
    active: true,
  },
];

function ModelsPage() {
  return (
    <AppShell title="Modèles IA" subtitle="Pipeline ASR → NLU → TTS">
      <div className="grid gap-4 md:grid-cols-2">
        {MODELS.map((m) => {
          const cls =
            m.color === "primary" ? "bg-primary/10 text-primary"
            : m.color === "secondary" ? "bg-secondary/10 text-secondary"
            : "bg-accent/10 text-accent";
          return (
            <div key={m.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${cls}`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.type}</p>
                    <h3 className="font-display text-lg font-bold">{m.name}</h3>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${m.active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {m.active ? "Actif" : "Inactif"}
                </span>
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <Row label="Base">{m.base}</Row>
                <Row label="Version">{m.version}</Row>
                <Row label="Métrique">{m.metric}</Row>
                <Row label="Dernier entraînement">{m.date}</Row>
              </dl>
              <a
                href={`https://${m.link}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {m.link} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs">{children}</dd>
    </div>
  );
}
