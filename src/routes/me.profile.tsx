import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, User as UserIcon, Phone, Languages, Shield } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { loadProfile, saveProfile, type ProfilePrefs } from "@/lib/me-store";
import { useAuth, ROLE_LABEL } from "@/lib/auth";

export const Route = createFileRoute("/me/profile")({
  head: () => ({ meta: [{ title: "Mon profil · Wakhalog" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<ProfilePrefs>(() => loadProfile());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cur = loadProfile();
    setProfile({
      name: cur.name || session?.name || "",
      phone: cur.phone || session?.phone || "",
      lang: cur.lang || "fr",
    });
  }, [session]);

  const save = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MeShell title="Mon profil" subtitle="Personnalisez votre expérience Wakhalog.">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5 rounded-2xl border border-border bg-card p-6">
          <Field label="Nom" icon={<UserIcon className="h-4 w-4" />}>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Téléphone" icon={<Phone className="h-4 w-4" />}>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+221 …"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Langue préférée" icon={<Languages className="h-4 w-4" />}>
            <div className="flex gap-2">
              {(["fr", "wo"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setProfile({ ...profile, lang: l })}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm transition ${
                    profile.lang === l
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {l === "fr" ? "🇫🇷 Français" : "🇸🇳 Wolof"}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="text-xs text-emerald-600">✓ Préférences enregistrées</span>
            )}
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Save className="h-4 w-4" /> Enregistrer
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-primary" /> Compte
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rôle</dt>
                <dd className="font-medium">
                  {session ? ROLE_LABEL[session.role] : "Invité"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Téléphone</dt>
                <dd className="font-medium">{session?.phone ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted-foreground">
            🔔 Les notifications (rappels de démarches, alertes) seront disponibles
            dans une prochaine version.
          </div>
        </aside>
      </div>
    </MeShell>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
