import type { Component } from "@/payload-types";

import { getContentDocumentationBlocks as filterContentDocumentationBlocks } from "@/lib/portal/documentation/live-preview-blocks";

export type TocItem = {
  id: string;
  label: string;
};

export type ComponentDocBlock = NonNullable<Component["documentation"]>[number];

/** Блоки документации без live preview — тот же набор, что рендерит ComponentDocumentation. */
export function getContentDocumentationBlocks(
  blocks: Component["documentation"] | null | undefined,
  options?: { omitPropsTable?: boolean; omitChecklist?: boolean },
): ComponentDocBlock[] {
  return filterContentDocumentationBlocks(blocks, options);
}

export function documentationHasPropsTable(
  blocks: Component["documentation"] | null | undefined,
): boolean {
  return blocks?.some((b) => b.blockType === "propsTable") ?? false;
}

function blockHasTocContent(block: ComponentDocBlock): boolean {
  switch (block.blockType) {
    case "section":
      return Boolean(block.heading?.trim());
    case "doDont":
      return Boolean(
        block.heading?.trim() ||
          block.intro?.trim() ||
          (block.dos?.length ?? 0) > 0 ||
          (block.donts?.length ?? 0) > 0,
      );
    case "propsTable":
      return Boolean(block.title?.trim() || block.subtitle?.trim() || (block.rows?.length ?? 0) > 0);
    case "accessibility":
      return Boolean(block.intro?.trim() || (block.keyboardRows?.length ?? 0) > 0);
    case "designTokens":
      return Boolean(block.title?.trim() || (block.groups?.length ?? 0) > 0);
    case "changelog":
      return (block.entries?.length ?? 0) > 0;
    case "anatomy":
      return Boolean(block.title?.trim() || block.image);
    case "checklist":
      return Boolean(block.title?.trim() || (block.items?.length ?? 0) > 0);
    case "motion":
      return Boolean(block.title?.trim() || block.intro?.trim() || (block.tokens?.length ?? 0) > 0);
    case "relComponents":
      return (block.components?.length ?? 0) > 0;
    case "codeExample":
      return Boolean(block.title?.trim() || block.code?.trim());
    case "resourceLinks":
      return (block.links?.length ?? 0) > 0;
    default:
      return false;
  }
}

const TOC_BLOCK_LABELS: Partial<
  Record<ComponentDocBlock["blockType"], (block: ComponentDocBlock) => string | null>
> = {
  section: (b) => ("heading" in b && b.heading?.trim()) || null,
  propsTable: (b) =>
    ("title" in b && b.title?.trim()) ||
    ("subtitle" in b && b.subtitle?.trim()) ||
    "API Reference",
  doDont: (b) => ("heading" in b && b.heading?.trim()) || "Do / Don't",
  accessibility: () => "Accessibility",
  designTokens: (b) => ("title" in b && b.title?.trim()) || "Design Tokens",
  changelog: () => "Changelog",
  anatomy: (b) => ("title" in b && b.title?.trim()) || "Anatomy",
  checklist: (b) => ("title" in b && b.title?.trim()) || "Design checklist",
  motion: (b) => ("title" in b && b.title?.trim()) || "Motion",
  relComponents: (b) => ("title" in b && b.title?.trim()) || "Related Components",
  codeExample: (b) => ("title" in b && b.title?.trim()) || "Code example",
  resourceLinks: () => "Other source links",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function uniqueId(base: string, seen: Map<string, number>): string {
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

export function getTocFromBlocks(
  blocks: ComponentDocBlock[] | null | undefined,
  seen: Map<string, number> = new Map(),
): {
  items: TocItem[];
  tocIdByIndex: Map<number, string>;
} {
  const items: TocItem[] = [];
  const tocIdByIndex = new Map<number, string>();

  blocks?.forEach((block, index) => {
    if (!blockHasTocContent(block)) return;

    const getLabel = TOC_BLOCK_LABELS[block.blockType];
    if (!getLabel) return;

    const label = getLabel(block);
    if (!label) return;

    const id = uniqueId(slugify(label), seen);
    items.push({ id, label });
    tocIdByIndex.set(index, id);
  });

  return { items, tocIdByIndex };
}

/** Фиксированные пункты TOC + блоки из CMS с гарантией уникальных id. */
export function buildPortalPageToc(
  fixedItems: TocItem[],
  blocks: ComponentDocBlock[] | null | undefined,
): { items: TocItem[]; tocIdByIndex: Map<number, string> } {
  const seen = new Map<string, number>();
  const items = fixedItems.map((item) => ({
    ...item,
    id: uniqueId(item.id, seen),
  }));
  const { items: fromBlocks, tocIdByIndex } = getTocFromBlocks(blocks, seen);
  items.push(...fromBlocks);
  return { items, tocIdByIndex };
}

export function buildComponentPageToc(
  doc: Component,
  options?: {
    hasKitProps?: boolean;
    hasStaticInstall?: boolean;
    hasStaticExamples?: boolean;
    hasDesignChecklist?: boolean;
    omitPropsTable?: boolean;
    omitChecklist?: boolean;
  },
): { items: TocItem[]; tocIdByIndex: Map<number, string> } {
  const contentBlocks = getContentDocumentationBlocks(doc.documentation, {
    omitPropsTable: options?.omitPropsTable,
    omitChecklist: options?.omitChecklist,
  });
  const seen = new Map<string, number>();
  const items: TocItem[] = [{ id: uniqueId("preview", seen), label: "Превью" }];

  const { items: fromBlocks, tocIdByIndex } = getTocFromBlocks(contentBlocks, seen);
  items.push(...fromBlocks);

  if (options?.hasDesignChecklist) {
    items.push({ id: uniqueId("design-checklist", seen), label: "Design checklist" });
  }

  if (options?.hasKitProps) {
    items.push({ id: uniqueId("props-reference", seen), label: "API Reference" });
  }
  if (options?.hasStaticInstall) {
    items.push({ id: uniqueId("installation", seen), label: "Установка" });
  }
  if (options?.hasStaticExamples) {
    items.push({ id: uniqueId("code-examples", seen), label: "Примеры кода" });
  }

  return { items, tocIdByIndex };
}

/** @deprecated Используйте `buildComponentPageToc`. */
export function getComponentPageToc(
  doc: Component,
  options?: {
    hasKitProps?: boolean;
    hasStaticInstall?: boolean;
    hasStaticExamples?: boolean;
  },
): TocItem[] {
  return buildComponentPageToc(doc, options).items;
}
