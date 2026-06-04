"use client";

import { StorybookEmbedPreview } from "@/components/portal/storybook-embed-preview";
import { StorybookOpenLink } from "@/components/portal/storybook-open-link";
import type { DocumentationBlock } from "./documentation";

function isStorybookEmbedBlock(
  block: DocumentationBlock,
): block is DocumentationBlock & {
  blockType: "storybookEmbed";
  storybookUrl: string;
  title?: string | null;
  frameHeight?: number | null;
} {
  return block.blockType === "storybookEmbed";
}

/** Превью только из блоков «Storybook (URL)» во вкладке Документация в Payload. */
export function ComponentLiveDemos({
  slug,
  documentation,
}: {
  slug: string;
  documentation: DocumentationBlock[] | null | undefined;
}) {
  const previews =
    documentation?.filter(isStorybookEmbedBlock).filter((b) => b.storybookUrl?.trim()) ??
    [];

  if (!previews.length) {
    return (
      <p className="text-sm text-zinc-500">
        Нет превью. Добавьте в Payload → «Документация» блоки{" "}
        <strong>Storybook (URL)</strong> со ссылками на stories (
        <code className="font-mono text-xs">?path=/story/…</code>). Запустите{" "}
        <code className="font-mono text-xs">npm run storybook</code> или укажите
        задеплоенный Storybook в{" "}
        <code className="font-mono text-xs">NEXT_PUBLIC_STORYBOOK_URL</code>.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        {previews.map((block, i) => (
          <StorybookEmbedPreview
            key={block.id ?? `preview-${i}`}
            title={block.title ?? "Превью"}
            storybookUrl={block.storybookUrl}
            frameHeight={block.frameHeight}
          />
        ))}
      </div>
      <div className="mt-6">
        <StorybookOpenLink componentSlug={slug} />
      </div>
    </div>
  );
}
