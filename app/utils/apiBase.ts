/** Django REST `api/` prefix — no trailing slash. */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
  const trimmed = raw.replace(/\/$/, "");
  const normalized = /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;

  // In local dev, prefer local backend even if env points to remote.
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    try {
      const parsed = new URL(normalized);
      const isLocalTarget =
        parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
      if (!isLocalTarget) {
        return "http://127.0.0.1:8000/api";
      }
    } catch {
      // If URL parsing fails, keep existing value.
    }
  }

  return normalized;
}

/** Optional admin key configured in frontend env. */
export function getDefaultAdminApiKey(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? "").trim();
}
