import { Box, Code, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";

import { ComponentApiFromUiKit } from "@/components/portal/catalog/component-api-from-kit";
import { ComponentDesignChecklist } from "@/components/portal/catalog/component-design-checklist";
import { PortalBreadcrumbs } from "@/components/portal/layout/portal-breadcrumbs";
import { PortalComponentDeprecatedBanner } from "@/components/portal/catalog/portal-component-deprecated-banner";
import { PortalComponentStatusBadge } from "@/components/portal/catalog/portal-component-status-badge";
import { PortalPageActions } from "@/components/portal/page-actions/portal-page-actions";
import { PortalSourcePill } from "@/components/portal/sources/portal-source-pill";import {
  PortalHeaderDivider,
  PortalPageContainer,
  PortalPageWithToc,
  PortalSection,
} from "@/components/portal/layout/portal-shell";
import { TableOfContents } from "@/components/portal/layout/table-of-contents";
import { hasUiKitProps } from "@/lib/ui-kit/props-from-manifest";import { loadComponentPageDocument } from "@/lib/markdown/load-component-document";
import { loadMergedDesignChecklist } from "@/lib/portal/documentation/design-checklist";
import { portalClass } from "@/lib/portal/core/classes";
import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/components/routes";
import { rewriteStorybookDocumentUrl } from "@/lib/storybook/rewrite-storybook-url";
import { buildComponentPageToc } from "@/lib/toc/get-toc";

import { ComponentDocumentation } from "./documentation";
import { ComponentLiveDemos } from "./live-demos";

type Props = {
  componentSlug: string;
};

export async function ComponentPageBody({ componentSlug }: Props) {
  const doc = await loadComponentPageDocument(componentSlug);
  if (!doc) notFound();

  const designChecklistItems = await loadMergedDesignChecklist(doc);
  const hasKitProps = hasUiKitProps(componentSlug);
  const { items: tocItems, tocIdByIndex } = buildComponentPageToc(doc, {
    hasKitProps,
    hasDesignChecklist: designChecklistItems.length > 0,
    omitPropsTable: true,
    omitChecklist: true,
  });  const showToc = doc.showTOC !== false && tocItems.length > 1;

  const main = (
    <>
      <PortalBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Components", href: PORTAL_COMPONENTS_WEB_PATH },
          { label: doc.name },
        ]}
      />

      <header>
        <Box className={portalClass.pageHeaderRow}>
          <Flex align="center" gap="2" wrap="wrap" className={portalClass.componentTitle}>
            <Heading size="8" weight="medium">
              {doc.name}
            </Heading>
            <PortalComponentStatusBadge status={doc.status} />
          </Flex>
          <PortalPageActions componentSlug={componentSlug} />
        </Box>
        {doc.description ? (
          <Text as="p" size="4" color="gray" className={portalClass.lead}>
            {doc.description}
          </Text>
        ) : null}
        <PortalComponentDeprecatedBanner doc={doc} />
        <Box className={portalClass.linkRow} mt="4">
          {doc.figmaUrl ? (
            <PortalSourcePill href={doc.figmaUrl} icon="figma">
              Figma
            </PortalSourcePill>
          ) : null}
          {doc.storybookUrl ? (
            <PortalSourcePill
              href={rewriteStorybookDocumentUrl(doc.storybookUrl)}
              icon="storybook"
            >
              Storybook
            </PortalSourcePill>
          ) : null}
          {doc.docsUrl ? (
            <PortalSourcePill href={doc.docsUrl} icon="docs">
              Документация
            </PortalSourcePill>
          ) : null}
        </Box>
        <PortalHeaderDivider />
      </header>

      <PortalSection>
        <Heading as="h2" size="4" mb="4" id="preview" className={portalClass.scrollTarget}>
          Превью
        </Heading>
        <ComponentLiveDemos slug={componentSlug} documentation={doc.documentation} />
      </PortalSection>

      <ComponentDocumentation
        blocks={doc.documentation}
        tocIdByIndex={tocIdByIndex}
        omitPropsTable
        omitChecklist
      />

      {designChecklistItems.length > 0 ? (
        <PortalSection>
          <ComponentDesignChecklist items={designChecklistItems} tocId="design-checklist" />
        </PortalSection>
      ) : null}

      {hasKitProps ? <ComponentApiFromUiKit slug={componentSlug} /> : (
        <Text as="p" size="2" color="gray">
          Для компонента «{componentSlug}» нет таблицы пропсов в{" "}
          <Code size="1" variant="soft">
            @next-app/ui-kit
          </Code>
          .
        </Text>
      )}    </>
  );

  return (
    <PortalPageContainer wide={showToc}>
      {showToc ? (
        <PortalPageWithToc main={main} toc={<TableOfContents items={tocItems} />} />
      ) : (
        main
      )}
    </PortalPageContainer>
  );
}
