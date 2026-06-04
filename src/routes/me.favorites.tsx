import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Mic, Trash2 } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { listFavorites, toggleFavorite, type Favorite } from "@/lib/citizen-store";

export const Route = createFileRoute("/me/favorites")({
  head: () => ({ meta: [{ title: "Mes favoris · Wakhalog" }] }),
  component: Favorites,
});

function Favorites() {
  const [favs, setFavs] = useState<Favorite[]>([]);
  useEffect(() => setFavs(listFavorites()), []);

  const remove = (f: Favorite) => {
    toggleFavorite({ slug: f.slug, title: f.title, category: f.category });
    setFavs(listFavorites());
  };

  return (
    <MeShell title="Mes favoris" subtitle="Démarches sauvegardées pour plus tard">
      {favs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Aucun favori</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajoutez vos démarches importantes depuis leur fiche détaillée.
          </p>
          <Link
            to="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Parcourir les démarches
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favs.map((f) => (
            <article key={f.slug} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{f.category}</p>
                <p className="truncate font-display text-sm font-bold">{f.title}</p>
              </div>
              <Link
                to="/chat"
                search={{ topic: f.slug } as never}
                className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                title="Poser une question"
              >
                <Mic className="h-4 w-4" />
              </Link>
              <button
                onClick={() => remove(f)}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Retirer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      )}
    </MeShell>
  );
}
