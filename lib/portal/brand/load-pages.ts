import { cache } from "react";
import { unstable_cache } from "next/cache";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import { normalizeBrandSections } from "@/lib/payload/normalize-brand-page";
import { normalizeBrandColorData } from "@/lib/payload/normalize-brand-color";
import { PORTAL_CACHE_REVALIDATE_SECONDS, PORTAL_CACHE_TAGS } from "@/lib/portal/cache/tags";
import type { BrandPageContent } from "@/lib/portal/brand/content";
import type { BrandColorData } from "@/lib/portal/brand/color-data";
import { brandPath } from "@/lib/portal/core/portal-base-path";
import type { BrandNavItem, BrandPageSlug } from "@/lib/portal/brand/nav";
import { isBrandPageSlug } from "@/lib/portal/brand/nav";

export type NormalizedBrandOverview = {
  title: string;
  intro: string;
  shareTitle: string;
  shareDescription: string;
};

const BRAND_NAV_SELECT = {
  slug: true,
  title: true,
  description: true,
  sortOrder: true,
} as const;

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

type BrandPageDoc = {
  slug: string;
  title?: string | null;
  description?: string | null;
  intro?: string | null;
  sections?: Parameters<typeof normalizeBrandSections>[0];
  shareTitle?: string | null;
  shareDescription?: string | null;
};

function normalizeBrandPageDoc(doc: BrandPageDoc): BrandPageContent | null {
  const slug = doc.slug;
  if (!isBrandPageSlug(slug)) return null;

  const title = trimOrNull(doc.title);
  if (!title) return null;

  return {
    slug,
    title,
    description: trimOrNull(doc.description) ?? "",
    intro: trimOrNull(doc.intro) ?? "",
    sections: normalizeBrandSections(doc.sections),
  };
}

export function mapBrandPagesToNavItems(docs: BrandPageDoc[]): BrandNavItem[] {
  return docs
    .filter((doc): doc is BrandPageDoc & { slug: BrandPageSlug } => isBrandPageSlug(doc.slug))
    .map((doc) => {
      const title = trimOrNull(doc.title) ?? doc.slug;
      return {
        slug: doc.slug,
        label: title,
        href: brandPath(`/${doc.slug}`),
        description: trimOrNull(doc.description) ?? "",
      };
    });
}

async function fetchBrandNavItems(): Promise<BrandNavItem[]> {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "brand-pages",
    depth: 0,
    limit: 20,
    sort: "sortOrder",
    overrideAccess: true,
    select: BRAND_NAV_SELECT,
  });
  return mapBrandPagesToNavItems(docs);
}

const getCachedBrandNavItems = unstable_cache(fetchBrandNavItems, ["portal-brand-nav"], {
  revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
  tags: [PORTAL_CACHE_TAGS.brandNav, PORTAL_CACHE_TAGS.shell],
});

async function fetchBrandOverview(): Promise<NormalizedBrandOverview> {
  const payload = await getCachedPayload();
  const doc = await payload.findGlobal({
    slug: "brand-overview",
    depth: 0,
    overrideAccess: true,
  });

  const title = trimOrNull(doc.title) ?? "";

  return {
    title,
    intro: trimOrNull(doc.intro) ?? "",
    shareTitle: trimOrNull(doc.shareTitle) ?? title,
    shareDescription: trimOrNull(doc.shareDescription) ?? "",
  };
}

const getCachedBrandOverview = unstable_cache(fetchBrandOverview, ["portal-brand-overview"], {
  revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
  tags: [PORTAL_CACHE_TAGS.brandOverview],
});

export const loadBrandOverview = cache(async (): Promise<NormalizedBrandOverview> => {
  return getCachedBrandOverview();
});

export async function loadBrandColorData(): Promise<BrandColorData | null> {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "brand-pages",
    where: { slug: { equals: "color" } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  const doc = docs[0];
  if (!doc) return null;

  return normalizeBrandColorData(doc);
}

async function fetchBrandPage(slug: BrandPageSlug): Promise<BrandPageContent | null> {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "brand-pages",
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  const doc = docs[0];
  if (!doc) return null;

  return normalizeBrandPageDoc(doc);
}

const getCachedBrandPage = unstable_cache(
  fetchBrandPage,
  ["portal-brand-page"],
  {
    revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
    tags: [PORTAL_CACHE_TAGS.brandPage],
  },
);

export const loadBrandPage = cache(async (slug: BrandPageSlug): Promise<BrandPageContent | null> => {
  return getCachedBrandPage(slug);
});

export const loadBrandNavItems = cache(async (): Promise<BrandNavItem[]> => {
  return getCachedBrandNavItems();
});

export const loadBrandPageWithColor = cache(async (slug: BrandPageSlug): Promise<{
  page: BrandPageContent;
  colorData: BrandColorData | null;
} | null> => {
  const page = await loadBrandPage(slug);
  if (!page) return null;

  const colorData = slug === "color" ? await loadBrandColorData() : null;
  return { page, colorData };
});

export function getBrandPageShareMeta(
  page: BrandPageContent,
  doc?: Pick<BrandPageDoc, "shareTitle" | "shareDescription"> | null,
) {
  return {
    title: trimOrNull(doc?.shareTitle) ?? page.title,
    description: trimOrNull(doc?.shareDescription) ?? page.description,
  };
}
