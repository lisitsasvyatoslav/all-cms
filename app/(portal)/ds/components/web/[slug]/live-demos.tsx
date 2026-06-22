"use client";

import { Box, Code, Flex, Strong, Text } from "@radix-ui/themes";

import { PortalCollapsibleCodeBlock } from "@/components/portal/documentation/portal-collapsible-code-block";
import { PortalDocumentationBlockLabel } from "@/components/portal/documentation/portal-documentation-block-label";
import { StorybookOpenLink } from "@/components/portal/storybook/storybook-open-link";
import { portalClass } from "@/lib/portal/core/classes";
import { getLivePreviewItems } from "@/lib/portal/documentation/live-preview-blocks";

import type { DocumentationBlock } from "./documentation";

/** Live preview + code example (как Hero UI) из documentation. */
export function ComponentLiveDemos({
  slug,
  documentation,
  showAdminBlockLabels = false,
}: {
  slug: string;
  documentation: DocumentationBlock[] | null | undefined;
  showAdminBlockLabels?: boolean;
}) {
  const previews = getLivePreviewItems(documentation);

  if (!previews.length) {
    return (
      <Text size="2" color="gray" as="p">
        Нет превью. Добавьте в Payload → «Документация» блоки{" "}
        <Strong>Code examples</Strong> с URL Storybook в поле превью или пару{" "}
        <Strong>Storybook (URL)</Strong> + <Strong>Code examples</Strong> (
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
    <Box className={portalClass.embedRoot}>
      <Flex direction="column" gap="8">
        {previews.map((item) => (
          <Box key={item.key}>
            {showAdminBlockLabels ? (
              <PortalDocumentationBlockLabel blockType="codeExample" />
            ) : null}
            <PortalCollapsibleCodeBlock
              title={item.title}
              code={item.code}
              previewStorybookUrl={item.previewStorybookUrl}
              previewHeight={item.previewHeight}
              defaultCollapsed={item.defaultCollapsed}
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
