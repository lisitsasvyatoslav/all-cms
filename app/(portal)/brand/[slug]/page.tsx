import type { Metadata } from "next";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { loadBrandPageWithColor } from "@/lib/portal/brand/load-pages";
import {
  BRAND_PAGE_SLUGS,
  isBrandPageSlug,
  type BrandPageSlug,
} from "@/lib/portal/brand/nav";
import { brandPath } from "@/lib/portal/core/portal-base-path";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";

import { BrandSlugPageBody } from "./brand-slug-page-body";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: BrandPageSlug }[] {
  return BRAND_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isBrandPageSlug(slug)) {
    return { title: "Brand" };
  }

  const result = await loadBrandPageWithColor(slug);
  if (!result) {
    return { title: "Brand" };
  }

  const { page } = result;
  const seo = await loadPortalSeo();
  return buildCustomPortalShareMetadata(seo, {
    title: page.title,
    description: page.description,
    path: brandPath(`/${slug}`),
  });
}

export default async function BrandFoundationPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <PortalPageSuspense>
      <BrandSlugPageBody slug={slug} />
    </PortalPageSuspense>
  );
}
