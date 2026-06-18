import type { Metadata } from "next";

import { TextGlossaryPageView } from "@/components/portal/text-glossary-page";
import { loadTextGlossaryContent } from "@/lib/portal/load-text-glossary";
import { loadPortalSeo } from "@/lib/portal/load-portal-seo";
import { PORTAL_TEXT_GLOSSARY_PATH } from "@/lib/portal/portal-base-path";
import { buildCustomPortalShareMetadata } from "@/lib/portal/resolve-portal-seo-metadata";

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
