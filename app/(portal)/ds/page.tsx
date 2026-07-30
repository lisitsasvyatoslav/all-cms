import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { loadDsIntroductionPage } from "@/lib/portal/ds-pages/load-pages";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";

import { DsPageBody } from "./[...slug]/ds-page-body";

export const revalidate = 60;

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
