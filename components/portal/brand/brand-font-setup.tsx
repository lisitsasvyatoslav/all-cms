"use client";

import { useCallback, useState } from "react";
import { Box, Button, Flex, Text } from "@radix-ui/themes";

import { CheckIcon, CopyMarkdownIcon } from "@/components/portal/page-actions/page-action-icons";
import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  desktopLabel: string;
  downloadHref: string;
  downloadLabel: string;
  cssLabel: string;
  cssCode: string;
};

export function BrandFontSetup({
  desktopLabel,
  downloadHref,
  downloadLabel,
  cssLabel,
  cssCode,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssCode.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [cssCode]);

  return (
    <Flex direction="column" gap="5">
      <Box>
        <Text size="3" weight="medium" as="p" mb="2">
          {desktopLabel}
        </Text>
        <Button asChild variant="soft" size="2">
          <a href={downloadHref} target="_blank" rel="noopener noreferrer">
            {downloadLabel}
          </a>
        </Button>
      </Box>

      <Box>
        <Flex align="center" justify="between" gap="3" mb="2">
          <Text size="3" weight="medium" as="p">
            {cssLabel}
          </Text>
          <button
            type="button"
            className={portalClass.brandFontSetupCopy}
            onClick={copyCode}
            aria-label="Скопировать CSS"
          >
            {copied ? <CheckIcon /> : <CopyMarkdownIcon />}
          </button>
        </Flex>
        <Box className={portalClass.brandFontSetupCode}>
          <pre>
            <code>{cssCode.trim()}</code>
          </pre>
        </Box>
      </Box>
    </Flex>
  );
}
