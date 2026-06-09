import { Box, Callout, Card, Code, Flex, Link, Separator, Strong, Text } from "@radix-ui/themes";

import { PortalCalloutContent } from "@/components/portal/portal-callout-content";
import { portalClass } from "@/lib/portal/classes";
import { portalIframeHeight } from "@/lib/portal/css-vars";
import { storybookUrlToIframeSrc } from "@/lib/storybook/storybook-embed-url";

type Props = {
  title: string;
  storybookUrl: string;
  frameHeight?: number | null;
};

export function StorybookEmbedPreview({ title, storybookUrl, frameHeight }: Props) {
  const iframeSrc = storybookUrlToIframeSrc(storybookUrl);
  const height = Math.min(800, Math.max(120, frameHeight ?? 280));

  return (
    <Card size="2" variant="surface">
      <Flex align="center" justify="between" gap="2" wrap="wrap" px="4" py="2">
        <Text size="1" weight="medium" color="gray" className={portalClass.embedTitle}>
          {title}
        </Text>
        <Link href={storybookUrl} target="_blank" rel="noopener noreferrer" size="1" weight="medium">
          Открыть в Storybook ↗
        </Link>
      </Flex>
      <Separator size="4" />

      {iframeSrc ? (
        <Box asChild>
          <iframe
            title={title}
            src={iframeSrc}
            className={portalClass.embedIframe}
            style={portalIframeHeight(height)}
            loading="lazy"
          />
        </Box>
      ) : (
        <Box p="4">
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
      )}
    </Card>
  );
}
