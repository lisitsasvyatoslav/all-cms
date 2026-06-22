import type { BrandPageSlug } from "@/lib/portal/brand/nav";

/** Превью разделов /brand (из brandbook.finam.ru). */
export const brandOverviewImagePaths: Record<BrandPageSlug, string> = {
  logos: "/brand/overview/logos.webp",
  icons: "/brand/overview/icons.webp",
  typography: "/brand/overview/typography.webp",
  color: "/brand/overview/color.webp",
  "visual-style": "/brand/overview/visual-style.webp",
  "social-media": "/brand/overview/social-media.webp",
};

export function brandOverviewImagePath(slug: BrandPageSlug): string {
  return brandOverviewImagePaths[slug];
}
