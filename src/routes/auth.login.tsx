import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Phone, ArrowRight, User, Briefcase, Shield } from "lucide-react";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [{ title: "Connexion · Wakhalog" }],
  }),
  component: LoginPage,
});

const ROLE_OPTIONS: { value: Role; label: string; desc: string; icon: typeof User }[] = [
  { value: "citizen", label: "Citoyen", desc: "Démarches personnelles", icon: User },
  { value: "consultant", label: "Consultant", desc: "Suivi & contenu", icon: Briefcase },
  { value: "super_admin", label: "Super Admin", desc: "Gestion plateforme", icon: Shield },
];

function LoginPage() {
  const navigate = useNavigate();
  const { session, hydrated } = useAuth();
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && session) navigate({ to: "/dashboard" });
  }, [hydrated, session, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 9) return;
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("wakhalog_pending_phone", phone);
      sessionStorage.setItem("wakhalog_pending_role", role);
      navigate({ to: "/auth/otp" });
    }, 500);
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Wakhalog</span>
        </Link>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <blockquote className="relative max-w-md font-display text-3xl font-semibold leading-snug">
            "Wax ak sa administration ci sa làkk."
          </blockquote>
          <p className="relative mt-4 text-muted-foreground">
            Parlez à votre administration dans votre langue.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 Wakhalog · VoiceBot Wolof–Français</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Wakhalog</span>
          </Link>

          <h1 className="text-3xl font-bold">Bienvenue</h1>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous avec votre numéro de téléphone. Un code OTP vous sera envoyé par SMS.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+221 77 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle (démo)</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((r) => {
                  const active = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <r.icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-semibold">{r.label}</span>
                      <span className="text-[10px] leading-tight text-muted-foreground">{r.desc}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground">
                En production, le rôle est attribué côté serveur ; ce sélecteur est fourni pour tester le RBAC.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Envoi du code..." : "Envoyer le code OTP"}
              {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            En continuant, vous acceptez les conditions d'utilisation de Wakhalog.
          </p>
        </div>
      </div>
    </div>
  );
}
