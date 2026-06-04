import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mic,
  ArrowRight,
  Languages,
  Brain,
  BookOpen,
  Volume2,
  Search,
  Sparkles,
  ShieldCheck,
  Play,
  Heart,
  GraduationCap,
  Briefcase,
  FileText,
  Scale,
  IdCard,
  Stethoscope,
  Users,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wakhalog — Assistant vocal Wolof pour les services publics" },
      {
        name: "description",
        content:
          "Wakhalog est l'assistant vocal bilingue Wolof–Français qui guide les citoyens sénégalais dans leurs démarches administratives, sans maîtrise du français écrit.",
      },
      { property: "og:title", content: "Wakhalog — Wax ak sa administration ci sa làkk" },
      {
        property: "og:description",
        content:
          "Posez vos questions en wolof, obtenez des réponses fiables sur les services publics sénégalais.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <WhyWakhalog />
      <HowItWorks />
      <DemoBlock />
      <ServicesPreview />
      <Personas />
      <Stats />
      <ResponsibleBanner />
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Wakhalog</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#why" className="transition hover:text-foreground">Pourquoi</a>
          <a href="#how" className="transition hover:text-foreground">Fonctionnement</a>
          <a href="#demo" className="transition hover:text-foreground">Démo</a>
          <Link to="/services" className="transition hover:text-foreground">Services</Link>
        </nav>
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Connexion <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden></div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Inclusion numérique · Sénégal
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            Votre assistant vocal
            <br />
            pour les <span className="text-gradient">services publics</span> sénégalais.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Posez vos questions en wolof ou en français et obtenez des informations
            fiables sur les démarches administratives — sans maîtrise du français écrit.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground glow-primary transition hover:opacity-90"
            >
              Essayer maintenant <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-6 py-3 font-medium backdrop-blur transition hover:bg-muted"
            >
              Découvrir les services
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 via-secondary/20 to-transparent blur-3xl" />
            {/* Phone mockup */}
            <div className="relative mx-auto h-full w-[70%] rounded-[2.5rem] border border-border bg-card p-3 shadow-2xl">
              <div className="flex h-full flex-col rounded-[2rem] bg-gradient-to-br from-primary/90 to-primary p-5 text-primary-foreground">
                <div className="flex items-center justify-between text-xs opacity-70">
                  <span>9:41</span>
                  <span>Wakhalog</span>
                </div>
                <div className="mt-6 flex-1 space-y-3">
                  <div className="rounded-2xl bg-white/15 p-3 text-sm">
                    Naka lañu am extrait de naissance ?
                  </div>
                  <div className="rounded-2xl bg-accent/90 p-3 text-sm text-accent-foreground">
                    Pour obtenir un extrait de naissance, rendez-vous à la mairie de
                    votre lieu de naissance…
                  </div>
                </div>
                <div className="mt-4 grid place-items-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
                    <div className="relative grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg">
                      <Mic className="h-7 w-7" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Why Wakhalog                                                     */
/* ------------------------------------------------------------------ */

function WhyWakhalog() {
  const items = [
    {
      icon: Languages,
      title: "Parlez naturellement",
      desc: "Exprimez-vous en wolof ou en français. L'assistant comprend le code-switching naturel des Sénégalais.",
    },
    {
      icon: Brain,
      title: "Compréhension intelligente",
      desc: "ASR Whisper fine-tuné sur le wolof + Gemini pour identifier votre besoin avec précision.",
    },
    {
      icon: ShieldCheck,
      title: "Informations fiables",
      desc: "Réponses basées sur des sources officielles : senegalservices.sn, ministères, mairies.",
    },
  ];
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Pourquoi Wakhalog"
        title="Conçu pour les citoyens, pas pour les experts."
        subtitle="80% des Sénégalais ne maîtrisent pas le français écrit. Wakhalog supprime cette barrière."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. How it works                                                     */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    { icon: Mic, title: "Parlez", desc: "Le citoyen pose sa question en wolof ou français via micro." },
    { icon: Brain, title: "Compréhension IA", desc: "Whisper transcrit puis Gemini identifie l'intention." },
    { icon: Search, title: "Recherche RAG", desc: "Recherche sémantique dans la base de procédures officielles." },
    { icon: Volume2, title: "Réponse vocale", desc: "SpeechT5 lit la réponse en wolof ou en français." },
  ];
  return (
    <section id="how" className="border-y border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Fonctionnement"
          title="De la voix wolof à la réponse fiable, en 4 étapes."
          subtitle="Une chaîne technique transparente, pensée pour la fiabilité et la traçabilité."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-muted-foreground/50">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary/40 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Demo                                                             */
/* ------------------------------------------------------------------ */

function DemoBlock() {
  return (
    <section id="demo" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Démonstration"
        title="Voyez Wakhalog en action."
        subtitle="Un exemple typique d'interaction citoyen ↔ assistant."
      />
      <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Question */}
          <div className="border-b border-border bg-muted/30 p-8 md:border-b-0 md:border-r">
            <p className="eyebrow text-accent">Question · Wolof</p>
            <p className="mt-4 font-display text-2xl font-bold leading-snug">
              "Naka lañu am extrait de naissance ci Dakar ?"
            </p>
            <p className="mt-2 text-sm italic text-muted-foreground">
              Comment obtenir un extrait de naissance à Dakar ?
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
              <Play className="h-4 w-4" /> Écouter la question
            </button>
          </div>

          {/* Réponse */}
          <div className="p-8">
            <p className="eyebrow text-primary">Réponse · Sources officielles</p>
            <p className="mt-4 text-base leading-relaxed">
              Pour obtenir un extrait de naissance, rendez-vous à la <strong>mairie de votre lieu de naissance</strong>{" "}
              muni d'une pièce d'identité. Le coût est de <strong>1&nbsp;000 FCFA</strong> et le délai
              est de <strong>24 à 48 heures</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">Source : senegalservices.sn</span>
              <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">MAJ : 12/05/2026</span>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
              <Volume2 className="h-4 w-4" /> Écouter la réponse
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Services preview                                                 */
/* ------------------------------------------------------------------ */

function ServicesPreview() {
  const cats = [
    { icon: FileText, label: "État civil", count: 8 },
    { icon: IdCard, label: "Identité", count: 7 },
    { icon: Scale, label: "Justice", count: 4 },
    { icon: Stethoscope, label: "Santé", count: 6 },
    { icon: GraduationCap, label: "Éducation", count: 5 },
    { icon: Briefcase, label: "Social", count: 3 },
  ];
  return (
    <section className="border-y border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Services couverts"
          title="Toutes les démarches du quotidien."
          subtitle="33 procédures officielles, indexées par catégorie et mises à jour régulièrement."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cats.map((c) => (
            <div
              key={c.label}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-bold">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.count} démarches</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Explorer toutes les démarches <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Personas                                                         */
/* ------------------------------------------------------------------ */

function Personas() {
  const list = [
    {
      name: "Aminata, 52 ans",
      role: "Commerçante à Pikine",
      quote: "Je ne sais pas lire le français. Wakhalog m'explique en wolof comment refaire ma CNI.",
    },
    {
      name: "Moussa, 34 ans",
      role: "Chauffeur de taxi à Dakar",
      quote: "Plus besoin d'aller au cyber pour comprendre une démarche. Je parle, j'écoute.",
    },
    {
      name: "Fatou, 21 ans",
      role: "Étudiante à Bambey",
      quote: "Je trouve en 30 secondes ce qu'il me fallait chercher pendant des heures sur Google.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Cas d'usage"
        title="Pensé pour le quotidien réel des Sénégalais."
        subtitle="Trois profils, un même besoin : accéder à l'information administrative dans sa langue."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {list.map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-card p-6">
            <Heart className="h-5 w-5 text-accent" />
            <p className="mt-4 text-base leading-relaxed">"{p.quote}"</p>
            <div className="mt-6 border-t border-border pt-4">
              <p className="font-display text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Stats                                                            */
/* ------------------------------------------------------------------ */

function Stats() {
  const stats = [
    { value: "33", label: "Démarches couvertes" },
    { value: "2", label: "Langues (Wolof · Français)" },
    { value: "24/7", label: "Disponibilité" },
    { value: "100%", label: "Gratuit pour le citoyen" },
  ];
  return (
    <section className="relative overflow-hidden hero-bg">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden></div>
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-5xl font-bold text-gradient">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Responsible banner + footer                                         */
/* ------------------------------------------------------------------ */

function ResponsibleBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start gap-3 rounded-2xl border border-secondary/40 bg-secondary/10 p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-secondary-foreground" />
        <div className="text-sm">
          <p className="font-medium">Démarche responsable</p>
          <p className="mt-1 text-muted-foreground">
            Wakhalog <strong>informe</strong> mais ne remplace pas l'administration. Les documents
            générés à des fins de démonstration n'ont aucune valeur juridique. Pour les démarches
            officielles, le citoyen reste guidé vers les services compétents.
          </p>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Mic className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Wakhalog</span>
            </div>
            <p className="mt-3 text-sm italic text-muted-foreground">
              "Wax ak sa administration ci sa làkk."
            </p>
          </div>
          <div className="text-sm">
            <p className="font-display font-bold">Projet académique</p>
            <p className="mt-2 text-muted-foreground">Université Alioune Diop de Bambey</p>
            <p className="text-muted-foreground">Mémoire de Master · 2026</p>
            <p className="mt-2 text-muted-foreground">
              <Users className="mr-1 inline h-3.5 w-3.5" />
              Mamadou Absa Gueye
            </p>
          </div>
          <div className="text-sm">
            <p className="font-display font-bold">Navigation</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/auth/login" className="hover:text-foreground">Connexion</Link></li>
              <li><a href="#how" className="hover:text-foreground">Fonctionnement</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Wakhalog · Tous droits réservés
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
