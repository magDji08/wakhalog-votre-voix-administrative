import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mic,
  ArrowLeft,
  Volume2,
  BookOpen,
  Search,
  FileText,
  Scale,
  IdCard,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Bot,
  BadgeCheck,
  Flame,
  Sparkles,
  Languages,
  Baby,
  Plane,
  Home as HomeIcon,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · Bibliothèque des démarches · Wakhalog" },
      {
        name: "description",
        content:
          "Toutes les démarches administratives sénégalaises couvertes par Wakhalog : coût, délai, sources officielles.",
      },
      { property: "og:title", content: "Bibliothèque des démarches · Wakhalog" },
      {
        property: "og:description",
        content: "Procédures officielles indexées et disponibles en wolof.",
      },
    ],
  }),
  component: ServicesPage,
});

type Difficulty = "easy" | "medium" | "hard";

const CATEGORIES = [
  { id: "all", label: "Toutes", icon: BookOpen },
  { id: "etat-civil", label: "État civil", icon: FileText },
  { id: "identite", label: "Identité", icon: IdCard },
  { id: "justice", label: "Justice", icon: Scale },
  { id: "sante", label: "Santé", icon: Stethoscope },
  { id: "education", label: "Éducation", icon: GraduationCap },
  { id: "social", label: "Social", icon: Briefcase },
];

type Procedure = {
  cat: string;
  title: string;
  desc: string;
  cost: string;
  delay: string;
  docs: number;
  source: string;
  officialSource?: boolean;
  difficulty: Difficulty;
  estimated: string;
  popular?: boolean;
  related?: string[];
};

const PROCEDURES: Procedure[] = [
  {
    cat: "etat-civil",
    title: "Extrait de naissance",
    desc: "Document officiel attestant de la naissance d'une personne.",
    cost: "1 000 FCFA",
    delay: "1 jour",
    docs: 2,
    source: "senegalservices.sn",
    officialSource: true,
    difficulty: "easy",
    estimated: "5 min",
    popular: true,
    related: ["Certificat de résidence", "Carte nationale d'identité (CEDEAO)"],
  },
  {
    cat: "etat-civil",
    title: "Acte de mariage",
    desc: "Document officiel attestant de l'union civile.",
    cost: "2 000 FCFA",
    delay: "3 jours",
    docs: 4,
    source: "Mairie",
    officialSource: true,
    difficulty: "medium",
    estimated: "15 min",
  },
  {
    cat: "etat-civil",
    title: "Acte de décès",
    desc: "Document officiel attestant du décès d'une personne.",
    cost: "1 000 FCFA",
    delay: "2 jours",
    docs: 3,
    source: "Mairie",
    officialSource: true,
    difficulty: "easy",
    estimated: "10 min",
  },
  {
    cat: "etat-civil",
    title: "Certificat de résidence",
    desc: "Atteste de votre lieu de résidence actuel.",
    cost: "1 000 FCFA",
    delay: "1 jour",
    docs: 2,
    source: "Mairie de commune",
    officialSource: true,
    difficulty: "easy",
    estimated: "5 min",
  },
  {
    cat: "identite",
    title: "Carte nationale d'identité (CEDEAO)",
    desc: "Carte d'identité biométrique conforme aux normes CEDEAO.",
    cost: "5 000 FCFA",
    delay: "7-15 jours",
    docs: 3,
    source: "passeport.sec.gouv.sn",
    officialSource: true,
    difficulty: "medium",
    estimated: "20 min",
    popular: true,
    related: ["Extrait de naissance", "Certificat de résidence"],
  },
  {
    cat: "identite",
    title: "Passeport biométrique",
    desc: "Passeport biométrique sénégalais pour voyages internationaux.",
    cost: "20 000 FCFA",
    delay: "10-15 jours",
    docs: 4,
    source: "passeport.sec.gouv.sn",
    officialSource: true,
    difficulty: "hard",
    estimated: "30 min",
    popular: true,
    related: ["Carte nationale d'identité (CEDEAO)", "Extrait de naissance"],
  },
  {
    cat: "justice",
    title: "Casier judiciaire (Bulletin n°3)",
    desc: "Extrait du casier judiciaire utile pour l'emploi ou les visas.",
    cost: "1 200 FCFA",
    delay: "2 jours",
    docs: 2,
    source: "justice.gouv.sn",
    officialSource: true,
    difficulty: "easy",
    estimated: "10 min",
    popular: true,
  },
  {
    cat: "sante",
    title: "Carte CMU",
    desc: "Couverture Maladie Universelle pour l'accès aux soins.",
    cost: "Gratuit",
    delay: "Variable",
    docs: 2,
    source: "agencecmu.sn",
    officialSource: true,
    difficulty: "medium",
    estimated: "15 min",
  },
  {
    cat: "education",
    title: "Bourse étudiante",
    desc: "Demande de bourse nationale pour les étudiants sénégalais.",
    cost: "Gratuit",
    delay: "Variable",
    docs: 5,
    source: "campusen.sn",
    officialSource: true,
    difficulty: "hard",
    estimated: "45 min",
  },
];

const QUICK_ACTIONS = [
  { icon: Baby, label: "Déclarer une naissance", q: "Extrait de naissance" },
  { icon: IdCard, label: "Obtenir une CNI", q: "Carte nationale" },
  { icon: FileText, label: "Demander un extrait", q: "Extrait" },
  { icon: Scale, label: "Casier judiciaire", q: "Casier" },
  { icon: Plane, label: "Passeport", q: "Passeport" },
  { icon: HomeIcon, label: "Certificat de résidence", q: "résidence" },
];

const DIFF_META: Record<Difficulty, { label: string; cls: string; dot: string }> = {
  easy: { label: "Facile", cls: "bg-green-500/10 text-green-700", dot: "bg-green-500" },
  medium: { label: "Moyen", cls: "bg-amber-500/10 text-amber-700", dot: "bg-amber-500" },
  hard: { label: "Complexe", cls: "bg-red-500/10 text-red-700", dot: "bg-red-500" },
};

function ServicesPage() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<"fr" | "wo">("fr");

  const filtered = PROCEDURES.filter((p) => {
    const matchCat = active === "all" || p.cat === active;
    const matchQuery =
      query.trim() === "" ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const popular = PROCEDURES.filter((p) => p.popular);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Wakhalog</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Language selector */}
            <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 text-xs md:flex">
              <button
                onClick={() => setLang("fr")}
                className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
                  lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Languages className="h-3 w-3" /> FR
              </button>
              <button
                onClick={() => setLang("wo")}
                className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
                  lang === "wo" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                WO
              </button>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-bg">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden></div>
        <div className="relative mx-auto max-w-6xl px-6 py-14 text-center">
          <p className="eyebrow text-accent">Bibliothèque des démarches</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Toutes les <span className="text-gradient">démarches administratives</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Coût, délai, documents requis, sources officielles. Et pour chaque démarche, la
            possibilité d'écouter l'explication en wolof.
          </p>

          {/* Search + Voice */}
          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une démarche (ex: naissance, passeport…)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
            >
              <Mic className="h-3.5 w-3.5" /> Parler
            </button>
          </div>
        </div>
      </section>

      {/* Smart Assistant Card */}
      <section className="mx-auto -mt-8 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-lg md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs">
                <Sparkles className="h-3.5 w-3.5" /> Assistant intelligent
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                Je ne sais pas quelle démarche choisir
              </h2>
              <p className="mt-2 max-w-xl text-sm text-primary-foreground/85">
                Parlez à Wakhalog en wolof ou en français. Exemple&nbsp;: «&nbsp;Ma fille vient de
                naître&nbsp;» → l'assistant vous oriente vers la déclaration de naissance.
              </p>
            </div>
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-primary shadow hover:opacity-90"
            >
              <Mic className="h-4 w-4" /> Commencer
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">👋 Bonjour&nbsp;!</h2>
            <p className="text-sm text-muted-foreground">Que souhaitez-vous faire aujourd'hui&nbsp;?</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => setQuery(a.q)}
              className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <a.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-6xl px-6 pt-12">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Démarches populaires</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {popular.map((p) => (
            <button
              key={p.title}
              onClick={() => setQuery(p.title)}
              className="rounded-xl border border-border bg-card p-4 text-left transition hover:border-accent/50 hover:shadow-md"
            >
              <p className="font-display text-sm font-bold leading-tight">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.cost} · {p.delay}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <c.icon className="h-4 w-4" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Aucune démarche ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProcedureCard key={p.title} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold">
            Vous ne trouvez pas votre démarche&nbsp;?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Posez votre question vocalement en wolof. L'assistant vous oriente vers la bonne
            procédure et le bon interlocuteur.
          </p>
          <Link
            to="/auth/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground glow-primary transition hover:opacity-90"
          >
            <Mic className="h-4 w-4" /> Parler à Wakhalog
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProcedureCard({ p }: { p: Procedure }) {
  const catLabel = CATEGORIES.find((c) => c.id === p.cat)?.label ?? "";
  const diff = DIFF_META[p.difficulty];
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-tight">{p.title}</h3>
        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {catLabel}
        </span>
      </div>

      {/* Difficulty + time */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${diff.cls}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
          {diff.label}
        </span>
        <span className="text-[11px] text-muted-foreground">⏱️ {p.estimated}</span>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>

      {/* Key info */}
      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3 text-center text-xs">
        <Info label="Documents" value={String(p.docs)} />
        <Info label="Délai" value={p.delay} />
        <Info label="Coût" value={p.cost} />
      </dl>

      {/* Official source badge */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-xs">
        {p.officialSource && <BadgeCheck className="h-4 w-4 shrink-0 text-green-600" />}
        <div className="flex-1">
          <p className="font-medium text-green-700">Source officielle</p>
          <p className="text-muted-foreground">{p.source}</p>
        </div>
      </div>

      {/* Related */}
      {p.related && p.related.length > 0 && (
        <div className="mt-3 rounded-lg bg-muted/40 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Vous pourriez aussi avoir besoin de
          </p>
          <ul className="mt-1.5 space-y-0.5 text-xs">
            {p.related.map((r) => (
              <li key={r} className="text-foreground/80">• {r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 pt-1">
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90">
          <Volume2 className="h-3.5 w-3.5" /> Écouter un exemple
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
          <BookOpen className="h-3.5 w-3.5" /> Voir la procédure
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
          <Bot className="h-3.5 w-3.5" /> Poser une question à Wakhalog
        </button>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-display text-sm font-bold">{value}</dd>
    </div>
  );
}
