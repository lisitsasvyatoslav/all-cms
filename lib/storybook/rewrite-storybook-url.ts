import { defaultStorybookBaseUrl } from "@/lib/storybook/portal-preview-config";

const LEGACY_STORYBOOK_ORIGINS = new Set([
  "http://127.0.0.1:6006",
  "http://localhost:6006",
]);

function isLegacyStorybookOrigin(origin: string): boolean {
  return LEGACY_STORYBOOK_ORIGINS.has(origin);
}

function isPortalStorybookUrl(url: URL): boolean {
  const pathParam = url.searchParams.get("path");
  if (pathParam?.startsWith("/story/")) return true;
  if (url.pathname.endsWith("/iframe.html") && url.searchParams.get("id")) return true;
  return false;
}

function isStorybookJsOrgPlaceholder(url: URL): boolean {
  return url.hostname === "storybook.js.org";
}

/** Заменяет localhost / storybook.js.org на базовый URL из NEXT_PUBLIC_STORYBOOK_URL. */
export function rewriteStorybookDocumentUrl(
  input: string,
  baseUrl: string = defaultStorybookBaseUrl(),
): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  const base = baseUrl.replace(/\/$/, "");

  try {
    const parsed = new URL(trimmed);
    const shouldRewrite =
      isLegacyStorybookOrigin(parsed.origin) ||
      (isStorybookJsOrgPlaceholder(parsed) && isPortalStorybookUrl(parsed));

    if (!shouldRewrite) return trimmed;

    const target = new URL(`${base}/`);
    parsed.searchParams.forEach((value, key) => {
      target.searchParams.set(key, value);
    });
    if (parsed.hash) target.hash = parsed.hash;
    return target.toString();
  } catch {
    if (trimmed === "http://127.0.0.1:6006" || trimmed === "http://localhost:6006") {
      return base;
    }
    return trimmed;
  }
}

/** Ссылка на корень Storybook (portal-sources, ds-overview). */
export function rewriteStorybookBaseUrl(
  input: string,
  baseUrl: string = defaultStorybookBaseUrl(),
): string {
  const trimmed = input.trim();
  if (!trimmed) return baseUrl.replace(/\/$/, "");

  try {
    const parsed = new URL(trimmed);
    if (
      isLegacyStorybookOrigin(parsed.origin) ||
      isStorybookJsOrgPlaceholder(parsed)
    ) {
      return baseUrl.replace(/\/$/, "");
    }
    return trimmed;
  } catch {
    return baseUrl.replace(/\/$/, "");
  }
}
