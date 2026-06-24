import { cache } from "react";
import { unstable_cache } from "next/cache";

import type { Component } from "@/payload-types";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import { PORTAL_CACHE_TAGS, PORTAL_COMPONENT_DOCUMENT_REVALIDATE_SECONDS } from "@/lib/portal/cache/tags";
import { isComponentVisibleOnPortal } from "@/lib/portal/components/status";
import { loadComponentNavGroups } from "@/lib/portal/components/load-nav-groups";

/** Поля карточки + OG — без тяжёлой documentation (metadata, шапка страницы). */
const COMPONENT_PAGE_SUMMARY_SELECT = {
  slug: true,
  name: true,
  description: true,
  status: true,
  statusNote: true,
  figmaUrl: true,
  storybookUrl: true,
  docsUrl: true,
  replacedBy: true,
  showTOC: true,
  relatedPreviewLight: true,
  relatedPreviewDark: true,
} as const;

/** Полная страница: карточка + documentation blocks (depth 2 хватает для media и related). */
const COMPONENT_PAGE_DOCUMENT_SELECT = {
  ...COMPONENT_PAGE_SUMMARY_SELECT,
  designChecklist: true,
  documentation: true,
} as const;

export type ComponentPageSummary = Pick<
  Component,
  keyof typeof COMPONENT_PAGE_SUMMARY_SELECT
>;

async function fetchComponentPageSummary(
  componentSlug: string,
): Promise<ComponentPageSummary | null> {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "components",
    where: { slug: { equals: componentSlug } },
    limit: 1,
    depth: 1,
    select: COMPONENT_PAGE_SUMMARY_SELECT,
  });
  const doc = docs[0];
  if (!doc || !isComponentVisibleOnPortal(doc)) return null;
  return doc;
}

async function fetchComponentPageDocument(componentSlug: string): Promise<Component | null> {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "components",
    where: { slug: { equals: componentSlug } },
    limit: 1,
    depth: 2,
    select: COMPONENT_PAGE_DOCUMENT_SELECT,
  });
  const doc = docs[0] as Component | undefined;
  if (!doc || !isComponentVisibleOnPortal(doc)) return null;
  return doc;
}

const getCachedComponentPageSummary = unstable_cache(
  fetchComponentPageSummary,
  ["portal-component-page-summary", "v1"],
  {
    revalidate: PORTAL_COMPONENT_DOCUMENT_REVALIDATE_SECONDS,
    tags: [PORTAL_CACHE_TAGS.componentDocument, PORTAL_CACHE_TAGS.componentNav],
  },
);

const getCachedComponentPageDocument = unstable_cache(
  fetchComponentPageDocument,
  ["portal-component-page-document", "v3"],
  {
    revalidate: PORTAL_COMPONENT_DOCUMENT_REVALIDATE_SECONDS,
    tags: [PORTAL_CACHE_TAGS.componentDocument, PORTAL_CACHE_TAGS.componentNav],
  },
);

/** Лёгкий запрос для generateMetadata и шапки (depth 1, без documentation). */
export const loadComponentPageSummary = cache(
  async (componentSlug: string): Promise<ComponentPageSummary | null> => {
    return getCachedComponentPageSummary(componentSlug);
  },
);

/** Полный документ страницы (depth 2 вместо 3). */
export const loadComponentPageDocument = cache(
  async (componentSlug: string): Promise<Component | null> => {
    return getCachedComponentPageDocument(componentSlug);
  },
);

/** @deprecated Используйте loadComponentPageDocument; оставлено для markdown export. */
export const loadComponentDocument = loadComponentPageDocument;

export const loadVisibleComponentSlugs = cache(async (): Promise<string[]> => {
  const groups = await loadComponentNavGroups();
  return groups.flatMap((group) => group.items.map((item) => item.slug));
});
