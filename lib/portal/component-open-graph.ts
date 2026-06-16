import type { Metadata } from "next";

import { PORTAL_COMPONENTS_WEB_PATH, componentWebPagePath } from "@/lib/portal/component-routes";
import { PORTAL_SITE_OG_RELATIVE_PATH } from "@/lib/portal/portal-default-og";
import { resolveRelatedComponentPreview } from "@/lib/portal/resolve-related-component-preview";
import {
  RELATED_PREVIEW_HEIGHT,
  RELATED_PREVIEW_WIDTH,
} from "@/lib/portal/related-preview-layout";
import { portalAbsoluteUrl, portalSiteOrigin } from "@/lib/portal/portal-site-url";
import type { Component } from "@/payload-types";

const PORTAL_SITE_NAME = "Design System";

type OpenGraphImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

function buildOpenGraphImages(imagePath: string, alt: string): OpenGraphImage[] {
  return [
    {
      url: portalAbsoluteUrl(imagePath),
      width: RELATED_PREVIEW_WIDTH,
      height: RELATED_PREVIEW_HEIGHT,
      alt,
    },
  ];
}

function metadataWithImages(
  title: string,
  description: string | undefined,
  pagePath: string,
  type: "website" | "article",
  images: OpenGraphImage[],
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const imageUrls = images.map((image) => image.url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pagePath,
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls,
    },
  };
}

/** Базовые openGraph/twitter для layout портала (дефолтная OG-картинка). */
export function portalRootOpenGraphMetadata(): Pick<
  Metadata,
  "metadataBase" | "openGraph" | "twitter"
> {
  const defaultImages = buildOpenGraphImages(
    PORTAL_SITE_OG_RELATIVE_PATH,
    PORTAL_SITE_NAME,
  );

  return {
    metadataBase: new URL(portalSiteOrigin()),
    openGraph: {
      siteName: PORTAL_SITE_NAME,
      locale: "ru_RU",
      type: "website",
      images: defaultImages,
    },
    twitter: {
      card: "summary_large_image",
      images: defaultImages.map((image) => image.url),
    },
  };
}

type PortalPageOpenGraphInput = {
  title: string;
  description?: string;
  path: string;
};

/** OG для статических страниц портала (главная, каталог). */
export function buildPortalPageOpenGraphMetadata(
  input: PortalPageOpenGraphInput,
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  return metadataWithImages(
    input.title,
    input.description,
    input.path,
    "website",
    buildOpenGraphImages(PORTAL_SITE_OG_RELATIVE_PATH, input.title),
  );
}

export function buildHomeOpenGraphMetadata(): Pick<
  Metadata,
  "title" | "description" | "openGraph" | "twitter"
> {
  return buildPortalPageOpenGraphMetadata({
    title: "Дизайн-система",
    description:
      "Портал дизайн-системы: компоненты, документация, Storybook и ссылки на источники.",
    path: "/",
  });
}

export function buildComponentsCatalogOpenGraphMetadata(): Pick<
  Metadata,
  "title" | "description" | "openGraph" | "twitter"
> {
  return buildPortalPageOpenGraphMetadata({
    title: "Components",
    description: "Каталог компонентов дизайн-системы для Web.",
    path: PORTAL_COMPONENTS_WEB_PATH,
  });
}

type ComponentOpenGraphInput = Pick<
  Component,
  "slug" | "name" | "description" | "relatedPreviewLight" | "relatedPreviewDark"
>;

/** OG/Twitter metadata для страницы компонента (картинка — Playwright RelatedPreview light). */
export function buildComponentOpenGraphMetadata(
  doc: ComponentOpenGraphInput,
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const slug = String(doc.slug);
  const title = String(doc.name);
  const description = doc.description?.trim() || undefined;
  const pagePath = componentWebPagePath(slug);
  const preview = resolveRelatedComponentPreview(doc);
  const imagePath = preview.lightUrl ?? PORTAL_SITE_OG_RELATIVE_PATH;
  const images = buildOpenGraphImages(imagePath, preview.lightUrl ? preview.alt : title);

  return metadataWithImages(title, description, pagePath, "article", images);
}
