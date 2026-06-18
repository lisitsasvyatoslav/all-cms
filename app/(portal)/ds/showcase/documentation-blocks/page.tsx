import { Box, Heading, Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import { getPayload } from "payload";

import config from "@payload-config";
import { PortalBreadcrumbs } from "@/components/portal/portal-breadcrumbs";
import { PortalSourcePill } from "@/components/portal/portal-source-pill";
import {
  PortalHeaderDivider,
  PortalPageContainer,
  PortalPageWithToc,
  PortalSection,
} from "@/components/portal/portal-shell";
import { TableOfContents } from "@/components/portal/table-of-contents";
import { buildShowcaseOpenGraphMetadata } from "@/lib/portal/component-open-graph";
import { componentWebPagePath } from "@/lib/portal/component-routes";
import { portalClass } from "@/lib/portal/classes";
import { buildDocumentationBlocksShowcase } from "@/lib/portal/documentation-blocks-showcase";
import { buildPortalPageToc, getContentDocumentationBlocks } from "@/lib/toc/get-toc";

import { ComponentDocumentation } from "../../components/web/[slug]/documentation";
import { ComponentLiveDemos } from "../../components/web/[slug]/live-demos";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildShowcaseOpenGraphMetadata();
}

export default async function DocumentationBlocksShowcasePage() {
  const payload = await getPayload({ config });

  const [{ docs: components }, { docs: media }] = await Promise.all([
    payload.find({ collection: "components", limit: 3, depth: 0, overrideAccess: true }),
    payload.find({ collection: "media", limit: 1, depth: 0, overrideAccess: true }),
  ]);

  const documentation = buildDocumentationBlocksShowcase({
    mediaId: media[0] ? Number(media[0].id) : null,
    relatedComponentIds: components.map((c) => Number(c.id)).slice(0, 3),
  });

  const contentBlocks = getContentDocumentationBlocks(documentation);
  const { tocIdByIndex, items: tocItems } = buildPortalPageToc(
    [
      { id: "preview", label: "Превью" },
      { id: "cms-docs-heading", label: "Документация" },
    ],
    contentBlocks,
  );

  const main = (
    <>
      <PortalBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Справочник" },
          { label: "Блоки документации" },
        ]}
      />

      <header>
        <Text size="2" color="gray" weight="medium">
          Справочник портала
        </Text>
        <Heading size="8" weight="medium" mt="2" mb="3">
          Блоки документации
        </Heading>
        <Text as="p" size="4" color="gray" className={portalClass.lead}>
          Все 13 типов блоков из вкладки «Документация» коллекции{" "}
          <Text as="span" weight="bold">
            components
          </Text>{" "}
          — отрендерены так же, как на странице реального компонента. Данные здесь статические;
          в CMS вы собираете страницу из тех же блоков в произвольном порядке.
        </Text>
        <Box className={portalClass.linkRow} mt="4">
          <PortalSourcePill href="/admin/collections/components" external={false}>
            Payload → Components
          </PortalSourcePill>
          <Link asChild size="2">
            <NextLink href={componentWebPagePath("button")}>Пример: Button →</NextLink>
          </Link>
        </Box>
        <PortalHeaderDivider />
      </header>

      <PortalSection>
        <Heading as="h2" size="4" mb="4" id="preview" className={portalClass.scrollTarget}>
          Превью
        </Heading>
        <Text as="p" size="2" color="gray" mb="4">
          Блок Storybook показывается в этой секции (не в теле документации ниже).
        </Text>
        <ComponentLiveDemos
          slug="button"
          documentation={documentation}
          showAdminBlockLabels
        />
      </PortalSection>

      <ComponentDocumentation
        blocks={documentation}
        tocIdByIndex={tocIdByIndex}
        showAdminBlockLabels
      />
    </>
  );

  return (
    <PortalPageContainer wide>
      <PortalPageWithToc main={main} toc={<TableOfContents items={tocItems} />} />
    </PortalPageContainer>
  );
}
