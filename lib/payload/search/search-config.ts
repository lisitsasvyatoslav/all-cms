import { joinSearchText } from "./extract-search-text";
import { normalizePortalSearchText } from "./normalize-search-text";

/** `title` — только заголовок; `full` — заголовок + описание + блоки документации. */
export type PortalSearchMatchScope = "title" | "full";

export const PORTAL_SEARCH_MATCH_SCOPE: PortalSearchMatchScope = "title";

export function buildPortalSearchIndexText(title: string, excerptText: string): string {
  const source =
    PORTAL_SEARCH_MATCH_SCOPE === "title" ? title.trim() : joinSearchText(title, excerptText);
  return normalizePortalSearchText(source);
}

export function portalSearchMatchScopeLabel(scope: PortalSearchMatchScope = PORTAL_SEARCH_MATCH_SCOPE): string {
  return scope === "title" ? "только заголовок" : "заголовок и контент";
}
