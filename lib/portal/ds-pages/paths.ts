import { portalPath } from "@/lib/portal/core/portal-base-path";

/** Корневая страница Overview — slug в CMS, URL /ds. */
export const DS_INTRODUCTION_SLUG = "introduction";

/** Плоский Overview раздела /ds (как Hero UI Getting Started). */
export const DS_OVERVIEW_PAGE_SLUGS = [
  "introduction",
  "quick-start",
  "design-principles",
  "frameworks",
  "cli",
  "showcase",
] as const;

export type DsOverviewPageSlug = (typeof DS_OVERVIEW_PAGE_SLUGS)[number];

export function isDsOverviewPageSlug(slug: string): slug is DsOverviewPageSlug {
  return (DS_OVERVIEW_PAGE_SLUGS as readonly string[]).includes(slug);
}

export function dsPagePathFromSlug(slug: string): string {
  if (slug === DS_INTRODUCTION_SLUG) {
    return portalPath();
  }
  return portalPath(`/${slug}`);
}

export function dsPageSegmentsFromSlug(slug: string): string[] {
  if (slug === DS_INTRODUCTION_SLUG) return [];
  return [slug];
}
