import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mic,
  MessageCircle,
  FileText,
  Star,
  Sparkles,
  ArrowRight,
  Clock,
  Globe2,
} from "lucide-react";
import { MeShell } from "@/components/me-shell";
import {
  getLastConversation,
  getProfile,
  listConversations,
  listFavorites,
  listVisits,
  migrateLegacy,
  type Conversation,
  type CitizenProfile,
} from "@/lib/citizen-store";

export const Route = createFileRoute("/me/")({
  head: () => ({ meta: [{ title: "Mon espace · Wakhalog" }] }),
  component: MeHome,
});

function MeHome() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [favs, setFavs] = useState(0);
  const [visits, setVisits] = useState(0);
  const [last, setLast] = useState<Conversation | undefined>();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);

  useEffect(() => {
    migrateLegacy();
    setConvs(listConversations());
    setFavs(listFavorites().length);
    setVisits(listVisits().length);
    setLast(getLastConversation());
    setProfile(getProfile());
  }, []);

  const name = profile?.name ?? "Citoyen";
  const firstName = name.split(" ")[0];

  return (
    <MeShell title={`Bonjour ${firstName} 👋`} subtitle="Votre tableau de bord personnel">
      {/* Resume banner */}
      {last && last.messages.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                <Sparkles className="h-3.5 w-3.5" /> La dernière fois nous parlions de
              </p>
              <h2 className="mt-1 truncate font-display text-xl font-bold">{last.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Souhaitez-vous reprendre où vous en étiez ?
              </p>
            </div>
            <Link
              to="/me/conversations/$id"
              params={{ id: last.id }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Continuer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile icon={MessageCircle} label="Conversations" value={convs.length} />
        <StatTile icon={FileText} label="Démarches consultées" value={visits} />
        <StatTile icon={Star} label="Favoris" value={favs} />
        <StatTile
          icon={Globe2}
          label="Langue préférée"
          value={profile?.preferredLang === "wo" ? "Wolof" : "Français"}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ActionCard
          to="/chat"
          icon={Mic}
          title="Parler à Wakhalog"
          desc="Posez votre question en wolof ou en français."
          accent
        />
        <ActionCard
          to="/me/conversations"
          icon={MessageCircle}
          title="Mes conversations"
          desc="Reprenez le contexte de vos échanges précédents."
        />
        <ActionCard
          to="/me/procedures"
          icon={FileText}
          title="Mes démarches"
          desc="Retrouvez les fiches que vous avez consultées."
        />
        <ActionCard
          to="/me/favorites"
          icon={Star}
          title="Mes favoris"
          desc="Vos démarches sauvegardées pour plus tard."
        />
      </div>

      {/* Recent activity */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Activité récente</h2>
          <Link to="/me/conversations" className="text-xs text-muted-foreground hover:text-foreground">
            Tout voir
          </Link>
        </div>
        <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
          {convs.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aucune conversation pour l'instant.{" "}
              <Link to="/chat" className="text-primary hover:underline">
                Démarrez une discussion
              </Link>
              .
            </div>
          ) : (
            convs.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/me/conversations/$id"
                params={{ id: c.id }}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.messages.length} message{c.messages.length > 1 ? "s" : ""}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(c.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </MeShell>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Mic; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
  accent,
}: {
  to: "/chat" | "/me/conversations" | "/me/procedures" | "/me/favorites";
  icon: typeof Mic;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group flex items-start gap-3 rounded-2xl border p-4 transition ${
        accent
          ? "border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 hover:from-primary/15"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          accent ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-base font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 self-center text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
