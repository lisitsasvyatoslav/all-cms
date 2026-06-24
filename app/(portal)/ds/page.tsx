import type { Metadata } from "next";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { buildHomeOpenGraphMetadata } from "@/lib/portal/components/open-graph";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";

import { DsHomePageBody } from "./ds-home-page-body";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeOpenGraphMetadata();
}

export default function Home() {
  return (
    <PortalPageSuspense>
      <DsHomePageBody />
    </PortalPageSuspense>
  );
}
