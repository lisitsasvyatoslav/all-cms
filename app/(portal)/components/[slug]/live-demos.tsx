"use client";

import { Box, Code, Flex, Strong, Text } from "@radix-ui/themes";

import { PortalDocumentationBlockLabel } from "@/components/portal/portal-documentation-block-label";
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
  showAdminBlockLabels = false,
}: {
  slug: string;
  documentation: DocumentationBlock[] | null | undefined;
  showAdminBlockLabels?: boolean;
}) {
  const previews =
    documentation?.filter(isStorybookEmbedBlock).filter((b) => b.storybookUrl?.trim()) ??
    [];

  if (!previews.length) {
    return (
      <Text size="2" color="gray" as="p">
        Нет превью. Добавьте в Payload → «Документация» блоки{" "}
        <Strong>Storybook (URL)</Strong> со ссылками на stories (
        <Code size="1" variant="ghost">
          ?path=/story/…
        </Code>
        ). Запустите <Code size="1" variant="ghost">npm run storybook</Code> или укажите
        задеплоенный Storybook в{" "}
        <Code size="1" variant="ghost">NEXT_PUBLIC_STORYBOOK_URL</Code>.
      </Text>
    );
  }

  return (
    <Box>
      <Flex direction="column" gap="6">
        {previews.map((block, i) => (
          <Box key={block.id ?? `preview-${i}`}>
            {showAdminBlockLabels ? (
              <PortalDocumentationBlockLabel blockType="storybookEmbed" />
            ) : null}
            <StorybookEmbedPreview
              title={block.title ?? "Превью"}
              storybookUrl={block.storybookUrl}
              frameHeight={block.frameHeight}
            />
          </Box>
        ))}
      </Flex>
      <Box mt="4">
        <StorybookOpenLink componentSlug={slug} />
      </Box>
    </Box>
  );
}
