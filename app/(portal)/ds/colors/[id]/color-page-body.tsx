import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";

import { PortalBreadcrumbs } from "@/components/portal/layout/portal-breadcrumbs";
import { PortalHeaderDivider, PortalPageContainer } from "@/components/portal/layout/portal-shell";
import { portalClass } from "@/lib/portal/core/classes";
import { portalSwatchBg } from "@/lib/portal/core/css-vars";
import { loadColorById } from "@/lib/portal/colors/load-color";

import { ComponentDocumentation } from "../../components/web/[slug]/documentation";

type Props = {
  id: string;
};

export async function ColorPageBody({ id }: Props) {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const doc = await loadColorById(numericId);
  if (!doc) notFound();

  return (
    <PortalPageContainer>
      <PortalBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Colors", href: "/#colors" },
          { label: id, mono: true },
        ]}
      />

      <header>
        <Flex align="start" gap="5">
          <Box
            className={`${portalClass.swatch} ${portalClass.swatch64}`}
            style={portalSwatchBg(doc.hex)}
            title={doc.hex}
          />
          <Box className={portalClass.minW0}>
            <Heading size="8" weight="medium">
              {doc.name}
            </Heading>
            <Text mt="2" className={portalClass.codeFont} color="gray">
              {doc.hex}
              {doc.tokenKey ? ` · ${doc.tokenKey}` : ""}
            </Text>
            {doc.caption ? (
              <Text as="p" size="4" color="gray" mt="3" className={portalClass.lead}>
                {doc.caption}
              </Text>
            ) : null}
          </Box>
        </Flex>
        <PortalHeaderDivider />
      </header>

      <ComponentDocumentation blocks={doc.documentation} />
    </PortalPageContainer>
  );
}
