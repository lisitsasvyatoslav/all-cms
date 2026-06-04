export const PORTAL_APPEARANCE_STORAGE_KEY = "portal-appearance";

export type PortalAppearance = "light" | "dark";

export function isPortalAppearance(value: string | null): value is PortalAppearance {
  return value === "light" || value === "dark";
}

/** Читает сохранённую тему или системную (только в браузере). */
export function readPortalAppearance(): PortalAppearance {
  try {
    const stored = localStorage.getItem(PORTAL_APPEARANCE_STORAGE_KEY);
    if (isPortalAppearance(stored)) return stored;
  } catch {
    /* private mode */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyPortalAppearanceToDocument(appearance: PortalAppearance): void {
  document.documentElement.classList.toggle("dark", appearance === "dark");
}

/** Скрипт до гидрации — без мигания при загрузке. */
export const portalAppearanceInitScript = `(function(){try{var k=${JSON.stringify(PORTAL_APPEARANCE_STORAGE_KEY)};var s=localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
