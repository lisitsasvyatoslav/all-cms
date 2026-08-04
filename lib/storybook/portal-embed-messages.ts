/** postMessage contract between Storybook canvas iframe and the portal parent. */

export const PORTAL_STORYBOOK_EMBED_READY_MESSAGE = "portal-storybook-embed-ready";
export const PORTAL_STORYBOOK_EMBED_REQUEST_EXPAND = "portal-storybook-embed-request-expand";
export const PORTAL_STORYBOOK_EMBED_REQUEST_COLLAPSE = "portal-storybook-embed-request-collapse";

export function isStorybookEmbeddedInParent(): boolean {
  return typeof window !== "undefined" && window.parent !== window;
}

function postToPortalParent(type: string): void {
  if (!isStorybookEmbeddedInParent()) return;
  window.parent.postMessage({ type }, "*");
}

/** Canvas finished painting the current story — portal can hide Skeleton. */
export function notifyPortalStorybookEmbedReady(): void {
  postToPortalParent(PORTAL_STORYBOOK_EMBED_READY_MESSAGE);
}

/** Ask portal to grow the iframe before opening Dialog/Popover overlays. */
export function requestPortalStorybookEmbedExpand(): void {
  postToPortalParent(PORTAL_STORYBOOK_EMBED_REQUEST_EXPAND);
}

/** Restore compact iframe height after overlays close. */
export function requestPortalStorybookEmbedCollapse(): void {
  postToPortalParent(PORTAL_STORYBOOK_EMBED_REQUEST_COLLAPSE);
}
