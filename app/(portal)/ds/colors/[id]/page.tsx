import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";

import { PortalBreadcrumbs } from "@/components/portal/layout/portal-breadcrumbs";
import { PortalHeaderDivider, PortalPageContainer } from "@/components/portal/layout/portal-shell";
import { buildColorPageOpenGraphMetadata } from "@/lib/portal/components/open-graph";
import { portalClass } from "@/lib/portal/core/classes";
import { colorPagePath } from "@/lib/portal/components/routes";
import { portalSwatchBg } from "@/lib/portal/core/css-vars";

import { ComponentDocumentation } from "../../components/web/[slug]/documentation";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: "Цвет" };

  const payload = await getPayload({ config });
  const doc = await payload.findByID({
    collection: "colors",
    id: numericId,
    depth: 2,
  });

  if (!doc) return { title: "Цвет" };

  return buildColorPageOpenGraphMetadata({
    title: `${doc.name} · Colors`,
    description: doc.caption ?? doc.tokenKey ?? doc.hex ?? undefined,
    path: colorPagePath(numericId),
  });
}

export default async function ColorDocPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const payload = await getPayload({ config });
  let doc;
  try {
    doc = await payload.findByID({
      collection: "colors",
      id: numericId,
      depth: 2,
    });
  } catch {
    notFound();
  }

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
