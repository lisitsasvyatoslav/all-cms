import { Heading, Text } from "@radix-ui/themes";
import type { Metadata } from "next";

import { PortalPageContainer } from "@/components/portal/portal-shell";
import { buildCustomPortalShareMetadata } from "@/lib/portal/resolve-portal-seo-metadata";
import { loadPortalSeo } from "@/lib/portal/load-portal-seo";
import { PORTAL_BRAND_PATH } from "@/lib/portal/portal-base-path";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadPortalSeo();
  return buildCustomPortalShareMetadata(seo, {
    title: "Brand",
    description: "Бренд-гайдлайны: логотипы, иконки, шрифты и палитра.",
    path: PORTAL_BRAND_PATH,
  });
}

export default function BrandPage() {
  return (
    <PortalPageContainer>
      <Heading size="8" weight="bold" mb="2">
        Brand
      </Heading>
      <Text size="3" color="gray" as="p">
        Бренд-гайдлайны: логотипы, иконки, шрифты и палитра.
      </Text>
    </PortalPageContainer>
  );
}
