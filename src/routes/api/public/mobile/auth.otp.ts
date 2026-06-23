import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";

// POST /api/public/mobile/auth/otp
// Body actions:
//   { action: "request", phone: "+221..." }
//   { action: "verify",  phone: "+221...", code: "123456" }
// Stub: returns a fake session. The real backend will integrate Supabase Auth
// (phone provider) or a FastAPI OTP service. Contract stays the same.
export const Route = createFileRoute("/api/public/mobile/auth/otp")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      POST: async ({ request }) => {
        let body: { action?: string; phone?: string; code?: string } = {};
        try {
          body = await request.json();
        } catch {
          return jsonCors({ error: "invalid_json" }, { status: 400 });
        }
        const phone = (body.phone ?? "").trim();
        if (!phone.startsWith("+")) {
          return jsonCors({ error: "invalid_phone", hint: "format E.164 (ex: +221771234567)" }, { status: 400 });
        }

        if (body.action === "request") {
          return jsonCors({
            status: "sent",
            phone,
            expires_in: 300,
            note: "Stub — aucun SMS envoyé. Utiliser le code 123456 pour tester.",
          });
        }
        if (body.action === "verify") {
          if (body.code !== "123456") {
            return jsonCors({ error: "invalid_code" }, { status: 401 });
          }
          return jsonCors({
            access_token: `stub.${Buffer.from(phone).toString("base64")}.token`,
            refresh_token: `stub.${Buffer.from(phone).toString("base64")}.refresh`,
            expires_in: 3600,
            user: { id: `user_${phone.replace(/\D/g, "")}`, phone, role: "citizen" },
            note: "Stub — pas de signature JWT. À remplacer par Supabase Auth ou FastAPI.",
          });
        }
        return jsonCors({ error: "unknown_action", expected: ["request", "verify"] }, { status: 400 });
      },
    },
  },
});
