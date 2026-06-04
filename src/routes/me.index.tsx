import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mic,
  MessageSquare,
  FileText,
  Star,
  Languages,
  ArrowRight,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import { MeShell } from "@/components/me-shell";
import {
  loadConversations,
  loadFavorites,
  loadProfile,
  uniqueTopics,
  type Conversation,
} from "@/lib/me-store";
import { getService } from "@/lib/services-catalog";

export const Route = createFileRoute("/me/")({
  head: () => ({ meta: [{ title: "Mon espace · Wakhalog" }] }),
  component: MeHome,
});

function MeHome() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [profile, setProfile] = useState(() => loadProfile());

  useEffect(() => {
    setConvs(loadConversations());
    setFavs(loadFavorites());
    setProfile(loadProfile());
  }, []);

  const topics = uniqueTopics(convs);
  const last = convs[0];

  return (
    <MeShell title={`Bonjour ${profile.name} 👋`} subtitle="Votre assistant pour les démarches administratives.">
      {/* Resume context */}
      {last && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">La dernière fois, nous parlions de</p>
              <h2 className="mt-0.5 font-display text-lg font-bold">{last.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(last.updatedAt).toLocaleString("fr-FR")} · {last.messages.length} messages
              </p>
            </div>
            <Link
              to="/chat"
              search={{ c: last.id, topic: last.topic }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <PlayCircle className="h-3.5 w-3.5" /> Continuer
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conversations" value={convs.length} icon={MessageSquare} />
        <StatCard label="Démarches consultées" value={topics.length} icon={FileText} />
        <StatCard label="Favoris" value={favs.length} icon={Star} />
        <StatCard
          label="Langue préférée"
          value={profile.lang === "wo" ? "Wolof" : "Français"}
          icon={Languages}
        />
      </div>

      {/* Big CTA */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Link
          to="/chat"
          search={{ voice: 1 }}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Mic className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">Parler à Wakhalog</p>
            <p className="text-xs text-muted-foreground">
              Posez votre question en wolof ou français.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
        </Link>

        <Link
          to="/chat"
          search={{ intent: "discovery" }}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-accent/40 hover:shadow-md"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">Je ne sais pas quoi choisir</p>
            <p className="text-xs text-muted-foreground">
              Wakhalog vous oriente vers la bonne démarche.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      </div>

      {/* Recent conversations */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Conversations récentes</h2>
          <Link to="/me/conversations" className="text-xs text-primary hover:underline">
            Tout voir
          </Link>
        </div>
        {convs.length === 0 ? (
          <EmptyHint />
        ) : (
          <div className="space-y-2">
            {convs.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/chat"
                search={{ c: c.id, topic: c.topic }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(c.updatedAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                {c.topic && (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {getService(c.topic).category}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </MeShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Mic;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function EmptyHint() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
      <MessageSquare className="mx-auto h-7 w-7 text-muted-foreground" />
      <p className="mt-2 text-sm font-medium">Aucune conversation pour l'instant</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Commencez à parler avec Wakhalog pour voir votre activité ici.
      </p>
      <Link
        to="/chat"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
      >
        <Mic className="h-3.5 w-3.5" /> Lancer une conversation
      </Link>
    </div>
  );
}
