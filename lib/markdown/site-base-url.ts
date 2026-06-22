export function resolveSiteBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!fromEnv) return "http://127.0.0.1:3000";
  return fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
}
