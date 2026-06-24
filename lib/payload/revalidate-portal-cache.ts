import { revalidateTag } from "next/cache";

import { PORTAL_CACHE_TAGS } from "@/lib/portal/cache/tags";

const REVALIDATE_PROFILE = "max";

function safeRevalidateTag(tag: string): void {
  try {
    revalidateTag(tag, REVALIDATE_PROFILE);
  } catch {
    // Seed scripts and CLI run outside Next.js request scope.
  }
}

export function revalidatePortalComponentNavCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.componentNav);
}

export function revalidatePortalComponentCatalogCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.componentCatalog);
}

export function revalidatePortalComponentDocumentCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.componentDocument);
}

/** Любое изменение компонента в CMS. */
export function revalidatePortalComponentCaches(): void {
  revalidatePortalComponentNavCache();
  revalidatePortalComponentCatalogCache();
  revalidatePortalComponentDocumentCache();
}

export function revalidatePortalBrandNavCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.brandNav);
}

export function revalidatePortalBrandPageCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.brandPage);
}

export function revalidatePortalBrandCaches(): void {
  revalidatePortalBrandNavCache();
  revalidatePortalBrandPageCache();
}

export function revalidatePortalBrandOverviewCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.brandOverview);
}

export function revalidatePortalDsOverviewCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.dsOverview);
}

export function revalidatePortalTextGlossaryCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.textGlossary);
}

export function revalidatePortalGlossaryTermsCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.glossaryTerms);
}

export function revalidatePortalGlossaryCaches(): void {
  revalidatePortalTextGlossaryCache();
  revalidatePortalGlossaryTermsCache();
}

export function revalidatePortalDesignChecklistCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.designChecklist);
}

export function revalidatePortalSourcesCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.portalSources);
}

export function revalidatePortalSeoCache(): void {
  safeRevalidateTag(PORTAL_CACHE_TAGS.portalSeo);
}
