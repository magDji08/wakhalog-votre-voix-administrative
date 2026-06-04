import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Mic,
  MessageCircle,
  FileText,
  Star,
  User as UserIcon,
  Home,
  Plus,
  Menu,
  X,
  LogOut,
  History as HistoryIcon,
} from "lucide-react";
import {
  listConversations,
  migrateLegacy,
  bucketOf,
  BUCKET_LABEL,
  type Conversation,
  type ConvBucket,
} from "@/lib/citizen-store";
import { useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/me", label: "Accueil", icon: Home, exact: true },
  { to: "/chat", label: "Assistant vocal", icon: Mic },
  { to: "/me/conversations", label: "Mes conversations", icon: MessageCircle },
  { to: "/me/procedures", label: "Mes démarches", icon: FileText },
  { to: "/me/favorites", label: "Favoris", icon: Star },
  { to: "/me/profile", label: "Profil", icon: UserIcon },
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, logout } = useAuth();

  useEffect(() => {
    migrateLegacy();
    setConvs(listConversations());
  }, [pathname]);

  const grouped = convs.reduce<Record<ConvBucket, Conversation[]>>(
    (acc, c) => {
      const b = bucketOf(c.updatedAt);
      acc[b].push(c);
      return acc;
    },
    { today: [], yesterday: [], week: [], older: [] },
  );

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-card transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold">Wakhalog</p>
              <p className="text-[10px] text-muted-foreground">Espace Citoyen</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3">
          <Link
            to="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Nouvelle conversation
          </Link>
        </div>

        <nav className="mt-4 space-y-0.5 px-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to as "/me"}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                isActive(n.to, n.exact)
                  ? "bg-primary/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Conversation list — ChatGPT style */}
        <div className="mt-4 flex-1 overflow-y-auto border-t border-border/60 px-2 py-3">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <HistoryIcon className="mr-1 inline h-3 w-3" /> Historique
          </p>
          {convs.length === 0 ? (
            <p className="px-3 text-xs text-muted-foreground">
              Vos conversations apparaîtront ici.
            </p>
          ) : (
            (Object.keys(grouped) as ConvBucket[]).map((bk) =>
              grouped[bk].length === 0 ? null : (
                <div key={bk} className="mb-3">
                  <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    {BUCKET_LABEL[bk]}
                  </p>
                  <div className="space-y-0.5">
                    {grouped[bk].slice(0, 8).map((c) => (
                      <Link
                        key={c.id}
                        to="/me/conversations/$id"
                        params={{ id: c.id }}
                        className="block truncate rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        title={c.title}
                      >
                        {c.title || "Sans titre"}
                      </Link>
                    ))}
                  </div>
                </div>
              ),
            )
          )}
        </div>

        {/* Footer / profile */}
        <div className="border-t border-border/60 p-3">
          <Link
            to="/me/profile"
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
              {(session?.name ?? "M").slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-medium">{session?.name ?? "Citoyen"}</p>
              <p className="truncate text-[10px] text-muted-foreground">Citoyen</p>
            </div>
            {session && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
                title="Se déconnecter"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-bold">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
