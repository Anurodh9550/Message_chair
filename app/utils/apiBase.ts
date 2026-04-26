/** Django REST `api/` prefix — no trailing slash. */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
  return raw.replace(/\/$/, "");
}
