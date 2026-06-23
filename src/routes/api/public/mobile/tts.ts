import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";

// POST /api/public/mobile/tts
// Body: { text: string, lang: "fr"|"wo", voice?: string }
// Same contract as /api/tts but CORS-enabled for the Flutter app.
// Returns 501 + fallback:"device" until SpeechT5 / French TTS backend is wired.
export const Route = createFileRoute("/api/public/mobile/tts")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      POST: async ({ request }) => {
        let body: { text?: string; lang?: string; voice?: string } = {};
        try {
          body = await request.json();
        } catch {
          return jsonCors({ error: "invalid_json" }, { status: 400 });
        }
        const text = (body.text ?? "").trim();
        const lang = body.lang === "wo" ? "wo" : "fr";
        if (!text) return jsonCors({ error: "missing_text" }, { status: 400 });
        if (text.length > 2000) return jsonCors({ error: "text_too_long" }, { status: 400 });

        return jsonCors(
          {
            audio_url: null,
            engine: "none",
            lang,
            cached: false,
            fallback: "device",
            note:
              lang === "wo"
                ? "Backend SpeechT5 Wolof pas encore branché — utiliser le TTS du device."
                : "Backend TTS Français pas encore branché — utiliser flutter_tts du device.",
          },
          { status: 501 },
        );
      },
    },
  },
});
