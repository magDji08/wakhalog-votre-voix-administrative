import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";
import { CATEGORIES, PROCEDURES } from "@/lib/mobile-api/procedures-data";

// GET /api/public/mobile/procedures?category=identite&q=passeport
export const Route = createFileRoute("/api/public/mobile/procedures")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

        let items = PROCEDURES;
        if (category) items = items.filter((p) => p.category === category);
        if (q) {
          items = items.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.summary.toLowerCase().includes(q) ||
              p.slug.includes(q),
          );
        }

        return jsonCors({
          categories: CATEGORIES,
          items: items.map((p) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            summary: p.summary,
            duration: p.duration,
            cost: p.cost,
          })),
          total: items.length,
        });
      },
    },
  },
});
