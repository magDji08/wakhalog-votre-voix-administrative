import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RoleGuard, Can } from "@/components/role-guard";
import { Save } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Paramètres · Wakhalog" }] }),
  component: () => (
    <RoleGuard permission="page:settings">
      <SettingsPage />
    </RoleGuard>
  ),
});

function SettingsPage() {
  return (
    <AppShell title="Paramètres" subtitle="Configuration générale, IA et sécurité">
      <div className="space-y-6">
        <Card title="Général" desc="Identité et apparence du projet">
          <Field label="Nom du projet" value="Wakhalog" />
          <Field label="Slogan" value="Wax ak sa administration ci sa làkk" />
          <Field label="Langue par défaut" value="Wolof" />
        </Card>

        <Can
          permission="settings:edit"
          fallback={
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-sm text-muted-foreground">
              Les paramètres IA et Sécurité sont réservés aux Super Administrateurs.
            </div>
          }
        >
          <Card title="IA" desc="Clés API et paramètres des modèles">
            <Field label="Clé Gemini" value="AIza••••••••••••••" type="password" />
            <Field label="URL Ollama" value="http://localhost:11434" />
            <Field label="Température LLM" value="0.3" />
          </Card>

          <Card title="Sécurité" desc="Authentification et sessions">
            <Toggle label="OTP par SMS" desc="Code à 6 chiffres, expire en 5 min" enabled />
            <Toggle label="Refresh token" desc="Sessions de 30 jours" enabled />
            <Field label="Tentatives OTP max" value="3" />
          </Card>

          <div className="flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
          </div>
        </Can>
      </div>
    </AppShell>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold text-gradient">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div className="grid gap-2 md:grid-cols-[200px_1fr] md:items-center">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function Toggle({ label, desc, enabled }: { label: string; desc: string; enabled: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/30 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-primary" : "bg-muted"}`}>
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${
            enabled ? "left-[1.4rem]" : "left-0.5"
          }`}
        />
      </div>
    </div>
  );
}
