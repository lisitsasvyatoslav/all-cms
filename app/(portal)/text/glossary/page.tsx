import type { Metadata } from "next";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { loadTextGlossaryContent } from "@/lib/portal/glossary/load";
import { loadPortalSeo } from "@/lib/portal/seo/load";
import { PORTAL_TEXT_GLOSSARY_PATH } from "@/lib/portal/core/portal-base-path";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";

import { TextGlossaryPageBody } from "./text-glossary-page-body";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [seo, { page }] = await Promise.all([loadPortalSeo(), loadTextGlossaryContent()]);
  return buildCustomPortalShareMetadata(seo, {
    title: page.shareTitle,
    description: page.shareDescription,
    path: PORTAL_TEXT_GLOSSARY_PATH,
  });
}

export default function TextGlossaryPage() {
  return (
    <PortalPageSuspense>
      <TextGlossaryPageBody />
    </PortalPageSuspense>
  );
}
