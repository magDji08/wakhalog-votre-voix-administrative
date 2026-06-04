import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useTTS — Synthèse vocale unifiée pour Wakhalog.
 *
 * Stratégie :
 *  1. POST /api/tts  → si { audio_url } : on lit l'audio (futur SpeechT5 / XTTS).
 *  2. Sinon (501 / fallback / Wolof pas encore dispo) : on bascule sur
 *     window.speechSynthesis avec une voix française.
 *
 * Le composant n'a qu'une seule API : `speak(text, lang)` / `stop()` / `speaking`.
 * Quand le backend Wolof sera prêt, RIEN ne change côté React.
 */

export type TTSLang = "fr" | "wo";

type ApiOk = {
  audio_url: string;
  engine?: string;
  lang?: TTSLang;
  cached?: boolean;
};

type ApiErr = { error: string; fallback?: "browser" };

function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr")) ??
    voices[0] ??
    null
  );
}

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Précharger la liste des voix (Chrome la peuple en async)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const sync = () => window.speechSynthesis.getVoices();
    sync();
    window.speechSynthesis.addEventListener?.("voiceschanged", sync);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", sync);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speakBrowser = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    // Pour l'instant : tout en voix française (y compris le Wolof, en attendant
    // SpeechT5-Wolof côté backend). Au moins l'utilisateur entend quelque chose.
    u.lang = "fr-FR";
    const v = pickFrenchVoice();
    if (v) u.voice = v;
    u.rate = 1;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, []);

  const speak = useCallback(
    async (text: string, lang: TTSLang = "fr") => {
      const clean = text?.trim();
      if (!clean) return;
      stop();

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean, lang }),
        });

        if (res.ok) {
          const data = (await res.json()) as ApiOk;
          if (data.audio_url) {
            const audio = new Audio(data.audio_url);
            audioRef.current = audio;
            audio.onended = () => setSpeaking(false);
            audio.onerror = () => {
              setSpeaking(false);
              speakBrowser(clean); // ultime filet de sécurité
            };
            setSpeaking(true);
            await audio.play();
            return;
          }
        }

        // 501 / 400 / autre → fallback navigateur
        const err = (await res.json().catch(() => ({}))) as ApiErr;
        if (err?.fallback === "browser" || !res.ok) {
          speakBrowser(clean);
          return;
        }
      } catch {
        // Réseau down ou endpoint inexistant en preview SSR → fallback
        speakBrowser(clean);
      }
    },
    [speakBrowser, stop],
  );

  return { speak, stop, speaking };
}
