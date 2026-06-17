import type { Metadata } from "next";

import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/component-routes";
import { PORTAL_SITE_OG_RELATIVE_PATH } from "@/lib/portal/portal-default-og";
import {
  RELATED_PREVIEW_HEIGHT,
  RELATED_PREVIEW_WIDTH,
} from "@/lib/portal/related-preview-layout";
import { portalAbsoluteUrl, portalSiteOrigin } from "@/lib/portal/portal-site-url";

import type { NormalizedPortalSeo } from "./portal-seo-defaults";

export type PortalSeoPageKey = "home" | "catalogWeb" | "showcase";

type OpenGraphImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

type PageShareFields = {
  title: string;
  description: string;
  path: string;
  imagePath: string;
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

function resolvePageImage(seo: NormalizedPortalSeo): string {
  return seo.defaultOgImagePath ?? PORTAL_SITE_OG_RELATIVE_PATH;
}

function pageShareFields(seo: NormalizedPortalSeo, page: PortalSeoPageKey): PageShareFields {
  const imagePath = resolvePageImage(seo);

  switch (page) {
    case "home":
      return {
        title: seo.homeShareTitle,
        description: seo.homeShareDescription,
        path: seo.homePath,
        imagePath,
      };
    case "catalogWeb":
      return {
        title: seo.catalogWebShareTitle,
        description: seo.catalogWebShareDescription,
        path: seo.catalogWebPath,
        imagePath,
      };
    case "showcase":
      return {
        title: seo.showcaseShareTitle,
        description: seo.showcaseShareDescription,
        path: seo.showcasePath,
        imagePath,
      };
    default: {
      const _exhaustive: never = page;
      return _exhaustive;
    }
  }
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

export function buildPortalRootOpenGraphMetadata(
  seo: NormalizedPortalSeo,
): Pick<Metadata, "metadataBase" | "openGraph" | "twitter"> {
  return {
    metadataBase: new URL(portalSiteOrigin()),
    openGraph: {
      siteName: seo.siteName,
      locale: seo.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export function buildPortalLayoutMetadata(
  seo: NormalizedPortalSeo,
): Pick<Metadata, "title" | "description" | "metadataBase" | "openGraph" | "twitter"> {
  return {
    title: {
      default: seo.titleDefault,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    ...buildPortalRootOpenGraphMetadata(seo),
  };
}

export function buildPortalSeoPageMetadata(
  seo: NormalizedPortalSeo,
  page: PortalSeoPageKey,
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const share = pageShareFields(seo, page);
  return metadataWithImages(
    share.title,
    share.description,
    share.path,
    "website",
    buildOpenGraphImages(share.imagePath, share.title),
  );
}

/** OG для произвольной страницы с fallback на дефолт сайта (colors и т.д.). */
export function buildCustomPortalShareMetadata(
  seo: NormalizedPortalSeo,
  input: {
    title: string;
    description?: string;
    path: string;
    imagePath?: string | null;
    type?: "website" | "article";
  },
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const imagePath = PORTAL_SITE_OG_RELATIVE_PATH;
  return metadataWithImages(
    input.title,
    input.description,
    input.path,
    input.type ?? "website",
    buildOpenGraphImages(imagePath, input.title),
  );
}

export function buildComponentShareMetadata(
  seo: NormalizedPortalSeo,
  input: {
    title: string;
    description?: string;
    slug: string;
    imagePath: string;
    imageAlt: string;
  },
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const pagePath = `${PORTAL_COMPONENTS_WEB_PATH}/${input.slug}`;
  return metadataWithImages(
    input.title,
    input.description,
    pagePath,
    "article",
    buildOpenGraphImages(input.imagePath, input.imageAlt),
  );
}
