import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";
import {
  loadDsPageBySegments,
  loadPublishedDsPagePathSegments,
} from "@/lib/portal/ds-pages/load-pages";
import { isReservedDsPagePath } from "@/lib/portal/ds-pages/routes";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";

import { DsPageBody } from "./ds-page-body";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const paths = await loadPublishedDsPagePathSegments();
    return paths.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug.length || isReservedDsPagePath(slug)) {
    return { title: "DS" };
  }

  const page = await loadDsPageBySegments(slug);
  if (!page) {
    return { title: "DS" };
  }

  const seo = await loadPortalSeo();
  return buildCustomPortalShareMetadata(seo, {
    title: page.title,
    description: page.description,
    path: page.path,
  });
}

export default async function DsNestedPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug.length || isReservedDsPagePath(slug)) {
    notFound();
  }

  const page = await loadDsPageBySegments(slug);
  if (!page) {
    notFound();
  }

  return (
    <PortalPageSuspense>
      <DsPageBody segments={slug} />
    </PortalPageSuspense>
  );
}
