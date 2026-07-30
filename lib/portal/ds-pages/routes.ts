import { portalPath } from "@/lib/portal/core/portal-base-path";

/** Сегменты URL, зарезервированные под статические роуты /ds/*. */
export const RESERVED_DS_PAGE_SEGMENTS = new Set(["components", "colors"]);

export function isReservedDsPagePath(segments: string[] | undefined): boolean {
  const first = segments?.[0];
  return first != null && RESERVED_DS_PAGE_SEGMENTS.has(first);
}

/** portalPath('/quick-start') → /ds/quick-start */
export function dsPagePathFromSegments(segments: string[]): string {
  if (segments.length === 0) {
    return portalPath();
  }
  return portalPath(`/${segments.join("/")}`);
}

export function dsPagePathSegmentsFromPathname(pathname: string): string[] | null {
  const base = portalPath();
  if (pathname === base) return [];
  if (!pathname.startsWith(`${base}/`)) return null;

  const segments = pathname
    .slice(base.length + 1)
    .split("/")
    .filter(Boolean);

  if (isReservedDsPagePath(segments)) return null;
  return segments;
}
