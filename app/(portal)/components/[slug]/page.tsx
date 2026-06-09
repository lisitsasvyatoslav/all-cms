import { Box, Card, Code, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";
import type { PortalSource } from "@/payload-types";

import { PortalBreadcrumbs } from "@/components/portal/portal-breadcrumbs";
import { PortalComponentDeprecatedBanner } from "@/components/portal/portal-component-deprecated-banner";
import { PortalComponentStatusBadge } from "@/components/portal/portal-component-status-badge";
import { PortalCodeBlock } from "@/components/portal/portal-code-block";
import { PortalSourcePill } from "@/components/portal/portal-source-pill";
import {
  PortalHeaderDivider,
  PortalPageContainer,
  PortalPageWithToc,
  PortalSection,
} from "@/components/portal/portal-shell";
import { TableOfContents } from "@/components/portal/table-of-contents";
import { getComponentDoc } from "@/lib/component-docs";
import { portalClass } from "@/lib/portal/classes";
import { loadComponentDocument } from "@/lib/markdown/load-component-document";
import { parseComponentRouteSlug } from "@/lib/markdown/parse-component-route-slug";
import {
  buildComponentPageToc,
  documentationHasPropsTable,
  getContentDocumentationBlocks,
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
  const suffix = parsed.format === "markdown" ? " (Markdown)" : "";
  return {
    title: doc ? `${doc.name}${suffix} · Design System` : "Компонент",
    description: doc?.description ?? "",
  };
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

  const payload = await getPayload({ config });
  const staticDoc = getComponentDoc(componentSlug);
  const portalSources = await payload.findGlobal({ slug: "portal-sources" });

  const contentBlocks = getContentDocumentationBlocks(doc.documentation);
  const hasCmsPropsTable = documentationHasPropsTable(doc.documentation);
  const { items: tocItems, tocIdByIndex } = buildComponentPageToc(doc, {
    hasStaticProps: Boolean(staticDoc?.props?.length) && !hasCmsPropsTable,
    hasStaticInstall: Boolean(staticDoc),
    hasStaticExamples: Boolean(staticDoc?.variantSnippets?.length),
  });
  const showToc = doc.showTOC !== false && tocItems.length > 1;

  const main = (
    <>
      <PortalBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Components" },
          { label: componentSlug, mono: true },
        ]}
      />

      <header>
        <Flex align="center" gap="2" wrap="wrap" mb="3" className={portalClass.componentTitle}>
          <Heading size="8" weight="medium">
            {doc.name}
          </Heading>
          <PortalComponentStatusBadge status={doc.status} />
        </Flex>
        {doc.description ? (
          <Text as="p" size="4" color="gray" className={portalClass.lead}>
            {doc.description}
          </Text>
        ) : null}
        <PortalComponentDeprecatedBanner doc={doc} />
        <Box className={portalClass.linkRow} mt="4">
          {doc.figmaUrl ? <PortalSourcePill href={doc.figmaUrl}>Figma</PortalSourcePill> : null}
          {doc.storybookUrl ? (
            <PortalSourcePill href={doc.storybookUrl}>Storybook</PortalSourcePill>
          ) : null}
          {doc.docsUrl ? (
            <PortalSourcePill href={doc.docsUrl}>Документация</PortalSourcePill>
          ) : null}
          <PortalSourcePill href={`/components/${componentSlug}.md`} external={false}>
            Markdown
          </PortalSourcePill>
        </Box>
        <PortalHeaderDivider />
      </header>

      <ComponentMetaRow doc={doc} />
      <PortalLibraryStrip sources={portalSources} />

      <PortalSection>
        <Heading as="h2" size="4" mb="4" id="preview" className={portalClass.scrollTarget}>
          Превью
        </Heading>
        <ComponentLiveDemos slug={componentSlug} documentation={doc.documentation} />
      </PortalSection>

      <ComponentDocumentation blocks={doc.documentation} tocIdByIndex={tocIdByIndex} />

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
      ) : (
        <Text as="p" size="2" color="gray">
          Для компонента «{componentSlug}» пока нет статической таблицы пропсов — добавьте запись в{" "}
          <Code size="1" variant="soft">
            lib/component-docs.ts
          </Code>
          .
        </Text>
      )}
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

function ComponentMetaRow({
  doc,
}: {
  doc: {
    createdAt: string;
    updatedAt: string;
    folder?: unknown;
  };
}) {
  const folder =
    doc.folder &&
    typeof doc.folder === "object" &&
    doc.folder !== null &&
    "name" in doc.folder &&
    typeof (doc.folder as { name: unknown }).name === "string"
      ? (doc.folder as { name: string }).name
      : null;

  return (
    <Flex wrap="wrap" gap="4" mb="4" pb="4" className={portalClass.borderBottom}>
      <Text size="2" color="gray">
        Создано в CMS{" "}
        <Text as="span" size="2" weight="medium" highContrast>
          {new Date(doc.createdAt).toLocaleString("ru-RU")}
        </Text>
      </Text>
      <Text size="2" color="gray">
        Обновлено{" "}
        <Text as="span" size="2" weight="medium" highContrast>
          {new Date(doc.updatedAt).toLocaleString("ru-RU")}
        </Text>
      </Text>
      {folder ? (
        <Text size="2" color="gray">
          Папка{" "}
          <Text as="span" size="2" weight="medium" highContrast>
            {folder}
          </Text>
        </Text>
      ) : null}
    </Flex>
  );
}

function PortalLibraryStrip({ sources }: { sources: PortalSource }) {
  const links: { href: string; label: string }[] = [];
  if (sources.figmaLibraryUrl) links.push({ label: "Figma library", href: sources.figmaLibraryUrl });
  if (sources.storybookUrl) links.push({ label: "Storybook (глобально)", href: sources.storybookUrl });
  if (sources.documentationUrl) links.push({ label: "Документация", href: sources.documentationUrl });
  if (sources.repositoryUrl) links.push({ label: "Репозиторий", href: sources.repositoryUrl });
  if (!links.length) return null;

  return (
    <Card
      size="2"
      variant="surface"
      mb="4"
      className={`${portalClass.cardDashed} ${portalClass.cardPadded}`}
    >
      <Heading as="h2" size="1" mb="2" color="gray">
        Общие ссылки портала (глобальные)
      </Heading>
      <Text as="p" size="1" color="gray" mb="3">
        Из глобала «Ссылки на источники» в Payload — одни и те же URL для всего портала.
      </Text>
      <Box className={portalClass.linkRow}>
        {links.map((l) => (
          <PortalSourcePill key={l.href} href={l.href}>
            {l.label}
          </PortalSourcePill>
        ))}
      </Box>
    </Card>
  );
}
