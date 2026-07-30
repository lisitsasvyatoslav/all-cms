import { notFound } from "next/navigation";

import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import {
  loadComponentPageSummary,
  loadVisibleComponentSlugs,
} from "@/lib/markdown/load-component-document";
import { parseComponentRouteSlug } from "@/lib/markdown/parse-component-route-slug";
import { buildComponentOpenGraphMetadata } from "@/lib/portal/components/open-graph";

import { ComponentPageBody } from "./component-page-body";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await loadVisibleComponentSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const parsed = parseComponentRouteSlug(slug);
  if (!parsed) return { title: "Компонент" };

  const componentSlug =
    parsed.format === "markdown" ? parsed.componentSlug : parsed.slug;

  const doc = await loadComponentPageSummary(componentSlug);
  if (!doc) {
    return { title: "Компонент" };
  }

  if (parsed.format === "markdown") {
    return {
      title: `${doc.name} (Markdown)`,
      description: doc.description ?? undefined,
    };
  }

  return buildComponentOpenGraphMetadata(doc);
}

export default async function ComponentDocPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseComponentRouteSlug(slug);
  if (!parsed) notFound();

  if (parsed.format === "markdown") {
    notFound();
  }

  return (
    <PortalPageSuspense>
      <ComponentPageBody componentSlug={parsed.slug} />
    </PortalPageSuspense>
  );
}
