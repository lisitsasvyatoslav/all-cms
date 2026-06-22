import type { Metadata } from "next";

import { TextGlossaryPageView } from "@/components/portal/glossary/text-glossary-page";
import { loadTextGlossaryContent } from "@/lib/portal/glossary/load";
import { loadPortalSeo } from "@/lib/portal/seo/load";
import { PORTAL_TEXT_GLOSSARY_PATH } from "@/lib/portal/core/portal-base-path";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, { page }] = await Promise.all([loadPortalSeo(), loadTextGlossaryContent()]);
  return buildCustomPortalShareMetadata(seo, {
    title: page.shareTitle,
    description: page.shareDescription,
    path: PORTAL_TEXT_GLOSSARY_PATH,
  });
}

export default async function TextGlossaryPage() {
  const { page, terms } = await loadTextGlossaryContent();
  return <TextGlossaryPageView page={page} terms={terms} />;
}
