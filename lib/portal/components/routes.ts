import { portalPath } from "@/lib/portal/core/portal-base-path";
import { portalMarkdownPath } from "@/lib/markdown/portal-path";

export const PORTAL_HOME_PATH = portalPath("/");
export const PORTAL_COMPONENTS_WEB_PATH = portalPath("/components/web");
export const PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH = portalPath(
  "/showcase/documentation-blocks",
);

export function componentWebPagePath(slug: string): string {
  return `${PORTAL_COMPONENTS_WEB_PATH}/${slug}`;
}

export function componentWebMarkdownPath(slug: string): string {
  return portalMarkdownPath(componentWebPagePath(slug));
}

export function colorPagePath(id: string | number): string {
  return portalPath(`/colors/${id}`);
}

/** Slug компонента из pathname вида /ds/components/web/button. */
export function componentSlugFromWebPathname(pathname: string): string | null {
  if (!pathname.startsWith(`${PORTAL_COMPONENTS_WEB_PATH}/`)) return null;
  const rest = pathname.slice(`${PORTAL_COMPONENTS_WEB_PATH}/`.length);
  const slug = rest.split("/")[0];
  return slug || null;
}
