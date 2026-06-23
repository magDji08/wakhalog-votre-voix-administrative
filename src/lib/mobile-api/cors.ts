// Shared CORS helpers for the public mobile API.
// The Flutter app calls these endpoints from a different origin (or from
// localhost during dev), so every handler must answer OPTIONS preflight
// and echo the appropriate headers on every response.

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Wakhalog-Client",
  "Access-Control-Max-Age": "86400",
};

export function withCors(init: ResponseInit = {}): ResponseInit {
  return {
    ...init,
    headers: { ...CORS_HEADERS, ...(init.headers as Record<string, string> | undefined) },
  };
}

export function jsonCors(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), withCors({
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers as Record<string, string> | undefined) },
  }));
}

export function preflight(): Response {
  return new Response(null, withCors({ status: 204 }));
}
