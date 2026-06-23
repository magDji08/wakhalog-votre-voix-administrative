import { createFileRoute } from "@tanstack/react-router";
import { jsonCors, preflight } from "@/lib/mobile-api/cors";

export const Route = createFileRoute("/api/public/mobile/health")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async () =>
        jsonCors({
          status: "ok",
          service: "wakhalog-mobile-api",
          version: "0.1.0-stub",
          timestamp: new Date().toISOString(),
        }),
    },
  },
});
