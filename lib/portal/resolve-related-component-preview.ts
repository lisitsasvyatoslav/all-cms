import fs from "node:fs";
import path from "node:path";

import { mediaPublicUrl } from "@/components/portal/documentation-blocks/shared";
import type { Component, Media } from "@/payload-types";

export type RelatedComponentPreview = {
  lightUrl: string | null;
  darkUrl: string | null;
  alt: string;
  hasStaticPreview: boolean;
};

function publicPreviewFilePath(slug: string, theme: "light" | "dark"): string {
  return path.join(process.cwd(), "public", "related-previews", `${slug}-${theme}.webp`);
}

function publicPreviewUrlIfExists(slug: string, theme: "light" | "dark"): string | null {
  if (fs.existsSync(publicPreviewFilePath(slug, theme))) {
    return `/related-previews/${slug}-${theme}.webp`;
  }
  return null;
}

function staticPreviewUrl(slug: string | null, theme: "light" | "dark"): string | null {
  return slug ? publicPreviewUrlIfExists(slug, theme) : null;
}

function mediaUrl(field: number | Media | null | undefined): string | null {
  if (field == null) return null;
  return mediaPublicUrl(field);
}

/** Превью: public/related-previews (git) → CMS Media → null. Статика первая — на Vercel нет /media. */
export function resolveRelatedComponentPreview(
  rel: Pick<Component, "slug" | "name" | "relatedPreviewLight" | "relatedPreviewDark">,
): RelatedComponentPreview {
  const slug = typeof rel.slug === "string" ? rel.slug : null;
  const alt = typeof rel.name === "string" ? rel.name : slug ?? "Component preview";

  const lightUrl =
    staticPreviewUrl(slug, "light") ?? mediaUrl(rel.relatedPreviewLight);
  const darkUrl =
    staticPreviewUrl(slug, "dark") ?? mediaUrl(rel.relatedPreviewDark);

  return {
    lightUrl,
    darkUrl,
    alt,
    hasStaticPreview: Boolean(lightUrl || darkUrl),
  };
}
