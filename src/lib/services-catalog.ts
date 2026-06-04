// Minimal mirror of the services catalog (subset). Used by the citizen space
// pages to display titles & metadata without coupling to the marketing page.
export type ServiceMeta = {
  slug: string;
  title: string;
  category: string;
  cost: string;
  delay: string;
};

export const SERVICES: Record<string, ServiceMeta> = {
  "extrait-naissance": {
    slug: "extrait-naissance",
    title: "Extrait de naissance",
    category: "État civil",
    cost: "1 000 FCFA",
    delay: "1 jour",
  },
  cni: {
    slug: "cni",
    title: "Carte nationale d'identité",
    category: "Identité",
    cost: "5 000 FCFA",
    delay: "7-15 jours",
  },
  passeport: {
    slug: "passeport",
    title: "Passeport biométrique",
    category: "Identité",
    cost: "20 000 FCFA",
    delay: "10-15 jours",
  },
  "certificat-residence": {
    slug: "certificat-residence",
    title: "Certificat de résidence",
    category: "État civil",
    cost: "1 000 FCFA",
    delay: "1 jour",
  },
  "casier-judiciaire": {
    slug: "casier-judiciaire",
    title: "Casier judiciaire",
    category: "Justice",
    cost: "1 000 FCFA",
    delay: "2-5 jours",
  },
  cmu: {
    slug: "cmu",
    title: "Couverture Maladie Universelle",
    category: "Santé",
    cost: "Gratuit",
    delay: "Variable",
  },
};

export function getService(slug: string): ServiceMeta {
  return (
    SERVICES[slug] ?? {
      slug,
      title: slug.replace(/-/g, " "),
      category: "Démarche",
      cost: "—",
      delay: "—",
    }
  );
}
