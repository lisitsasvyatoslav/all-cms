export const PORTAL_COMPONENTS_WEB_PATH = "/components/web";

export function componentWebPagePath(slug: string): string {
  return `${PORTAL_COMPONENTS_WEB_PATH}/${slug}`;
}

export function componentWebMarkdownPath(slug: string): string {
  return `${componentWebPagePath(slug)}.md`;
}

/** Slug компонента из pathname вида /components/web/button. */
export function componentSlugFromWebPathname(pathname: string): string | null {
  if (!pathname.startsWith(`${PORTAL_COMPONENTS_WEB_PATH}/`)) return null;
  const rest = pathname.slice(`${PORTAL_COMPONENTS_WEB_PATH}/`.length);
  const slug = rest.split("/")[0];
  return slug || null;
}
