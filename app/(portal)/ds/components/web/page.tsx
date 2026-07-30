import type { Metadata } from "next";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { buildComponentsCatalogOpenGraphMetadata } from "@/lib/portal/components/open-graph";

import { ComponentsCatalogPageBody } from "./components-catalog-page-body";

export const revalidate = 60;

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
