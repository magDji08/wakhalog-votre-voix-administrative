import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert, Lock } from "lucide-react";
import { useAuth, type Permission } from "@/lib/auth";
import { AppShell } from "./app-shell";

type Props = {
  permission: Permission;
  children: ReactNode;
};

/**
 * Client-side RBAC gate.
 * - If session is not yet hydrated → render nothing (avoid flicker).
 * - If unauthenticated → redirect to /auth/login.
 * - If authenticated but lacking permission → render a Forbidden screen.
 */
export function RoleGuard({ permission, children }: Props) {
  const { session, hydrated, can } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !session) {
      navigate({ to: "/auth/login" });
    }
  }, [hydrated, session, navigate]);

  if (!hydrated) return null;
  if (!session) return null;

  if (!can(permission)) {
    return (
      <AppShell title="Accès refusé" subtitle="Vous n'avez pas les permissions requises">
        <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">403 — Accès refusé</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre rôle actuel ne dispose pas de l'autorisation nécessaire pour consulter cette page.
            Contactez un Super Administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Retour au tableau de bord
            </Link>
          </div>
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Permission requise : <code className="font-mono">{permission}</code>
          </p>
        </div>
      </AppShell>
    );
  }

  return <>{children}</>;
}

/** Render children only if the current user has the permission. */
export function Can({ permission, children, fallback = null }: { permission: Permission; children: ReactNode; fallback?: ReactNode }) {
  const { can } = useAuth();
  return <>{can(permission) ? children : fallback}</>;
}
