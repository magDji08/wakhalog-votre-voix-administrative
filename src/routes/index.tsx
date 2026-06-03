import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, ArrowRight, Languages, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wakhalog — Assistant vocal Wolof–Français" },
      {
        name: "description",
        content:
          "Wakhalog démocratise l'accès aux services publics sénégalais grâce à un assistant vocal bilingue Wolof–Français.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Wakhalog</span>
          </Link>
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Connexion <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-bg">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden></div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Inclusion numérique · Sénégal
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            L'administration sénégalaise
            <br />
            <span className="text-gradient">à portée de voix.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Wakhalog est un assistant vocal bilingue Wolof–Français qui guide les citoyens
            dans leurs démarches administratives, sans nécessiter la maîtrise du français écrit.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground glow-primary transition hover:opacity-90"
            >
              Accéder à la plateforme <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-6 py-3 font-medium backdrop-blur transition hover:bg-muted"
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Languages,
              title: "Bilingue Wolof–Français",
              desc: "ASR Whisper fine-tuné sur le wolof, comprend le code-switching naturel.",
            },
            {
              icon: Sparkles,
              title: "Informations fiables",
              desc: "RAG sur sources officielles (e-Sénégal, ministères, mairies).",
            },
            {
              icon: Shield,
              title: "Sécurisé par OTP",
              desc: "Authentification SMS, gestion des rôles et traçabilité complète.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 text-left transition hover:border-primary/50"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 Wakhalog · Wax ak sa administration ci sa làkk
      </footer>
    </div>
  );
}
