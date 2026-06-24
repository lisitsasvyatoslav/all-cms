export const PORTAL_CACHE_REVALIDATE_SECONDS = 60;

/** Документация компонента меняется редко; hooks сбрасывают по тегу. */
export const PORTAL_COMPONENT_DOCUMENT_REVALIDATE_SECONDS = 300;

export const PORTAL_CACHE_TAGS = {
  shell: "portal:shell",
  componentNav: "portal:component-nav",
  componentCatalog: "portal:component-catalog",
  componentDocument: "portal:component-document",
  brandNav: "portal:brand-nav",
  brandPage: "portal:brand-page",
  brandOverview: "portal:brand-overview",
  dsOverview: "portal:ds-overview",
  textGlossary: "portal:text-glossary",
  glossaryTerms: "portal:glossary-terms",
  designChecklist: "portal:design-checklist",
  portalSources: "portal:portal-sources",
  portalSeo: "portal:portal-seo",
} as const;
