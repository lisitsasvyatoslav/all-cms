const DEFAULT_PORTAL_ORIGIN = "http://127.0.0.1:3000";

/** Origin портала для metadataBase и абсолютных ссылок (OG, Markdown). */
export function portalSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!fromEnv) return DEFAULT_PORTAL_ORIGIN;

  try {
    return new URL(fromEnv).origin;
  } catch {
    return DEFAULT_PORTAL_ORIGIN;
  }
}

/** Абсолютный URL ресурса портала (path или уже absolute). */
export function portalAbsoluteUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return portalSiteOrigin();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = portalSiteOrigin();
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}
