import { getPayload } from "payload";

import config from "@payload-config";
import type { Media, PortalSeo } from "@/payload-types";

import { PORTAL_SEO_FALLBACKS, type NormalizedPortalSeo } from "./portal-seo-defaults";
import { PORTAL_SITE_OG_RELATIVE_PATH } from "./portal-default-og";

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

/** Публичный static path или absolute https; Payload /api/media на Vercel для OG не используем. */
function mediaToPublicOgPath(media: number | Media | null | undefined): string | null {
  if (media == null || typeof media === "number") return null;
  const url = media.url?.trim();
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/api/media")) return null;
  return url.startsWith("/") ? url : `/${url}`;
}

function normalizePortalSeo(doc: PortalSeo | null | undefined): NormalizedPortalSeo {
  const siteDefaultImage =
    mediaToPublicOgPath(doc?.defaultOgImage) ?? PORTAL_SITE_OG_RELATIVE_PATH;

  return {
    siteName: trimOrNull(doc?.siteName) ?? PORTAL_SEO_FALLBACKS.siteName,
    titleDefault: trimOrNull(doc?.titleDefault) ?? PORTAL_SEO_FALLBACKS.titleDefault,
    titleTemplate: trimOrNull(doc?.titleTemplate) ?? PORTAL_SEO_FALLBACKS.titleTemplate,
    defaultDescription:
      trimOrNull(doc?.defaultDescription) ?? PORTAL_SEO_FALLBACKS.defaultDescription,
    locale: trimOrNull(doc?.locale) ?? PORTAL_SEO_FALLBACKS.locale,
    defaultOgImagePath: siteDefaultImage,
    homeShareTitle: trimOrNull(doc?.homeShareTitle) ?? PORTAL_SEO_FALLBACKS.homeShareTitle,
    homeShareDescription:
      trimOrNull(doc?.homeShareDescription) ?? PORTAL_SEO_FALLBACKS.homeShareDescription,
    homeShareImagePath:
      mediaToPublicOgPath(doc?.homeShareImage) ?? PORTAL_SEO_FALLBACKS.homeShareImagePath,
    catalogWebShareTitle:
      trimOrNull(doc?.catalogWebShareTitle) ?? PORTAL_SEO_FALLBACKS.catalogWebShareTitle,
    catalogWebShareDescription:
      trimOrNull(doc?.catalogWebShareDescription) ??
      PORTAL_SEO_FALLBACKS.catalogWebShareDescription,
    catalogWebShareImagePath:
      mediaToPublicOgPath(doc?.catalogWebShareImage) ??
      PORTAL_SEO_FALLBACKS.catalogWebShareImagePath,
    showcaseShareTitle:
      trimOrNull(doc?.showcaseShareTitle) ?? PORTAL_SEO_FALLBACKS.showcaseShareTitle,
    showcaseShareDescription:
      trimOrNull(doc?.showcaseShareDescription) ??
      PORTAL_SEO_FALLBACKS.showcaseShareDescription,
    showcaseShareImagePath:
      mediaToPublicOgPath(doc?.showcaseShareImage) ??
      PORTAL_SEO_FALLBACKS.showcaseShareImagePath,
    homePath: PORTAL_SEO_FALLBACKS.homePath,
    catalogWebPath: PORTAL_SEO_FALLBACKS.catalogWebPath,
    showcasePath: PORTAL_SEO_FALLBACKS.showcasePath,
  };
}

export async function loadPortalSeo(): Promise<NormalizedPortalSeo> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({
      slug: "portal-seo",
      depth: 1,
      overrideAccess: true,
    });
    return normalizePortalSeo(doc);
  } catch {
    return PORTAL_SEO_FALLBACKS;
  }
}
