/** Playwright и портал открывают RelatedPreview в embed-режиме (полный кадр, без padding). */
export function isPortalStorybookEmbed(): boolean {
  if (typeof window === "undefined") return false;
  if (window.self !== window.top) return true;
  return new URLSearchParams(window.location.search).get("portalEmbed") === "1";
}

export const PORTAL_EMBED_QUERY_PARAM = "portalEmbed";
