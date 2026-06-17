import type { Metadata } from "next";

import type { Component } from "@/payload-types";

import { loadPortalSeo } from "@/lib/portal/load-portal-seo";
import { resolveRelatedComponentPreview } from "@/lib/portal/resolve-related-component-preview";
import {
  buildComponentShareMetadata,
  buildPortalLayoutMetadata,
  buildPortalSeoPageMetadata,
  buildCustomPortalShareMetadata,
} from "@/lib/portal/resolve-portal-seo-metadata";

export async function buildPortalLayoutMetadataFromCms(): Promise<
  Pick<Metadata, "title" | "description" | "metadataBase" | "openGraph" | "twitter">
> {
  const seo = await loadPortalSeo();
  return buildPortalLayoutMetadata(seo);
}

export async function buildHomeOpenGraphMetadata(): Promise<
  Pick<Metadata, "title" | "description" | "openGraph" | "twitter">
> {
  const seo = await loadPortalSeo();
  return buildPortalSeoPageMetadata(seo, "home");
}

export async function buildComponentsCatalogOpenGraphMetadata(): Promise<
  Pick<Metadata, "title" | "description" | "openGraph" | "twitter">
> {
  const seo = await loadPortalSeo();
  return buildPortalSeoPageMetadata(seo, "catalogWeb");
}

export async function buildShowcaseOpenGraphMetadata(): Promise<
  Pick<Metadata, "title" | "description" | "openGraph" | "twitter">
> {
  const seo = await loadPortalSeo();
  return buildPortalSeoPageMetadata(seo, "showcase");
}

type ComponentOpenGraphInput = Pick<
  Component,
  "slug" | "name" | "description" | "relatedPreviewLight" | "relatedPreviewDark"
>;

export async function buildComponentOpenGraphMetadata(
  doc: ComponentOpenGraphInput,
): Promise<Pick<Metadata, "title" | "description" | "openGraph" | "twitter">> {
  const seo = await loadPortalSeo();
  const slug = String(doc.slug);
  const title = String(doc.name);
  const description = doc.description?.trim() || undefined;
  const preview = resolveRelatedComponentPreview(doc);
  const imagePath = preview.lightUrl ?? seo.defaultOgImagePath;

  return buildComponentShareMetadata(seo, {
    title,
    description,
    slug,
    imagePath,
    imageAlt: preview.lightUrl ? preview.alt : title,
  });
}

export async function buildColorPageOpenGraphMetadata(input: {
  title: string;
  description?: string;
  path: string;
}): Promise<Pick<Metadata, "title" | "description" | "openGraph" | "twitter">> {
  const seo = await loadPortalSeo();
  return buildCustomPortalShareMetadata(seo, input);
}
