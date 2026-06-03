import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Phone, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [{ title: "Connexion · Wakhalog" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+?221\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.replace(/\s/g, "+221$&".slice(0, 0)))) {
      // permissive: just require some digits
      if (phone.replace(/\D/g, "").length < 9) return;
    }
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("wakhalog_pending_phone", phone);
      navigate({ to: "/auth/otp" });
    }, 600);
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left visual */}
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

        <p className="text-xs text-muted-foreground">
          © 2026 Wakhalog · VoiceBot Wolof–Français
        </p>
      </div>

      {/* Right form */}
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
              <label htmlFor="phone" className="text-sm font-medium">
                Numéro de téléphone
              </label>
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
