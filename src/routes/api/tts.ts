import { createFileRoute } from "@tanstack/react-router";

/**
 * POST /api/tts
 *
 * Contract figé pour le futur backend FastAPI / SpeechT5.
 *
 *   Request  : { "text": string, "lang": "fr" | "wo", "voice"?: string }
 *   Response : { "audio_url": string, "engine": string, "lang": "fr"|"wo", "cached": boolean }
 *   Error    : { "error": string, "fallback": "browser" }   // status 501 / 503
 *
 * Aujourd'hui ce handler renvoie 501 pour signaler au frontend de basculer
 * sur la synthèse vocale du navigateur (window.speechSynthesis, voix fr-FR).
 *
 * Demain, brancher ici :
 *   - lang === "fr" → moteur TTS FR (ex: Coqui XTTS, Piper, ElevenLabs…)
 *   - lang === "wo" → SpeechT5 / XTTS fine-tuné Wolof
 *
 * Le frontend (hook useTTS) reste identique.
 */

type Body = { text?: unknown; lang?: unknown; voice?: unknown };

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body = {};
        try {
          body = (await request.json()) as Body;
        } catch {
          return Response.json(
            { error: "invalid_json", fallback: "browser" },
            { status: 400 },
          );
        }

        const text = typeof body.text === "string" ? body.text.trim() : "";
        const lang = body.lang === "wo" ? "wo" : "fr";

        if (!text) {
          return Response.json(
            { error: "missing_text", fallback: "browser" },
            { status: 400 },
          );
        }
        if (text.length > 2000) {
          return Response.json(
            { error: "text_too_long", fallback: "browser" },
            { status: 413 },
          );
        }

        // Backend TTS pas encore branché — on demande au client de fallback
        // sur la synthèse vocale du navigateur. Quand le FastAPI sera prêt,
        // on remplacera ce return par l'appel au moteur et on renverra
        // { audio_url, engine, lang, cached }.
        return Response.json(
          {
            error: "tts_backend_not_configured",
            fallback: "browser",
            engine: lang === "wo" ? "speecht5-wolof (à venir)" : "browser-speech-synthesis",
            lang,
          },
          { status: 501 },
        );
      },
    },
  },
});
