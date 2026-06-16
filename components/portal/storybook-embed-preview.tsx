import { Box, Callout, Code, Flex, Link, Strong, Text } from "@radix-ui/themes";

import { PortalCalloutContent } from "@/components/portal/portal-callout-content";
import { PortalStorybookPreviewFrame } from "@/components/portal/portal-storybook-preview-frame";
import { portalClass } from "@/lib/portal/classes";
import { storybookUrlToIframeSrc } from "@/lib/storybook/storybook-embed-url";

type Props = {
  title: string;
  storybookUrl: string;
  frameHeight?: number | null;
};

export function StorybookEmbedPreview({ title, storybookUrl, frameHeight }: Props) {
  const iframeSrc = storybookUrlToIframeSrc(storybookUrl, { portalEmbed: true });
  const height = frameHeight ?? undefined;

  return (
    <Box className={portalClass.embedRoot}>
      <Flex
        align="center"
        justify="between"
        gap="2"
        wrap="wrap"
        mb="3"
        className={portalClass.embedHeader}
      >
        <Text size="2" weight="medium" className={portalClass.embedTitle}>
          {title}
        </Text>
        <Link href={storybookUrl} target="_blank" rel="noopener noreferrer" size="2" weight="medium">
          Открыть в Storybook ↗
        </Link>
      </Flex>

      <PortalStorybookPreviewFrame
        title={title}
        iframeSrc={iframeSrc}
        height={height ?? undefined}
        variant="standalone"
        fallback={
          <Box p="4" width="100%">
            <Callout.Root color="amber" role="status">
              <PortalCalloutContent>
                <Text weight="medium" as="div" mb="1">
                  Не удалось встроить Storybook
                </Text>
                <Text size="1" as="div">
                  Нужна ссылка на <Strong>story</Strong>, не docs, с хоста из{" "}
                  <Code size="1" variant="soft">
                    NEXT_PUBLIC_STORYBOOK_URL
                  </Code>
                  . Пример:{" "}
                  <Code size="1" variant="soft" className={portalClass.breakAll}>
                    ?path=/story/design-system-button--default&amp;args=variant:secondary
                  </Code>
                </Text>
              </PortalCalloutContent>
            </Callout.Root>
          </Box>
        }
      />
    </Box>
  );
}
