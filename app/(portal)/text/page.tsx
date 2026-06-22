import { Heading, Text } from "@radix-ui/themes";
import type { Metadata } from "next";

import { PortalPageContainer } from "@/components/portal/layout/portal-shell";
import { buildCustomPortalShareMetadata } from "@/lib/portal/seo/resolve-metadata";
import { loadPortalSeo } from "@/lib/portal/seo/load";
import { PORTAL_TEXT_PATH } from "@/lib/portal/core/portal-base-path";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadPortalSeo();
  return buildCustomPortalShareMetadata(seo, {
    title: "Text",
    description: "Text page.",
    path: PORTAL_TEXT_PATH,
  });
}

export default function TextPage() {
  return (
    <PortalPageContainer>
      <Heading size="8" weight="bold" mb="2">
        Text
      </Heading>
      <Text size="3" color="gray" as="p">
        Страница /text на том же уровне, что и /ds.
      </Text>
    </PortalPageContainer>
  );
}
