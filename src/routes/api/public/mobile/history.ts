import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";

// GET  /api/public/mobile/history          -> list conversations
// POST /api/public/mobile/history          -> append message
// Stubbed until persistence (Postgres) is wired. Contract documented in
// docs/MOBILE_API.md. Auth header REQUIRED on the real backend.
export const Route = createFileRoute("/api/public/mobile/history")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth) return jsonCors({ error: "unauthorized" }, { status: 401 });
        return jsonCors({
          conversations: [],
          note: "Stub — branchera la table conversations/messages quand le backend sera prêt.",
        });
      },
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth) return jsonCors({ error: "unauthorized" }, { status: 401 });
        return jsonCors(
          { error: "not_implemented", fallback: "local", note: "Stocker localement (Hive) en attendant." },
          { status: 501 },
        );
      },
    },
  },
});
