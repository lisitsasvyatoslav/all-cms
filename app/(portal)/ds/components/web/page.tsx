import type { Metadata } from "next";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { buildComponentsCatalogOpenGraphMetadata } from "@/lib/portal/components/open-graph";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";

import { ComponentsCatalogPageBody } from "./components-catalog-page-body";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  return buildComponentsCatalogOpenGraphMetadata();
}

export default function ComponentsWebPage() {
  return (
    <PortalPageSuspense>
      <ComponentsCatalogPageBody />
    </PortalPageSuspense>
  );
}
