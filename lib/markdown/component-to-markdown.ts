import type { Component } from "@/payload-types";

import { getComponentDoc } from "@/lib/component-docs";

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

function resolveSiteBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!fromEnv) return "http://127.0.0.1:3000";
  return fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
}

export function componentDocToMarkdown(doc: Component): string {
  const baseUrl = resolveSiteBaseUrl();
  const staticDoc = getComponentDoc(doc.slug);
  const documentation = doc.documentation ?? [];
  const previewBlocks = documentation.filter(
    (b) => b.blockType === "storybookEmbed",
  );
  const contentBlocks = documentation.filter(
    (b) => b.blockType !== "storybookEmbed",
  );

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

  const previewMd = documentationToMarkdown(previewBlocks, baseUrl);
  if (previewMd) {
    sections.push(mdJoin([mdHeading(2, "Превью (Storybook)"), previewMd]));
  }

  const cmsDocs = documentationToMarkdown(contentBlocks, baseUrl);
  if (cmsDocs) {
    sections.push(mdJoin([mdHeading(2, "Документация (CMS)"), cmsDocs]));
  }

  if (staticDoc) {
    sections.push(
      mdJoin([
        mdHeading(2, "Пропсы"),
        mdGfmTable(
          ["Имя", "Тип", "По умолч.", "Описание"],
          staticDoc.props.map((row) => [
            row.name,
            row.type,
            row.default ?? "—",
            row.description,
          ]),
        ),
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
      ]),
    );
  }

  return mdJoin(sections);
}
