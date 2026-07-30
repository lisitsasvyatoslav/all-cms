import type { Metadata } from "next";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { loadBrandOverview } from "@/lib/portal/brand/load-pages";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";
import { PORTAL_BRAND_PATH } from "@/lib/portal/core/portal-base-path";
import { BrandOverviewPageBody } from "./brand-overview-page-body";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [seo, overview] = await Promise.all([loadPortalSeo(), loadBrandOverview()]);
  return buildCustomPortalShareMetadata(seo, {
    title: overview.shareTitle,
    description: overview.shareDescription,
    path: PORTAL_BRAND_PATH,
  });
}

export default function BrandPage() {
  return (
    <PortalPageSuspense>
      <BrandOverviewPageBody />
    </PortalPageSuspense>
  );
}
