import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, ArrowRight, Trash2 } from "lucide-react";
import { MeShell } from "@/components/me-shell";
import { loadFavorites, toggleFavorite } from "@/lib/me-store";
import { SERVICES, getService } from "@/lib/services-catalog";

export const Route = createFileRoute("/me/favorites")({
  head: () => ({ meta: [{ title: "Favoris · Wakhalog" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => setFavs(loadFavorites()), []);

  const remove = (slug: string) => setFavs(toggleFavorite(slug));
  const add = (slug: string) => setFavs(toggleFavorite(slug));

  const suggestions = Object.keys(SERVICES).filter((s) => !favs.includes(s));

  return (
    <MeShell
      title="Mes favoris"
      subtitle="Vos démarches épinglées pour un accès rapide."
    >
      {favs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Aucun favori</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Épinglez les démarches que vous consultez le plus souvent.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favs.map((slug) => {
            const meta = getService(slug);
            return (
              <article
                key={slug}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="eyebrow text-accent">{meta.category}</p>
                  <p className="mt-0.5 font-display font-bold">{meta.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {meta.cost} · {meta.delay}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    to="/chat"
                    search={{ topic: slug }}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Ouvrir <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => remove(slug)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Retirer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            Ajouter aux favoris
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((slug) => (
              <button
                key={slug}
                onClick={() => add(slug)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
              >
                <Star className="h-3 w-3" /> {getService(slug).title}
              </button>
            ))}
          </div>
        </section>
      )}
    </MeShell>
  );
}
