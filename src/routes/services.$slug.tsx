import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Mic,
  ArrowLeft,
  Volume2,
  Pause,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  BadgeCheck,
  Bot,
  Send,
  ChevronDown,
  Clock,
  Coins,
  FileCheck2,
  Sparkles,
  IdCard,
  Home as HomeIcon,
  Plane,
  FileText,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

type Step = { title: string; desc: string };
type FaqItem = { q: string; a: string };
type Related = { slug: string; title: string; icon: any };

type ProcedureDetail = {
  slug: string;
  category: string;
  title: string;
  short: string;
  difficulty: Difficulty;
  estimated: string;
  cost: string;
  delay: string;
  wolofAudio: string;
  steps: Step[];
  documents: { label: string; required: boolean }[];
  location: string;
  sources: string[];
  faq: FaqItem[];
  related: Related[];
};

const PROCEDURES: Record<string, ProcedureDetail> = {
  "extrait-naissance": {
    slug: "extrait-naissance",
    category: "État civil",
    title: "Extrait de naissance",
    short: "Document officiel attestant la naissance d'une personne.",
    difficulty: "easy",
    estimated: "5 minutes",
    cost: "1 000 FCFA",
    delay: "1 jour",
    wolofAudio:
      "Ngir am extrait de naissance, danga wara dem ca mairie ba nga juddoo. Yobalal sa carte d'identité, ak benn copie. Fay 1000 FCFA, te ñu jox la sa extrait ci benn bés.",
    steps: [
      { title: "Rassembler les documents", desc: "Pièce d'identité et infos sur la naissance." },
      { title: "Se rendre à la mairie", desc: "Mairie du lieu de naissance." },
      { title: "Déposer la demande", desc: "Au guichet de l'état civil." },
      { title: "Payer les frais", desc: "1 000 FCFA au régisseur." },
      { title: "Retirer le document", desc: "Sous 24h en général." },
    ],
    documents: [
      { label: "Copie de la pièce d'identité du demandeur", required: true },
      { label: "Informations sur la naissance (date, lieu)", required: true },
      { label: "Livret de famille (si disponible)", required: false },
    ],
    location: "Mairie du lieu de naissance",
    sources: ["senegalservices.sn", "Mairie de commune", "Ministère de l'Intérieur"],
    faq: [
      {
        q: "Puis-je faire la demande pour quelqu'un d'autre ?",
        a: "Oui, avec une procuration signée et une copie de votre pièce d'identité.",
      },
      {
        q: "Que faire si je suis né à l'étranger ?",
        a: "Adressez-vous au Consulat du Sénégal du pays de naissance ou au Ministère des Affaires étrangères.",
      },
      {
        q: "Peut-on faire la demande en ligne ?",
        a: "Certaines mairies expérimentent la demande en ligne via senegalservices.sn. Vérifiez auprès de votre commune.",
      },
    ],
    related: [
      { slug: "cni", title: "Carte nationale d'identité", icon: IdCard },
      { slug: "certificat-residence", title: "Certificat de résidence", icon: HomeIcon },
      { slug: "passeport", title: "Passeport biométrique", icon: Plane },
    ],
  },
  "cni": {
    slug: "cni",
    category: "Identité",
    title: "Carte nationale d'identité (CEDEAO)",
    short: "Carte d'identité biométrique conforme aux normes CEDEAO.",
    difficulty: "medium",
    estimated: "20 minutes",
    cost: "5 000 FCFA",
    delay: "7 à 15 jours",
    wolofAudio:
      "Ngir am sa CNI bu bees, danga wara dem ca centre d'enrôlement, yobaale sa extrait de naissance ak sa certificat de résidence.",
    steps: [
      { title: "Préparer les documents", desc: "Extrait de naissance + certificat de résidence." },
      { title: "Aller au centre d'enrôlement", desc: "Préfecture ou sous-préfecture." },
      { title: "Enrôlement biométrique", desc: "Empreintes et photo sur place." },
      { title: "Payer les frais", desc: "5 000 FCFA en timbre fiscal." },
      { title: "Retirer la carte", desc: "Sous 7 à 15 jours." },
    ],
    documents: [
      { label: "Extrait de naissance récent", required: true },
      { label: "Certificat de résidence", required: true },
      { label: "Ancienne CNI (pour renouvellement)", required: false },
    ],
    location: "Préfecture / sous-préfecture / centre CEDEAO",
    sources: ["passeport.sec.gouv.sn", "Direction de l'Automatisation des Fichiers"],
    faq: [
      { q: "Combien de temps est-elle valable ?", a: "10 ans pour les majeurs." },
      { q: "Que faire en cas de perte ?", a: "Déposer une déclaration de perte au commissariat puis refaire la demande." },
    ],
    related: [
      { slug: "extrait-naissance", title: "Extrait de naissance", icon: FileText },
      { slug: "passeport", title: "Passeport biométrique", icon: Plane },
    ],
  },
  "passeport": {
    slug: "passeport",
    category: "Identité",
    title: "Passeport biométrique",
    short: "Passeport biométrique sénégalais pour les voyages internationaux.",
    difficulty: "hard",
    estimated: "30 minutes",
    cost: "20 000 FCFA",
    delay: "10 à 15 jours",
    wolofAudio:
      "Ngir am passeport biométrique, danga wara dépose sa demande ci site passeport.sec.gouv.sn, ginnaaw nga dem centre bi.",
    steps: [
      { title: "Demande en ligne", desc: "Sur passeport.sec.gouv.sn." },
      { title: "Prise de rendez-vous", desc: "Choisir un centre d'enrôlement." },
      { title: "Enrôlement biométrique", desc: "Photo + empreintes le jour du RDV." },
      { title: "Paiement", desc: "20 000 FCFA via timbre fiscal." },
      { title: "Retrait", desc: "Sous 10 à 15 jours ouvrés." },
    ],
    documents: [
      { label: "Extrait de naissance", required: true },
      { label: "Carte nationale d'identité", required: true },
      { label: "Timbre fiscal 20 000 FCFA", required: true },
      { label: "Ancien passeport (si renouvellement)", required: false },
    ],
    location: "Centre d'enrôlement de la DAF",
    sources: ["passeport.sec.gouv.sn", "Direction de l'Automatisation des Fichiers"],
    faq: [
      { q: "Quelle est la durée de validité ?", a: "5 ans à partir de la date d'émission." },
      { q: "Peut-on faire un passeport pour mineur ?", a: "Oui, avec l'autorisation des deux parents." },
    ],
    related: [
      { slug: "cni", title: "Carte nationale d'identité", icon: IdCard },
      { slug: "extrait-naissance", title: "Extrait de naissance", icon: FileText },
    ],
  },
  "certificat-residence": {
    slug: "certificat-residence",
    category: "État civil",
    title: "Certificat de résidence",
    short: "Atteste de votre lieu de résidence actuel.",
    difficulty: "easy",
    estimated: "5 minutes",
    cost: "1 000 FCFA",
    delay: "1 jour",
    wolofAudio:
      "Certificat de résidence, mooy dafa wone fan nga dëkk. Dem ca mairie, yobaale CNI ak preuve résidence.",
    steps: [
      { title: "Préparer les documents", desc: "CNI + justificatif de domicile." },
      { title: "Aller à la mairie", desc: "Mairie du lieu de résidence." },
      { title: "Remplir le formulaire", desc: "Au guichet état civil." },
      { title: "Payer", desc: "1 000 FCFA." },
      { title: "Retirer", desc: "Sous 24h." },
    ],
    documents: [
      { label: "Carte nationale d'identité", required: true },
      { label: "Justificatif de domicile (facture)", required: true },
    ],
    location: "Mairie du lieu de résidence",
    sources: ["Mairie de commune"],
    faq: [
      { q: "Combien de temps est-il valable ?", a: "Généralement 3 mois après émission." },
    ],
    related: [
      { slug: "extrait-naissance", title: "Extrait de naissance", icon: FileText },
      { slug: "cni", title: "Carte nationale d'identité", icon: IdCard },
    ],
  },
};

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const p = PROCEDURES[params.slug];
    const title = p ? `${p.title} · Wakhalog` : "Démarche · Wakhalog";
    return {
      meta: [
        { title },
        { name: "description", content: p?.short ?? "Détail d'une démarche administrative." },
      ],
    };
  },
  loader: ({ params }) => {
    const proc = PROCEDURES[params.slug];
    if (!proc) throw notFound();
    return { proc };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background p-8 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Démarche introuvable</h1>
        <p className="mt-2 text-muted-foreground">Cette procédure n'est pas encore documentée.</p>
        <Link to="/services" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour aux démarches
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <p className="text-destructive">Une erreur est survenue.</p>
        <button onClick={reset} className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Réessayer</button>
      </div>
    </div>
  ),
  component: ProcedurePage,
});

const DIFF_META: Record<Difficulty, { label: string; cls: string; dot: string }> = {
  easy: { label: "Facile", cls: "bg-green-500/10 text-green-700", dot: "bg-green-500" },
  medium: { label: "Moyen", cls: "bg-amber-500/10 text-amber-700", dot: "bg-amber-500" },
  hard: { label: "Complexe", cls: "bg-red-500/10 text-red-700", dot: "bg-red-500" },
};

function ProcedurePage() {
  const { proc } = Route.useLoaderData() as { proc: ProcedureDetail };
  const diff = DIFF_META[proc.difficulty];
  const [playing, setPlaying] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chat, setChat] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(proc.wolofAudio);
    u.lang = "fr-FR";
    u.rate = 0.95;
    u.onend = () => setPlaying(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  };

  const sendQuestion = () => {
    const q = input.trim();
    if (!q) return;
    setChat((c) => [
      ...c,
      { role: "user", text: q },
      {
        role: "bot",
        text: `Pour « ${q.toLowerCase()} », Wakhalog recommande de vérifier les documents requis ci-dessus. Si l'un d'eux manque, contactez votre mairie pour les alternatives acceptées.`,
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Wakhalog</span>
          </Link>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Toutes les démarches
          </Link>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="relative overflow-hidden hero-bg">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden></div>
        <div className="relative mx-auto max-w-5xl px-6 py-12">
          <p className="eyebrow text-accent">{proc.category}</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{proc.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{proc.short}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${diff.cls}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} /> {diff.label}
            </span>
            <Badge icon={<Clock className="h-3.5 w-3.5" />}>{proc.estimated}</Badge>
            <Badge icon={<Coins className="h-3.5 w-3.5" />}>{proc.cost}</Badge>
            <Badge icon={<FileCheck2 className="h-3.5 w-3.5" />}>Délai : {proc.delay}</Badge>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        {/* 2. Audio Wolof */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-lg md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs">
                <Sparkles className="h-3.5 w-3.5" /> Explication en Wolof
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold">🎙️ Écoutez la démarche en Wolof</h2>
              <p className="mt-2 max-w-xl text-sm text-primary-foreground/85 italic">« {proc.wolofAudio} »</p>
            </div>
            <button
              onClick={toggleAudio}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-primary shadow hover:opacity-90"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {playing ? "Pause" : "Écouter"}
            </button>
          </div>
        </section>

        {/* 3. Steps timeline */}
        <Section title="Les étapes" subtitle="Suivez la procédure pas à pas">
          <ol className="relative space-y-5 border-l-2 border-dashed border-primary/30 pl-6">
            {proc.steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[34px] grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow">
                  {i + 1}
                </span>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="font-display font-bold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 4. Documents */}
        <Section title="Documents requis" subtitle="Préparez ces pièces avant votre démarche">
          <ul className="grid gap-2 sm:grid-cols-2">
            {proc.documents.map((d) => (
              <li
                key={d.label}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                {d.required ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.required ? "Obligatoire" : "Optionnel"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-muted-foreground">
              Document manquant ? Vérifiez auprès de votre mairie pour les alternatives acceptées.
            </p>
          </div>
        </Section>

        {/* 5. Coût & délai */}
        <section className="grid gap-4 sm:grid-cols-2">
          <InfoCard icon={<Coins className="h-5 w-5" />} label="Coût" value={proc.cost} />
          <InfoCard icon={<Clock className="h-5 w-5" />} label="Délai" value={proc.delay} />
        </section>

        {/* 6. Lieu */}
        <Section title="Où faire la démarche ?">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold">{proc.location}</p>
              <p className="text-sm text-muted-foreground">
                Présentez-vous aux horaires d'ouverture (en général 8h–15h, du lundi au vendredi).
              </p>
              <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
                <MapPin className="h-3.5 w-3.5" /> Voir sur la carte (bientôt)
              </button>
            </div>
          </div>
        </Section>

        {/* 7. FAQ */}
        <Section title="Questions fréquentes">
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {proc.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  >
                    <span className="text-sm font-medium">{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* 8. Assistant Wakhalog */}
        <section className="rounded-2xl border border-accent/30 bg-gradient-to-br from-secondary/30 to-background p-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold">Besoin d'aide ?</p>
              <p className="text-xs text-muted-foreground">Posez votre question à Wakhalog</p>
            </div>
          </div>

          {chat.length > 0 && (
            <div className="mt-4 space-y-2">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-card p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
              placeholder="Ex: Je n'ai pas ma carte d'identité..."
              className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground hover:opacity-90">
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={sendQuestion}
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* 9. Sources */}
        <Section title="Sources officielles" subtitle="Informations vérifiées et tracées">
          <ul className="grid gap-2 sm:grid-cols-3">
            {proc.sources.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-xs"
              >
                <BadgeCheck className="h-4 w-4 shrink-0 text-green-600" />
                <span className="font-medium text-green-700">{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 10. Related */}
        <Section title="Démarches associées">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {proc.related.map((r) => (
              <Link
                key={r.slug}
                to="/services/$slug"
                params={{ slug: r.slug }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <r.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{r.title}</span>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
      {icon}
      {children}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
