import { notFound } from "next/navigation";

import { BrandFoundationPageView } from "@/components/portal/brand/brand-foundation-page";
import { loadBrandPageWithColor } from "@/lib/portal/brand/load-pages";
import { isBrandPageSlug, type BrandPageSlug } from "@/lib/portal/brand/nav";

type Props = {
  slug: string;
};

export async function BrandSlugPageBody({ slug }: Props) {
  if (!isBrandPageSlug(slug)) notFound();

  const result = await loadBrandPageWithColor(slug as BrandPageSlug);
  if (!result) notFound();

  const { page, colorData } = result;
  return <BrandFoundationPageView page={page} colorData={colorData} />;
}
