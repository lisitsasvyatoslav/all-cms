import type { PortalAppearance } from "@/lib/radix/portal-appearance";
import { defaultStorybookBaseUrl } from "@/lib/storybook/portal-preview-config";
import { rewriteStorybookDocumentUrl } from "@/lib/storybook/rewrite-storybook-url";

const DEFAULT_STORYBOOK_ORIGIN = "http://127.0.0.1:6006";

function configuredStorybookOrigins(): string[] {
  const fromEnv = defaultStorybookBaseUrl();
  const origins = new Set<string>([DEFAULT_STORYBOOK_ORIGIN, "http://localhost:6006"]);
  try {
    origins.add(new URL(fromEnv).origin);
  } catch {
    /* ignore invalid env */
  }
  return [...origins];
}

export function isAllowedStorybookOrigin(origin: string): boolean {
  return configuredStorybookOrigins().includes(origin);
}

export type StorybookIframeOptions = {
  /** Центрирование и прозрачный фон для live preview на портале. */
  portalEmbed?: boolean;
  /** Sync Radix Theme appearance into Storybook globals (`portalAppearance`). */
  portalAppearance?: PortalAppearance;
};

function appendGlobals(existing: string | null, fragment: string): string {
  if (!existing?.trim()) return fragment;
  if (existing.split(";").includes(fragment)) return existing;
  return `${existing};${fragment}`;
}

function applyPortalEmbedGlobals(
  existing: string | null,
  options?: StorybookIframeOptions,
): string | null {
  if (!options?.portalEmbed) return existing;

  let globals = appendGlobals(existing, "backgrounds.value:transparent");
  if (options.portalAppearance === "dark" || options.portalAppearance === "light") {
    globals = appendGlobals(globals, `portalAppearance:${options.portalAppearance}`);
  }
  return globals;
}

/**
 * Ссылка из UI Storybook (?path=/story/…&args=…) → iframe.html для встраивания на портал.
 * @see https://storybook.js.org/docs/writing-stories/args#setting-args-through-the-url
 */
export function storybookUrlToIframeSrc(
  input: string,
  options?: StorybookIframeOptions,
): string | null {
  const trimmed = rewriteStorybookDocumentUrl(input).trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed, DEFAULT_STORYBOOK_ORIGIN);
  } catch {
    return null;
  }

  if (!isAllowedStorybookOrigin(parsed.origin)) return null;

  if (parsed.pathname.endsWith("/iframe.html")) {
    const globals = applyPortalEmbedGlobals(parsed.searchParams.get("globals"), options);
    if (globals) parsed.searchParams.set("globals", globals);
    return parsed.toString();
  }

  const pathParam = parsed.searchParams.get("path");
  if (!pathParam?.startsWith("/story/")) {
    return null;
  }

  const storyId = pathParam.slice("/story/".length);
  if (!storyId) return null;

  const iframe = new URL("/iframe.html", parsed.origin);
  iframe.searchParams.set("viewMode", "story");
  iframe.searchParams.set("id", storyId);

  const globals = applyPortalEmbedGlobals(parsed.searchParams.get("globals"), options);
  if (globals) iframe.searchParams.set("globals", globals);

  const args = parsed.searchParams.get("args");
  if (args) iframe.searchParams.set("args", args);

  return iframe.toString();
}
