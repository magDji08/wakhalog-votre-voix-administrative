import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";

// GET  /api/public/mobile/favorites
// POST /api/public/mobile/favorites    { slug: string, action: "add"|"remove" }
export const Route = createFileRoute("/api/public/mobile/favorites")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ request }) => {
        if (!request.headers.get("authorization"))
          return jsonCors({ error: "unauthorized" }, { status: 401 });
        return jsonCors({ favorites: [], note: "Stub — table favorites à venir." });
      },
      POST: async ({ request }) => {
        if (!request.headers.get("authorization"))
          return jsonCors({ error: "unauthorized" }, { status: 401 });
        return jsonCors(
          { error: "not_implemented", fallback: "local" },
          { status: 501 },
        );
      },
    },
  },
});
