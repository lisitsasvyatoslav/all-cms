import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { buildShowcaseOpenGraphMetadata } from "@/lib/portal/components/open-graph";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";

import { DocumentationBlocksShowcasePageBody } from "./showcase-page-body";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

export async function generateMetadata() {
  return buildShowcaseOpenGraphMetadata();
}

export default function DocumentationBlocksShowcasePage() {
  return (
    <PortalPageSuspense>
      <DocumentationBlocksShowcasePageBody />
    </PortalPageSuspense>
  );
}
