import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
import { ROLE_LABEL, useAuth, type Permission } from "@/lib/auth";

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; perm: Permission }[] = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, perm: "page:dashboard" },
  { to: "/conversations", label: "Conversations", icon: MessagesSquare, perm: "page:conversations" },
  { to: "/knowledge", label: "Base de connaissances", icon: BookOpen, perm: "page:knowledge" },
  { to: "/intents", label: "Intentions", icon: Target, perm: "page:intents" },
  { to: "/users", label: "Utilisateurs", icon: Users, perm: "page:users" },
  { to: "/analytics", label: "Statistiques", icon: BarChart3, perm: "page:analytics" },
  { to: "/models", label: "Modèles IA", icon: Cpu, perm: "page:models" },
  { to: "/documents", label: "Documents", icon: FileText, perm: "page:documents" },
  { to: "/settings", label: "Paramètres", icon: Settings, perm: "page:settings" },
];

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { session, can, logout } = useAuth();
  const navigate = useNavigate();

  const visibleNav = NAV.filter((n) => can(n.perm));
  const initials = session?.name
    ? session.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

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
          {visibleNav.map((item) => {
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
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{session?.name ?? "Invité"}</p>
              <p className="truncate text-xs text-muted-foreground">{session?.phone ?? "—"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          {session && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
              {ROLE_LABEL[session.role]}
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex-1 overflow-x-hidden hero-bg">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden></div>
        <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h1 className="font-display text-2xl font-bold text-gradient">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </header>
        <div className="relative p-6">{children}</div>
      </main>
    </div>
  );
}
