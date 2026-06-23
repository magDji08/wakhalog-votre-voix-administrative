// Canonical mobile-API dataset for procedures.
// Shape is the contract documented in docs/MOBILE_API.md.
// The future FastAPI/Postgres backend MUST return the same JSON shape,
// so the Flutter app can swap base URLs without code changes.

export type ApiProcedure = {
  slug: string;
  title: string;
  category: "etat-civil" | "identite" | "justice" | "education" | "entreprise" | "sante" | "fiscalite";
  summary: string;
  summary_wo: string;
  duration: string;
  cost: string;
  documents: { label: string; required: boolean }[];
  steps: { title: string; description: string }[];
  sources: string[];
  audio_url: string | null;
};

export const PROCEDURES: ApiProcedure[] = [
  {
    slug: "extrait-naissance",
    title: "Extrait de naissance",
    category: "etat-civil",
    summary: "Demander une copie de votre acte de naissance auprès de la mairie de naissance.",
    summary_wo: "Ngir am extrait de naissance, danga wara dem ca mairie ba nga juddoo.",
    duration: "1 jour",
    cost: "1 000 FCFA",
    documents: [
      { label: "Carte nationale d'identité", required: true },
      { label: "Copie ancienne du document", required: false },
    ],
    steps: [
      { title: "Se rendre à la mairie de naissance", description: "Présenter la pièce d'identité au guichet état civil." },
      { title: "Payer la taxe", description: "1 000 FCFA en espèces." },
      { title: "Retirer le document", description: "Délivré en général le jour même." },
    ],
    sources: ["senegalservices.sn", "service-public.sec.gouv.sn"],
    audio_url: null,
  },
  {
    slug: "cni",
    title: "Carte nationale d'identité",
    category: "identite",
    summary: "Obtenir ou renouveler la CNI biométrique dans un centre d'enrôlement.",
    summary_wo: "Ngir am sa CNI bu bees, danga wara dem ca centre d'enrôlement.",
    duration: "15 à 30 jours",
    cost: "Gratuit (1ère demande)",
    documents: [
      { label: "Extrait de naissance", required: true },
      { label: "Certificat de résidence", required: true },
      { label: "Ancienne CNI (si renouvellement)", required: false },
    ],
    steps: [
      { title: "Préparer le dossier", description: "Extrait + certificat de résidence + 2 photos." },
      { title: "Se rendre au centre d'enrôlement", description: "Prise d'empreintes et photo biométrique." },
      { title: "Retirer la CNI", description: "Notification par SMS lorsque la carte est prête." },
    ],
    sources: ["passeport.sec.gouv.sn", "Direction de l'Automatisation des Fichiers"],
    audio_url: null,
  },
  {
    slug: "passeport",
    title: "Passeport biométrique",
    category: "identite",
    summary: "Demande en ligne puis prise d'empreintes au centre.",
    summary_wo: "Ngir am passeport biométrique, deposel sa demande ci site bi.",
    duration: "10 à 20 jours",
    cost: "20 000 FCFA",
    documents: [
      { label: "CNI valide", required: true },
      { label: "Extrait de naissance", required: true },
      { label: "Timbre fiscal", required: true },
      { label: "Ancien passeport (renouvellement)", required: false },
    ],
    steps: [
      { title: "Demande en ligne", description: "Créer un compte sur passeport.sec.gouv.sn." },
      { title: "Prendre rendez-vous", description: "Choisir un centre et une date." },
      { title: "Prise d'empreintes", description: "Se présenter au centre avec le dossier." },
      { title: "Retirer le passeport", description: "Récupération sur convocation." },
    ],
    sources: ["passeport.sec.gouv.sn"],
    audio_url: null,
  },
  {
    slug: "certificat-residence",
    title: "Certificat de résidence",
    category: "etat-civil",
    summary: "Document attestant votre lieu de résidence, délivré par la mairie.",
    summary_wo: "Certificat de résidence, mooy dafa wone fan nga dëkk.",
    duration: "1 à 3 jours",
    cost: "1 000 FCFA",
    documents: [
      { label: "CNI", required: true },
      { label: "Justificatif de domicile (facture)", required: true },
    ],
    steps: [
      { title: "Préparer les documents", description: "CNI + justificatif de domicile récent." },
      { title: "Se rendre à la mairie", description: "Guichet état civil." },
      { title: "Retirer le certificat", description: "Délivré sous 1 à 3 jours." },
    ],
    sources: ["senegalservices.sn"],
    audio_url: null,
  },
];

export const CATEGORIES = [
  { id: "etat-civil", label: "État civil" },
  { id: "identite", label: "Identité" },
  { id: "justice", label: "Justice" },
  { id: "education", label: "Éducation" },
  { id: "entreprise", label: "Entreprise" },
  { id: "sante", label: "Santé" },
  { id: "fiscalite", label: "Fiscalité" },
] as const;
