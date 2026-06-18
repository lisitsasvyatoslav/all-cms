/** Базовый сегмент URL портала: домен/ds/… */
export const PORTAL_BASE_PATH = "/ds";

/** Страница /text — соседний роут на уровне /ds */
export const PORTAL_TEXT_PATH = "/text";

/** Страница /brand — бренд-гайдлайны */
export const PORTAL_BRAND_PATH = "/brand";

export type PortalAreaId = "ds" | "text" | "brand";

/** Собирает путь внутри /text: textPath("/glossary") → /text/glossary */
export function textPath(subpath: string = "/"): string {
  if (subpath === "/" || subpath === "") {
    return PORTAL_TEXT_PATH;
  }
  const normalized = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `${PORTAL_TEXT_PATH}${normalized}`;
}

export const PORTAL_TEXT_GLOSSARY_PATH = textPath("/glossary");

/** Собирает путь внутри /brand: brandPath("/logo") → /brand/logo */
export function brandPath(subpath: string = "/"): string {
  if (subpath === "/" || subpath === "") {
    return PORTAL_BRAND_PATH;
  }
  const normalized = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `${PORTAL_BRAND_PATH}${normalized}`;
}

/** Текущий раздел портала по pathname. */
export function portalAreaFromPathname(pathname: string): PortalAreaId {
  if (pathname === PORTAL_TEXT_PATH || pathname.startsWith(`${PORTAL_TEXT_PATH}/`)) {
    return "text";
  }
  if (pathname === PORTAL_BRAND_PATH || pathname.startsWith(`${PORTAL_BRAND_PATH}/`)) {
    return "brand";
  }
  return "ds";
}

/** Собирает путь портала: portalPath("/components/web") → /ds/components/web */
export function portalPath(subpath: string = "/"): string {
  if (subpath === "/" || subpath === "") {
    return PORTAL_BASE_PATH;
  }
  const normalized = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `${PORTAL_BASE_PATH}${normalized}`;
}

/** Главная портала с якорем: /ds#overview */
export function portalHomeHash(hash: string): string {
  const fragment = hash.startsWith("#") ? hash : `#${hash}`;
  return `${PORTAL_BASE_PATH}${fragment}`;
}
