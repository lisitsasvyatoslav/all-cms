"use client";

import { useState } from "react";
import { Box, Button, Card, Code, Flex, Separator, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/classes";
import { portalIframeHeight } from "@/lib/portal/css-vars";
import { storybookUrlToIframeSrc } from "@/lib/storybook/storybook-embed-url";

type Props = {
  title?: string | null;
  code: string;
  previewStorybookUrl?: string | null;
  previewHeight?: number | null;
  defaultCollapsed?: boolean | null;
};

export function PortalCollapsibleCodeBlock({
  title,
  code,
  previewStorybookUrl,
  previewHeight,
  defaultCollapsed,
}: Props) {
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));
  const trimmed = code.trim();
  const previewUrl = previewStorybookUrl?.trim();
  const iframeSrc = previewUrl ? storybookUrlToIframeSrc(previewUrl) : null;
  const height = Math.min(600, Math.max(80, previewHeight ?? 200));

  return (
    <Box>
      {title ? (
        <HeadingLike mb="3">{title}</HeadingLike>
      ) : null}
      <Card size="2" variant="surface">
        {iframeSrc ? (
          <>
            <Flex align="center" justify="center" p="4" className="portal-code-preview-area">
              <Box asChild width="100%">
                <iframe
                  title={title ?? "Превью кода"}
                  src={iframeSrc}
                  className={portalClass.embedIframe}
                  style={portalIframeHeight(height)}
                  loading="lazy"
                />
              </Box>
            </Flex>
            <Separator size="4" />
          </>
        ) : null}
        {!collapsed ? (
          <Box p="3" position="relative">
            <Code size="2" variant="ghost" className={portalClass.textPreWrap}>
              {trimmed}
            </Code>
          </Box>
        ) : null}
        <Flex justify="center" py="2" px="3">
          <Button
            type="button"
            size="1"
            variant="soft"
            color="gray"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "Развернуть код" : "Свернуть код"}
          </Button>
        </Flex>
      </Card>
    </Box>
  );
}

function HeadingLike({ children, mb }: { children: React.ReactNode; mb?: "3" }) {
  return (
    <Text as="div" size="4" weight="bold" mb={mb}>
      {children}
    </Text>
  );
}
