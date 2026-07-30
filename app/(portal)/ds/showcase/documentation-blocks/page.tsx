import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { buildShowcaseOpenGraphMetadata } from "@/lib/portal/components/open-graph";

import { DocumentationBlocksShowcasePageBody } from "./showcase-page-body";

export const revalidate = 60;

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
