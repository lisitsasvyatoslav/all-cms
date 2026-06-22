import type { Component } from "@/payload-types";

export type LivePreviewItem = {
  key: string;
  title: string;
  previewStorybookUrl: string;
  previewHeight?: number | null;
  code: string;
  defaultCollapsed?: boolean | null;
};

type Documentation = Component["documentation"];
type DocBlock = NonNullable<Documentation>[number];

type StorybookEmbedBlock = DocBlock & {
  blockType: "storybookEmbed";
  storybookUrl: string;
};

type CodeExampleBlock = DocBlock & {
  blockType: "codeExample";
  code: string;
  previewStorybookUrl?: string | null;
};

function normalizeUrl(url: string | null | undefined): string {
  return url?.trim() ?? "";
}

export function isLivePreviewCodeExample(block: DocBlock): block is CodeExampleBlock {
  return block.blockType === "codeExample" && Boolean(normalizeUrl(block.previewStorybookUrl));
}

function isStorybookEmbedBlock(block: DocBlock): block is StorybookEmbedBlock {
  return block.blockType === "storybookEmbed" && Boolean(normalizeUrl(block.storybookUrl));
}

function findCodeExampleForEmbed(
  documentation: Documentation,
  embed: StorybookEmbedBlock,
): CodeExampleBlock | undefined {
  const embedUrl = normalizeUrl(embed.storybookUrl);
  const embedTitle = embed.title?.trim();

  return documentation?.find((block): block is CodeExampleBlock => {
    if (block.blockType !== "codeExample" || !normalizeUrl(block.previewStorybookUrl)) {
      return false;
    }
    if (normalizeUrl(block.previewStorybookUrl) === embedUrl) return true;
    return Boolean(embedTitle && block.title?.trim() === embedTitle);
  });
}

function placeholderCode(title: string): string {
  return `// Добавьте блок codeExample с previewStorybookUrl для «${title}»`;
}

function toLivePreviewItem(
  key: string,
  options: {
    title: string;
    previewStorybookUrl: string;
    previewHeight?: number | null;
    code: string;
    defaultCollapsed?: boolean | null;
  },
): LivePreviewItem {
  return { key, ...options };
}

/** Пары storybookEmbed + codeExample для секции «Превью» (порядок как в documentation). */
export function getLivePreviewItems(documentation: Documentation): LivePreviewItem[] {
  if (!documentation?.length) return [];

  const items: LivePreviewItem[] = [];
  const usedCodeExamples = new Set<CodeExampleBlock>();

  documentation.forEach((block, index) => {
    const key = block.id ?? `preview-${index}`;

    if (isStorybookEmbedBlock(block)) {
      const paired = findCodeExampleForEmbed(documentation, block);
      if (paired) {
        usedCodeExamples.add(paired);
      }

      items.push(
        toLivePreviewItem(key, {
          title: block.title?.trim() || paired?.title?.trim() || "Превью",
          previewStorybookUrl: block.storybookUrl,
          previewHeight: block.frameHeight ?? paired?.previewHeight,
          code: paired?.code?.trim() || placeholderCode(block.title?.trim() || "Превью"),
          defaultCollapsed: paired?.defaultCollapsed ?? true,
        }),
      );
      return;
    }

    if (isLivePreviewCodeExample(block) && !usedCodeExamples.has(block)) {
      items.push(
        toLivePreviewItem(key, {
          title: block.title?.trim() || "Превью",
          previewStorybookUrl: block.previewStorybookUrl!,
          previewHeight: block.previewHeight,
          code: block.code,
          defaultCollapsed: block.defaultCollapsed,
        }),
      );
    }
  });

  return items;
}

/** Блоки документации без live preview (embed и codeExample с превью). */
export function getContentDocumentationBlocks(
  blocks: Documentation,
  options?: { omitPropsTable?: boolean; omitChecklist?: boolean },
): DocBlock[] {
  return (
    blocks?.filter((block) => {
      if (options?.omitPropsTable && block.blockType === "propsTable") return false;
      if (options?.omitChecklist && block.blockType === "checklist") return false;
      if (block.blockType === "storybookEmbed") return false;
      if (isLivePreviewCodeExample(block)) return false;
      return true;
    }) ?? []
  );
}
