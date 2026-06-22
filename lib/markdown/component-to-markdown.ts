import type { Component } from "@/payload-types";

import { getComponentDoc } from "@/lib/component-docs";
import { getUiKitPropsForSlug } from "@/lib/ui-kit/props-from-manifest";
import {
  getContentDocumentationBlocks,
  getLivePreviewItems,
} from "@/lib/portal/documentation/live-preview-blocks";

import { documentationToMarkdown } from "./documentation-block-to-markdown";
import {
  mdBulletList,
  mdFence,
  mdGfmTable,
  mdHeading,
  mdJoin,
  mdLink,
  mdParagraph,
} from "./md-utils";
import { resolveSiteBaseUrl } from "./site-base-url";

export function componentDocToMarkdown(doc: Component): string {
  const baseUrl = resolveSiteBaseUrl();
  const staticDoc = getComponentDoc(doc.slug);
  const documentation = doc.documentation ?? [];
  const livePreviewItems = getLivePreviewItems(documentation);
  const contentBlocks = getContentDocumentationBlocks(documentation, { omitPropsTable: true });

  const headerLinks = [
    doc.figmaUrl ? mdLink("Figma", doc.figmaUrl) : null,
    doc.storybookUrl ? mdLink("Storybook", doc.storybookUrl) : null,
    doc.docsUrl ? mdLink("Документация", doc.docsUrl) : null,
  ].filter((line): line is string => line != null);

  const sections: (string | null | undefined)[] = [
    mdHeading(1, doc.name),
    doc.description ? mdParagraph(doc.description) : null,
    headerLinks.length ? mdBulletList(headerLinks) : null,
    `Обновлено: ${new Date(doc.updatedAt).toLocaleString("ru-RU")}`,
  ];

  if (livePreviewItems.length) {
    const previewMd = mdJoin(
      livePreviewItems.flatMap((item) => [
        mdHeading(3, item.title),
        mdLink("Storybook", item.previewStorybookUrl),
        mdFence(item.code),
      ]),
    );
    sections.push(mdJoin([mdHeading(2, "Превью"), previewMd]));
  }

  const cmsDocs = documentationToMarkdown(contentBlocks, baseUrl);
  if (cmsDocs) {
    sections.push(mdJoin([mdHeading(2, "Документация (CMS)"), cmsDocs]));
  }

  const kitProps = getUiKitPropsForSlug(doc.slug);
  if (kitProps.length) {
    sections.push(
      mdJoin([
        mdHeading(2, "API Reference"),
        mdGfmTable(
          ["Имя", "Тип", "По умолч.", "Описание"],
          kitProps.map((row) => [
            row.name,
            row.type,
            row.defaultValue ?? "—",
            row.description ?? "—",
          ]),
        ),
      ]),
    );
  }

  if (staticDoc) {
    const staticSections: (string | null | undefined)[] = [];

    staticSections.push(
        mdHeading(2, "Установка"),
        mdParagraph("Импорт"),
        mdFence(staticDoc.importSnippet, "tsx"),
        mdParagraph("Базовый пример"),
        mdFence(staticDoc.basicSnippet, "tsx"),
        mdHeading(2, "Примеры кода"),
        ...staticDoc.variantSnippets.flatMap((block) => [
          mdParagraph(block.label),
          mdFence(block.code, "tsx"),
        ]),
    );

    sections.push(mdJoin(staticSections));
  }

  return mdJoin(sections);
}
