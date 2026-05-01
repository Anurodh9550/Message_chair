export function getApiBaseUrl(): string {
  const envBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();

  if (envBase) {
    const trimmed = envBase.replace(/\/$/, "");
    return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
  }

  // ❌ REMOVE localhost fallback (ye problem create kar raha hai)

  // ✔️ Always safe fallback (production friendly)
  return "https://backend-ub3v.onrender.com/api";
}