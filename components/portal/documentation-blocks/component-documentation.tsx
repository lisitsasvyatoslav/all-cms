import { Box, Flex, Heading, Section, Text } from "@radix-ui/themes";

import { PortalDocumentationBlockLabel } from "@/components/portal/portal-documentation-block-label";
import { PortalHeaderDivider } from "@/components/portal/portal-shell";
import type { Color, Component } from "@/payload-types";
import { portalClass } from "@/lib/portal/classes";

import { DocumentationBlockRenderer } from "./documentation-block";

export function ComponentDocumentation({
  blocks,
  tocIdByIndex,
  showAdminBlockLabels = false,
}: {
  blocks:
    | NonNullable<Component["documentation"]>
    | NonNullable<Color["documentation"]>
    | null
    | undefined;
  tocIdByIndex?: Map<number, string>;
  showAdminBlockLabels?: boolean;
}) {
  const contentBlocks = blocks?.filter((b) => b.blockType !== "storybookEmbed") ?? [];
  if (!contentBlocks.length) return null;

  return (
    <Box mb="8" aria-labelledby="cms-docs-heading" className={portalClass.scrollTarget}>
      <Section size="1">
        <Text size="1" weight="medium" color="gray" className={portalClass.labelCaps}>
          Документация
        </Text>
        <Heading as="h2" size="6" mt="2" id="cms-docs-heading">
          Из контентной модели
        </Heading>
        <Text as="p" size="2" color="gray" mt="2" className={portalClass.prose}>
          Ниже — то же содержимое, что вы настраиваете во вкладке «Документация» в Payload: здесь оно
          оформлено для чтения. В админке специально формы, а не макет страницы.
        </Text>
        <PortalHeaderDivider />
      </Section>

      <Flex direction="column" gap="8">
        {contentBlocks.map((block, i) => (
          <Box key={block.id ?? `doc-${i}`}>
            {showAdminBlockLabels ? (
              <PortalDocumentationBlockLabel blockType={block.blockType} />
            ) : null}
            <DocumentationBlockRenderer block={block} tocId={tocIdByIndex?.get(i)} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
