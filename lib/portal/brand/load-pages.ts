import { getPayload } from "payload";

import config from "@payload-config";

import { normalizeBrandSections } from "@/lib/payload/normalize-brand-page";
import { normalizeBrandColorData } from "@/lib/payload/normalize-brand-color";
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

export async function loadBrandOverview(): Promise<NormalizedBrandOverview> {
  const payload = await getPayload({ config });
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

export async function loadBrandColorData(): Promise<BrandColorData | null> {
  const payload = await getPayload({ config });
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

export async function loadBrandPages(): Promise<BrandPageContent[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "brand-pages",
    depth: 0,
    limit: 20,
    sort: "sortOrder",
    overrideAccess: true,
  });

  return docs
    .map((doc) => normalizeBrandPageDoc(doc))
    .filter((page): page is BrandPageContent => page != null);
}

export async function loadBrandPage(slug: BrandPageSlug): Promise<BrandPageContent | null> {
  const payload = await getPayload({ config });
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

export async function loadBrandNavItems(): Promise<BrandNavItem[]> {
  const pages = await loadBrandPages();

  return pages.map((page) => ({
    slug: page.slug,
    label: page.title,
    href: brandPath(`/${page.slug}`),
    description: page.description,
  }));
}

export async function loadBrandPageWithColor(slug: BrandPageSlug): Promise<{
  page: BrandPageContent;
  colorData: BrandColorData | null;
} | null> {
  const page = await loadBrandPage(slug);
  if (!page) return null;

  const colorData = slug === "color" ? await loadBrandColorData() : null;
  return { page, colorData };
}

export function getBrandPageShareMeta(
  page: BrandPageContent,
  doc?: Pick<BrandPageDoc, "shareTitle" | "shareDescription"> | null,
) {
  return {
    title: trimOrNull(doc?.shareTitle) ?? page.title,
    description: trimOrNull(doc?.shareDescription) ?? page.description,
  };
}
