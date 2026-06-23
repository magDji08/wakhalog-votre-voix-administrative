import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";
import { PROCEDURES } from "@/lib/mobile-api/procedures-data";

// POST /api/public/mobile/chat
// Body: { message: string, lang?: "fr"|"wo", conversation_id?: string }
// Returns a canned answer + matched procedure. Will be replaced by
// FastAPI -> Whisper -> Gemini -> RAG pipeline. Contract is stable.
export const Route = createFileRoute("/api/public/mobile/chat")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      POST: async ({ request }) => {
        let body: { message?: string; lang?: "fr" | "wo"; conversation_id?: string } = {};
        try {
          body = await request.json();
        } catch {
          return jsonCors({ error: "invalid_json" }, { status: 400 });
        }
        const message = (body.message ?? "").trim();
        if (!message) return jsonCors({ error: "missing_message" }, { status: 400 });

        const lang = body.lang === "wo" ? "wo" : "fr";
        const lower = message.toLowerCase();
        const match =
          PROCEDURES.find((p) => lower.includes(p.slug.replace("-", " "))) ??
          PROCEDURES.find((p) => p.title.toLowerCase().split(" ").some((w) => w.length > 3 && lower.includes(w))) ??
          null;

        const answer = match
          ? lang === "wo"
            ? match.summary_wo
            : match.summary
          : lang === "wo"
            ? "Baal ma, mënuma la jox tontu bu wér tey. Demal ci page démarches yi."
            : "Je n'ai pas encore de réponse précise. Consultez la liste des démarches.";

        return jsonCors({
          conversation_id: body.conversation_id ?? `conv_${Date.now()}`,
          message_id: `msg_${Date.now()}`,
          answer,
          lang,
          confidence: match ? 0.82 : 0.31,
          matched_procedure: match
            ? { slug: match.slug, title: match.title, category: match.category }
            : null,
          sources: match?.sources ?? [],
          engine: "stub",
          note: "Stub endpoint — sera remplacé par FastAPI + Gemini + RAG.",
        });
      },
    },
  },
});
