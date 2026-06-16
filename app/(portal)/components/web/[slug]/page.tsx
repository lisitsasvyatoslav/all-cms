import { Box, Code, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";

import { ComponentApiFromUiKit } from "@/components/portal/component-api-from-kit";
import { ComponentDesignChecklist } from "@/components/portal/component-design-checklist";
import { PortalBreadcrumbs } from "@/components/portal/portal-breadcrumbs";
import { PortalComponentDeprecatedBanner } from "@/components/portal/portal-component-deprecated-banner";
import { PortalComponentStatusBadge } from "@/components/portal/portal-component-status-badge";
import { PortalCodeBlock } from "@/components/portal/portal-code-block";
import { PortalPageActions } from "@/components/portal/portal-page-actions";
import { PortalSourcePill } from "@/components/portal/portal-source-pill";
import {
  PortalHeaderDivider,
  PortalPageContainer,
  PortalPageWithToc,
  PortalSection,
} from "@/components/portal/portal-shell";
import { TableOfContents } from "@/components/portal/table-of-contents";
import { getComponentDoc } from "@/lib/component-docs";
import { hasUiKitProps } from "@/lib/ui-kit/props-from-manifest";
import { loadMergedDesignChecklist } from "@/lib/portal/design-checklist";
import { portalClass } from "@/lib/portal/classes";
import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/component-routes";
import { loadComponentDocument } from "@/lib/markdown/load-component-document";
import { parseComponentRouteSlug } from "@/lib/markdown/parse-component-route-slug";
import { buildComponentOpenGraphMetadata } from "@/lib/portal/component-open-graph";
import {
  buildComponentPageToc,
} from "@/lib/toc/get-toc";

import { ComponentDocumentation } from "./documentation";
import { ComponentLiveDemos } from "./live-demos";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const parsed = parseComponentRouteSlug(slug);
  if (!parsed) return { title: "Компонент" };

  const doc = await loadComponentDocument(
    parsed.format === "markdown" ? parsed.componentSlug : parsed.slug,
  );
  if (!doc) {
    return { title: "Компонент" };
  }

  if (parsed.format === "markdown") {
    return {
      title: `${doc.name} (Markdown)`,
      description: doc.description ?? undefined,
    };
  }

  return buildComponentOpenGraphMetadata(doc);
}

export default async function ComponentDocPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseComponentRouteSlug(slug);
  if (!parsed) notFound();

  if (parsed.format === "markdown") {
    notFound();
  }

  const componentSlug = parsed.slug;
  const doc = await loadComponentDocument(componentSlug);
  if (!doc) notFound();

  const staticDoc = getComponentDoc(componentSlug);

  const designChecklistItems = await loadMergedDesignChecklist(doc);
  const hasKitProps = hasUiKitProps(componentSlug);
  const { items: tocItems, tocIdByIndex } = buildComponentPageToc(doc, {
    hasKitProps,
    hasStaticInstall: Boolean(staticDoc),
    hasStaticExamples: Boolean(staticDoc?.variantSnippets?.length),
    hasDesignChecklist: designChecklistItems.length > 0,
    omitPropsTable: true,
    omitChecklist: true,
  });
  const showToc = doc.showTOC !== false && tocItems.length > 1;

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
            <PortalSourcePill href={doc.storybookUrl} icon="storybook">
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
          <ComponentDesignChecklist
            items={designChecklistItems}
            tocId="design-checklist"
          />
        </PortalSection>
      ) : null}

      {hasKitProps ? <ComponentApiFromUiKit slug={componentSlug} /> : null}

      {staticDoc ? (
        <>
          <PortalSection>
            <Heading as="h2" size="4" mb="4" id="installation" className={portalClass.scrollTarget}>
              Установка
            </Heading>
            <PortalCodeBlock title="Импорт" code={staticDoc.importSnippet} />
            <Box mt="4">
              <PortalCodeBlock title="Базовый пример" code={staticDoc.basicSnippet} />
            </Box>
          </PortalSection>

          <PortalSection>
            <Heading as="h2" size="4" mb="4" id="code-examples" className={portalClass.scrollTarget}>
              Примеры кода
            </Heading>
            <Flex direction="column" gap="6">
              {staticDoc.variantSnippets.map((block) => (
                <Box key={block.label}>
                  <Text as="p" size="2" weight="medium" mb="2">
                    {block.label}
                  </Text>
                  <PortalCodeBlock code={block.code} />
                </Box>
              ))}
            </Flex>
          </PortalSection>
        </>
      ) : !hasKitProps ? (
        <Text as="p" size="2" color="gray">
          Для компонента «{componentSlug}» нет таблицы пропсов в{" "}
          <Code size="1" variant="soft">
            @next-app/ui-kit
          </Code>
          .
        </Text>
      ) : null}
    </>
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
