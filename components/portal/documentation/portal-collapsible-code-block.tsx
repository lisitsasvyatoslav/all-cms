"use client";

import { useCallback, useState } from "react";
import { Box, Text } from "@radix-ui/themes";

import { CheckIcon, CopyMarkdownIcon } from "@/components/portal/page-actions/page-action-icons";
import { PortalStorybookPreviewFrame } from "@/components/portal/storybook/portal-storybook-preview-frame";
import { usePortalTheme } from "@/components/providers/portal-theme-provider";
import { highlightCodeLine } from "@/lib/portal/documentation/highlight-code-line";
import { portalClass } from "@/lib/portal/core/classes";
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
  const { appearance } = usePortalTheme();
  const [collapsed, setCollapsed] = useState(defaultCollapsed !== false);
  const [copied, setCopied] = useState(false);
  const trimmed = code.trim();
  const lines = trimmed.split("\n");
  const previewUrl = previewStorybookUrl?.trim();
  const iframeSrc = previewUrl
    ? storybookUrlToIframeSrc(previewUrl, { portalEmbed: true, appearance })
    : null;
  const height = previewHeight ?? 350;

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [trimmed]);

  return (
    <Box className={portalClass.embedRoot}>
      {title ? (
        <Text as="div" size="4" weight="bold" mb="3">
          {title}
        </Text>
      ) : null}

      <div className={portalClass.codeExample}>
        {iframeSrc ? (
          <PortalStorybookPreviewFrame
            key={iframeSrc}
            title={title ?? "Превью кода"}
            iframeSrc={iframeSrc}
            height={height}
            variant="unified"
          />
        ) : null}

        <div className={portalClass.codeExampleCode}>
          <button
            type="button"
            className={portalClass.codeExampleCopy}
            onClick={() => void copyCode()}
            aria-label={copied ? "Скопировано" : "Скопировать код"}
          >
            {copied ? <CheckIcon /> : <CopyMarkdownIcon />}
          </button>

          <div className={portalClass.codeExamplePreWrap}>
            <pre
              className={
                collapsed
                  ? `${portalClass.codeExamplePre} ${portalClass.codeExamplePreCollapsed}`
                  : portalClass.codeExamplePre
              }
            >
              <code className={portalClass.codeExamplePreInner}>
                {lines.map((line, index) => (
                  <div key={index} className={portalClass.codeExampleLine}>
                    <span className={portalClass.codeExampleLineNo} aria-hidden>
                      {index + 1}
                    </span>
                    <span className={portalClass.codeExampleLineContent}>
                      {highlightCodeLine(line)}
                    </span>
                  </div>
                ))}
              </code>
            </pre>

            {collapsed ? <div className={portalClass.codeExampleFade} aria-hidden /> : null}
          </div>
        </div>

        <div className={portalClass.codeExampleFooter}>
          <button
            type="button"
            className={portalClass.codeExampleToggle}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? "Развернуть код" : "Свернуть код"}
          </button>
        </div>
      </div>
    </Box>
  );
}
