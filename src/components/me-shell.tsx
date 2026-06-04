import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Mic,
  Home,
  MessageSquare,
  FileText,
  Star,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/me", label: "Accueil", icon: Home, exact: true },
  { to: "/chat", label: "Assistant vocal", icon: Mic },
  { to: "/me/conversations", label: "Mes conversations", icon: MessageSquare },
  { to: "/me/procedures", label: "Mes démarches", icon: FileText },
  { to: "/me/favorites", label: "Favoris", icon: Star },
  { to: "/me/profile", label: "Mon profil", icon: UserIcon },
];

export function MeShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { session, logout } = useAuth();
  const name = session?.name ?? "Citoyen";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card lg:flex">
        <Link to="/" className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Wakhalog</span>
        </Link>

        <div className="px-5 py-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Espace citoyen
          </p>
          <p className="mt-1 font-display text-sm font-bold">Bonjour {name} 👋</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border/60 p-3">
          <Link
            to="/settings"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <SettingsIcon className="h-4 w-4" /> Paramètres
          </Link>
          {session && (
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Mic className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Wakhalog</span>
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Mic className="h-3.5 w-3.5" /> Parler
            </Link>
          </div>
        </header>

        {/* Mobile tab bar */}
        <nav className="sticky top-[57px] z-20 flex gap-1 overflow-x-auto border-b border-border/60 bg-background/80 px-4 py-2 backdrop-blur lg:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold lg:text-3xl">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
