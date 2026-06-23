import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";
import { PROCEDURES } from "@/lib/mobile-api/procedures-data";

// GET /api/public/mobile/procedures/:slug
export const Route = createFileRoute("/api/public/mobile/procedures/$slug")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ params }) => {
        const proc = PROCEDURES.find((p) => p.slug === params.slug);
        if (!proc) {
          return jsonCors({ error: "not_found", slug: params.slug }, { status: 404 });
        }
        return jsonCors(proc);
      },
    },
  },
});
