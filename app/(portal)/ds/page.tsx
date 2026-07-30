import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";
import { loadDsIntroductionPage } from "@/lib/portal/ds-pages/load-pages";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";

import { DsPageBody } from "./[...slug]/ds-page-body";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadDsIntroductionPage();
  if (!page) {
    return { title: "Введение" };
  }

  const seo = await loadPortalSeo();
  return buildCustomPortalShareMetadata(seo, {
    title: page.title,
    description: page.description,
    path: page.path,
  });
}

export default async function DsIntroductionPage() {
  const page = await loadDsIntroductionPage();
  if (!page) notFound();

  return (
    <PortalPageSuspense>
      <DsPageBody page={page} />
    </PortalPageSuspense>
  );
}
