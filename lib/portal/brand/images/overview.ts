import type { BrandPageSlug } from "@/lib/portal/brand/nav";

/** Превью разделов /brand (из brandbook.finam.ru). */
export const brandOverviewImagePaths: Record<BrandPageSlug, string> = {
  logos: "/brand/overview/logos.webp",
  icons: "/brand/overview/icons.webp",
  typography: "/brand/overview/typography.webp",
  color: "/brand/overview/color.webp",
};

export function brandOverviewImagePath(slug: BrandPageSlug): string {
  return brandOverviewImagePaths[slug];
}
