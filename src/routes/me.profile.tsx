import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, User as UserIcon, Phone, Globe2 } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { getProfile, saveProfile, type CitizenProfile } from "@/lib/citizen-store";

export const Route = createFileRoute("/me/profile")({
  head: () => ({ meta: [{ title: "Mon profil · Wakhalog" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [p, setP] = useState<CitizenProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => setP(getProfile()), []);

  if (!p) return null;

  const onSave = () => {
    saveProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <MeShell title="Mon profil" subtitle="Vos informations personnelles">
      <div className="max-w-2xl space-y-5">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground">
            {p.name.slice(0, 1)}
          </div>
          <div>
            <p className="font-display text-lg font-bold">{p.name}</p>
            <p className="text-xs text-muted-foreground">Citoyen · {p.phone}</p>
          </div>
        </div>

        <Field icon={UserIcon} label="Nom complet">
          <input
            value={p.name}
            onChange={(e) => setP({ ...p, name: e.target.value })}
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>

        <Field icon={Phone} label="Téléphone">
          <input
            value={p.phone}
            onChange={(e) => setP({ ...p, phone: e.target.value })}
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5" /> Langue préférée
          </p>
          <div className="flex gap-2">
            {(["fr", "wo"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setP({ ...p, preferredLang: l })}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  p.preferredLang === l
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {l === "fr" ? "🇫🇷 Français" : "🇸🇳 Wolof"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Save className="h-4 w-4" /> Enregistrer
          </button>
          {saved && <span className="text-xs text-green-600">✓ Profil mis à jour</span>}
        </div>
      </div>
    </MeShell>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-border bg-card p-4">
      <span className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      {children}
    </label>
  );
}
