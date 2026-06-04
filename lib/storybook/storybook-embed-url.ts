const DEFAULT_STORYBOOK_ORIGIN = "http://127.0.0.1:6006";

function configuredStorybookOrigins(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_STORYBOOK_URL?.trim();
  const origins = new Set<string>([DEFAULT_STORYBOOK_ORIGIN, "http://localhost:6006"]);
  if (fromEnv) {
    try {
      origins.add(new URL(fromEnv).origin);
    } catch {
      /* ignore invalid env */
    }
  }
  return [...origins];
}

export function isAllowedStorybookOrigin(origin: string): boolean {
  return configuredStorybookOrigins().includes(origin);
}

/**
 * Ссылка из UI Storybook (?path=/story/…&args=…) → iframe.html для встраивания на портал.
 * @see https://storybook.js.org/docs/writing-stories/args#setting-args-through-the-url
 */
export function storybookUrlToIframeSrc(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed, DEFAULT_STORYBOOK_ORIGIN);
  } catch {
    return null;
  }

  if (!isAllowedStorybookOrigin(parsed.origin)) return null;

  if (parsed.pathname.endsWith("/iframe.html")) {
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

  for (const key of ["args", "globals"] as const) {
    const value = parsed.searchParams.get(key);
    if (value) iframe.searchParams.set(key, value);
  }

  return iframe.toString();
}
