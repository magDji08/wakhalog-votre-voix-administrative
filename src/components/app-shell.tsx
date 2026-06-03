import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessagesSquare,
  BookOpen,
  Target,
  Users,
  BarChart3,
  Cpu,
  FileText,
  Settings,
  Mic,
  LogOut,
} from "lucide-react";
import { type ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/conversations", label: "Conversations", icon: MessagesSquare },
  { to: "/knowledge", label: "Base de connaissances", icon: BookOpen },
  { to: "/intents", label: "Intentions", icon: Target },
  { to: "/users", label: "Utilisateurs", icon: Users },
  { to: "/analytics", label: "Statistiques", icon: BarChart3 },
  { to: "/models", label: "Modèles IA", icon: Cpu },
  { to: "/documents", label: "Documents simulés", icon: FileText },
  { to: "/settings", label: "Paramètres", icon: Settings },
] as const;

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Wakhalog</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-xl border border-border bg-card/50 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 font-semibold text-primary">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">Admin</p>
              <p className="truncate text-xs text-muted-foreground">+221 77 000 00 00</p>
            </div>
            <Link
              to="/"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h1 className="font-display text-2xl font-bold">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
