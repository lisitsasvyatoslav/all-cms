import type { Metadata } from "next";

import { BrandOverviewPageView } from "@/components/portal/brand/brand-foundation-page";
import { loadBrandNavItems, loadBrandOverview } from "@/lib/portal/brand/load-pages";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";
import { PORTAL_BRAND_PATH } from "@/lib/portal/core/portal-base-path";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, overview] = await Promise.all([loadPortalSeo(), loadBrandOverview()]);
  return buildCustomPortalShareMetadata(seo, {
    title: overview.shareTitle,
    description: overview.shareDescription,
    path: PORTAL_BRAND_PATH,
  });
}

export default async function BrandPage() {
  const [overview, navItems] = await Promise.all([loadBrandOverview(), loadBrandNavItems()]);
  return <BrandOverviewPageView overview={overview} navItems={navItems} />;
}
