import type { Component } from "@/payload-types";

export type TocItem = {
  id: string;
  label: string;
};

export type ComponentDocBlock = NonNullable<Component["documentation"]>[number];

/** Блоки документации без embed — тот же набор, что ренерит ComponentDocumentation. */
export function getContentDocumentationBlocks(
  blocks: Component["documentation"] | null | undefined,
): ComponentDocBlock[] {
  return blocks?.filter((b) => b.blockType !== "storybookEmbed") ?? [];
}

function blockHasTocContent(block: ComponentDocBlock): boolean {
  switch (block.blockType) {
    case "section":
      return Boolean(block.heading?.trim());
    case "doDont": {
      const dos = block.dos?.filter(Boolean) ?? [];
      const donts = block.donts?.filter(Boolean) ?? [];
      return dos.length > 0 || donts.length > 0;
    }
    case "propsTable":
      return (block.rows?.filter(Boolean) ?? []).length > 0;
    default:
      return false;
  }
}

const TOC_BLOCK_LABELS: Partial<
  Record<ComponentDocBlock["blockType"], (block: ComponentDocBlock) => string | null>
> = {
  section: (b) => ("heading" in b && b.heading?.trim()) || null,
  propsTable: (b) =>
    ("title" in b && b.title?.trim()) || "Пропсы",
  doDont: () => "Do / Don't",
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

export function getTocFromBlocks(blocks: ComponentDocBlock[] | null | undefined): {
  items: TocItem[];
  tocIdByIndex: Map<number, string>;
} {
  const items: TocItem[] = [];
  const tocIdByIndex = new Map<number, string>();
  const seen = new Map<string, number>();

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

export function getComponentPageToc(
  doc: Component,
  options?: {
    hasStaticProps?: boolean;
    hasStaticInstall?: boolean;
    hasStaticExamples?: boolean;
  },
): TocItem[] {
  const items: TocItem[] = [{ id: "preview", label: "Превью" }];

  const contentBlocks = getContentDocumentationBlocks(doc.documentation);
  const { items: fromBlocks } = getTocFromBlocks(contentBlocks);
  items.push(...fromBlocks);

  if (options?.hasStaticProps) {
    items.push({ id: "props-reference", label: "Пропсы" });
  }
  if (options?.hasStaticInstall) {
    items.push({ id: "installation", label: "Установка" });
  }
  if (options?.hasStaticExamples) {
    items.push({ id: "code-examples", label: "Примеры кода" });
  }

  return items;
}
