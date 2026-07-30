import type { PortalAppearance } from "@/lib/radix/portal-appearance";
import { defaultStorybookBaseUrl } from "@/lib/storybook/portal-preview-config";
import {
  parseStorybookGlobals,
  readPinnedPortalAppearance,
  serializeStorybookGlobals,
  withPortalAppearanceGlobal,
} from "@/lib/storybook/portal-appearance-global";
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
  /** Тема Radix в iframe; по умолчанию светлая. На портале — из переключателя темы. */
  appearance?: PortalAppearance;
};

function buildPortalEmbedGlobals(
  globals: string | null,
  appearance: PortalAppearance,
): string {
  const pinned = readPinnedPortalAppearance(globals);
  const resolvedAppearance = pinned ?? appearance;

  const map = parseStorybookGlobals(globals);
  map.set("backgrounds.value", "transparent");
  map.set("portalAppearance", resolvedAppearance);
  return serializeStorybookGlobals(map);
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

  const embedAppearance = options?.appearance ?? "light";

  if (parsed.pathname.endsWith("/iframe.html")) {
    if (options?.portalEmbed) {
      parsed.searchParams.set(
        "globals",
        buildPortalEmbedGlobals(parsed.searchParams.get("globals"), embedAppearance),
      );
    }
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

  let globals = parsed.searchParams.get("globals");

  if (options?.portalEmbed) {
    iframe.searchParams.set("globals", buildPortalEmbedGlobals(globals, embedAppearance));
  } else if (globals) {
    iframe.searchParams.set("globals", globals);
  }

  const args = parsed.searchParams.get("args");
  if (args) iframe.searchParams.set("args", args);

  return iframe.toString();
}

export { withPortalAppearanceGlobal };
