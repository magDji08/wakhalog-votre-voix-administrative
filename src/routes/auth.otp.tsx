import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({
    meta: [{ title: "Vérification OTP · Wakhalog" }],
  }),
  component: OtpPage,
});

function OtpPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(300);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const phone = typeof window !== "undefined"
    ? sessionStorage.getItem("wakhalog_pending_phone") ?? ""
    : "";

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Veuillez saisir les 6 chiffres.");
      return;
    }
    // Demo: any 6 digits → success
    sessionStorage.setItem("wakhalog_authed", "1");
    navigate({ to: "/dashboard" });
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Wakhalog</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold">Vérification</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Code envoyé au <span className="text-foreground">{phone || "votre numéro"}</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="flex justify-between gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  className="h-14 w-12 rounded-lg border border-border bg-input text-center text-2xl font-bold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              ))}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Vérifier et se connecter
            </button>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Expire dans <span className="font-mono text-foreground">{mm}:{ss}</span>
              </span>
              <button
                type="button"
                onClick={() => setSeconds(300)}
                className="font-medium text-primary hover:underline"
              >
                Renvoyer
              </button>
            </div>
          </form>
        </div>

        <Link
          to="/auth/login"
          className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Changer de numéro
        </Link>
      </div>
    </div>
  );
}
