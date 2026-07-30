import type { PortalAppearance } from "@/lib/radix/portal-appearance";

export const PORTAL_APPEARANCE_GLOBAL = "portalAppearance";

export function isPortalAppearanceValue(value: string | null | undefined): value is PortalAppearance {
  return value === "light" || value === "dark";
}

export function parseStorybookGlobals(globals: string | null | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!globals?.trim()) return map;

  for (const part of globals.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    map.set(trimmed.slice(0, separator), trimmed.slice(separator + 1));
  }

  return map;
}

export function serializeStorybookGlobals(globals: Map<string, string>): string {
  return [...globals.entries()].map(([key, value]) => `${key}:${value}`).join(";");
}

export function readPortalAppearanceGlobal(globals: string | null | undefined): PortalAppearance | null {
  const value = parseStorybookGlobals(globals).get(PORTAL_APPEARANCE_GLOBAL);
  return isPortalAppearanceValue(value) ? value : null;
}

/** Legacy: тёмный canvas Storybook backgrounds → appearance. */
export function inferAppearanceFromBackgroundGlobal(
  globals: string | null | undefined,
): PortalAppearance | null {
  const background = parseStorybookGlobals(globals).get("backgrounds.value");
  if (background === "#111113" || background === "#0a0a0a") return "dark";
  if (background === "#ffffff") return "light";
  return null;
}

/** Зафиксированная тема в URL (portalAppearance или legacy backgrounds). */
export function readPinnedPortalAppearance(
  globals: string | null | undefined,
): PortalAppearance | null {
  return readPortalAppearanceGlobal(globals) ?? inferAppearanceFromBackgroundGlobal(globals);
}

export function withPortalAppearanceGlobal(
  globals: string | null | undefined,
  appearance: PortalAppearance,
): string {
  const map = parseStorybookGlobals(globals);
  map.set(PORTAL_APPEARANCE_GLOBAL, appearance);
  return serializeStorybookGlobals(map);
}
