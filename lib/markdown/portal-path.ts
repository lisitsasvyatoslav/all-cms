import {
  PORTAL_BASE_PATH,
  PORTAL_BRAND_PATH,
  PORTAL_TEXT_GLOSSARY_PATH,
  PORTAL_TEXT_PATH,
  brandPath,
  portalPath,
} from "@/lib/portal/core/portal-base-path";
import {
  PORTAL_COMPONENTS_WEB_PATH,
  PORTAL_HOME_PATH,
  PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
} from "@/lib/portal/components/routes";
import { isBrandPageSlug } from "@/lib/portal/brand/nav";

export const PORTAL_MD_SUFFIX = ".md";

export type PortalMarkdownRoute =
  | { kind: "ds-home" }
  | { kind: "components-catalog" }
  | { kind: "component"; slug: string }
  | { kind: "color"; id: number }
  | { kind: "showcase-documentation-blocks" }
  | { kind: "text-home" }
  | { kind: "text-glossary" }
  | { kind: "brand-overview" }
  | { kind: "brand-page"; slug: string };

export function portalMarkdownPath(htmlPath: string): string {
  return `${htmlPath}${PORTAL_MD_SUFFIX}`;
}

export function stripPortalMarkdownSuffix(pathname: string): string | null {
  if (!pathname.endsWith(PORTAL_MD_SUFFIX)) return null;
  const htmlPath = pathname.slice(0, -PORTAL_MD_SUFFIX.length);
  return htmlPath || "/";
}

export function isPortalHtmlPath(pathname: string): boolean {
  return (
    pathname === PORTAL_BASE_PATH ||
    pathname.startsWith(`${PORTAL_BASE_PATH}/`) ||
    pathname === PORTAL_TEXT_PATH ||
    pathname.startsWith(`${PORTAL_TEXT_PATH}/`) ||
    pathname === PORTAL_BRAND_PATH ||
    pathname.startsWith(`${PORTAL_BRAND_PATH}/`)
  );
}

export function parsePortalMarkdownPath(pathname: string): PortalMarkdownRoute | null {
  const htmlPath = stripPortalMarkdownSuffix(pathname);
  if (htmlPath == null || !isPortalHtmlPath(htmlPath)) return null;

  if (htmlPath === PORTAL_HOME_PATH) {
    return { kind: "ds-home" };
  }

  if (htmlPath === PORTAL_COMPONENTS_WEB_PATH) {
    return { kind: "components-catalog" };
  }

  if (htmlPath === PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH) {
    return { kind: "showcase-documentation-blocks" };
  }

  if (htmlPath === PORTAL_TEXT_PATH) {
    return { kind: "text-home" };
  }

  if (htmlPath === PORTAL_TEXT_GLOSSARY_PATH) {
    return { kind: "text-glossary" };
  }

  if (htmlPath === PORTAL_BRAND_PATH) {
    return { kind: "brand-overview" };
  }

  const componentPrefix = `${PORTAL_COMPONENTS_WEB_PATH}/`;
  if (htmlPath.startsWith(componentPrefix)) {
    const slug = htmlPath.slice(componentPrefix.length);
    if (!slug || slug.includes("/")) return null;
    return { kind: "component", slug };
  }

  const colorsPrefix = `${portalPath("/colors")}/`;
  if (htmlPath.startsWith(colorsPrefix)) {
    const idRaw = htmlPath.slice(colorsPrefix.length);
    if (!idRaw || idRaw.includes("/")) return null;
    const id = Number(idRaw);
    if (!Number.isFinite(id)) return null;
    return { kind: "color", id };
  }

  const brandPrefix = `${PORTAL_BRAND_PATH}/`;
  if (htmlPath.startsWith(brandPrefix)) {
    const slug = htmlPath.slice(brandPrefix.length);
    if (!slug || slug.includes("/") || !isBrandPageSlug(slug)) return null;
    return { kind: "brand-page", slug };
  }

  return null;
}

export function brandPageMarkdownPath(slug: string): string {
  return portalMarkdownPath(brandPath(`/${slug}`));
}
