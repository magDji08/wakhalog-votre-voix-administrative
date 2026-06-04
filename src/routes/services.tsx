import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mic,
  ArrowLeft,
  Volume2,
  BookOpen,
  MessageCircle,
  Search,
  FileText,
  Scale,
  IdCard,
  Stethoscope,
  GraduationCap,
  Briefcase,
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

const CATEGORIES = [
  { id: "all", label: "Toutes", icon: BookOpen },
  { id: "etat-civil", label: "État civil", icon: FileText },
  { id: "identite", label: "Identité", icon: IdCard },
  { id: "justice", label: "Justice", icon: Scale },
  { id: "sante", label: "Santé", icon: Stethoscope },
  { id: "education", label: "Éducation", icon: GraduationCap },
  { id: "social", label: "Social", icon: Briefcase },
];

const PROCEDURES = [
  {
    cat: "etat-civil",
    title: "Extrait de naissance",
    desc: "Document officiel attestant de la naissance d'une personne.",
    cost: "1 000 FCFA",
    delay: "1 jour",
    docs: 2,
    source: "senegalservices.sn",
  },
  {
    cat: "etat-civil",
    title: "Acte de mariage",
    desc: "Document officiel attestant de l'union civile.",
    cost: "2 000 FCFA",
    delay: "3 jours",
    docs: 4,
    source: "Mairie",
  },
  {
    cat: "etat-civil",
    title: "Acte de décès",
    desc: "Document officiel attestant du décès d'une personne.",
    cost: "1 000 FCFA",
    delay: "2 jours",
    docs: 3,
    source: "Mairie",
  },
  {
    cat: "etat-civil",
    title: "Certificat de résidence",
    desc: "Atteste de votre lieu de résidence actuel.",
    cost: "1 000 FCFA",
    delay: "1 jour",
    docs: 2,
    source: "Mairie de commune",
  },
  {
    cat: "identite",
    title: "Carte nationale d'identité (CEDEAO)",
    desc: "Carte d'identité biométrique conforme aux normes CEDEAO.",
    cost: "5 000 FCFA",
    delay: "7-15 jours",
    docs: 3,
    source: "passeport.sec.gouv.sn",
  },
  {
    cat: "identite",
    title: "Passeport biométrique",
    desc: "Passeport biométrique sénégalais pour voyages internationaux.",
    cost: "20 000 FCFA",
    delay: "10-15 jours",
    docs: 4,
    source: "passeport.sec.gouv.sn",
  },
  {
    cat: "justice",
    title: "Casier judiciaire (Bulletin n°3)",
    desc: "Extrait du casier judiciaire utile pour l'emploi ou les visas.",
    cost: "1 200 FCFA",
    delay: "2 jours",
    docs: 2,
    source: "justice.gouv.sn",
  },
  {
    cat: "sante",
    title: "Carte CMU",
    desc: "Couverture Maladie Universelle pour l'accès aux soins.",
    cost: "Gratuit",
    delay: "Variable",
    docs: 2,
    source: "agencecmu.sn",
  },
  {
    cat: "education",
    title: "Bourse étudiante",
    desc: "Demande de bourse nationale pour les étudiants sénégalais.",
    cost: "Gratuit",
    delay: "Variable",
    docs: 5,
    source: "campusen.sn",
  },
];

function ServicesPage() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = PROCEDURES.filter((p) => {
    const matchCat = active === "all" || p.cat === active;
    const matchQuery =
      query.trim() === "" ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Link>
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

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une démarche (ex: naissance, passeport…)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
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

function ProcedureCard({
  p,
}: {
  p: {
    title: string;
    desc: string;
    cost: string;
    delay: string;
    docs: number;
    source: string;
    cat: string;
  };
}) {
  const catLabel = CATEGORIES.find((c) => c.id === p.cat)?.label ?? "";
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-tight">{p.title}</h3>
        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {catLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>

      {/* Key info */}
      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3 text-center text-xs">
        <Info label="Documents" value={String(p.docs)} />
        <Info label="Délai" value={p.delay} />
        <Info label="Coût" value={p.cost} />
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">
        Source&nbsp;: <span className="font-medium text-foreground">{p.source}</span>
      </p>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 pt-1">
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90">
          <Volume2 className="h-3.5 w-3.5" /> Écouter
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
          <BookOpen className="h-3.5 w-3.5" /> Voir la procédure
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
          <MessageCircle className="h-3.5 w-3.5" /> Question
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
