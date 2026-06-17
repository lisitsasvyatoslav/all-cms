import { getPayload } from "payload";

import config from "@payload-config";
import type { PortalSeo } from "@/payload-types";

import { PORTAL_SEO_FALLBACKS, type NormalizedPortalSeo } from "./portal-seo-defaults";
import { PORTAL_SITE_OG_RELATIVE_PATH } from "./portal-default-og";

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

function normalizePortalSeo(doc: PortalSeo | null | undefined): NormalizedPortalSeo {
  // OG-картинка для не-комponent страниц — только static portal-site.webp (не Payload Media / button preview).
  const siteOgImagePath = PORTAL_SITE_OG_RELATIVE_PATH;

  return {
    siteName: trimOrNull(doc?.siteName) ?? PORTAL_SEO_FALLBACKS.siteName,
    titleDefault: trimOrNull(doc?.titleDefault) ?? PORTAL_SEO_FALLBACKS.titleDefault,
    titleTemplate: trimOrNull(doc?.titleTemplate) ?? PORTAL_SEO_FALLBACKS.titleTemplate,
    defaultDescription:
      trimOrNull(doc?.defaultDescription) ?? PORTAL_SEO_FALLBACKS.defaultDescription,
    locale: trimOrNull(doc?.locale) ?? PORTAL_SEO_FALLBACKS.locale,
    defaultOgImagePath: siteOgImagePath,
    homeShareTitle: trimOrNull(doc?.homeShareTitle) ?? PORTAL_SEO_FALLBACKS.homeShareTitle,
    homeShareDescription:
      trimOrNull(doc?.homeShareDescription) ?? PORTAL_SEO_FALLBACKS.homeShareDescription,
    homeShareImagePath: siteOgImagePath,
    catalogWebShareTitle:
      trimOrNull(doc?.catalogWebShareTitle) ?? PORTAL_SEO_FALLBACKS.catalogWebShareTitle,
    catalogWebShareDescription:
      trimOrNull(doc?.catalogWebShareDescription) ??
      PORTAL_SEO_FALLBACKS.catalogWebShareDescription,
    catalogWebShareImagePath: siteOgImagePath,
    showcaseShareTitle:
      trimOrNull(doc?.showcaseShareTitle) ?? PORTAL_SEO_FALLBACKS.showcaseShareTitle,
    showcaseShareDescription:
      trimOrNull(doc?.showcaseShareDescription) ??
      PORTAL_SEO_FALLBACKS.showcaseShareDescription,
    showcaseShareImagePath: siteOgImagePath,
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
