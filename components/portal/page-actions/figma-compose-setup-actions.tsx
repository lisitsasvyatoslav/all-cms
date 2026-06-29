"use client";

import { Button, Flex, Link, Text } from "@radix-ui/themes";
import { useCallback, useState } from "react";

import { CursorMcpSetupDialog } from "@/components/portal/page-actions/cursor-mcp-setup-dialog";
import {
  buildDesignSystemPortalMcpDeeplink,
  openCursorMcpInstallDeeplink,
  resolvePortalMcpApiKey,
} from "@/lib/portal/core/cursor-mcp-install";
import {
  buildCursorUserRuleForFigmaCompose,
  buildFigmaComposeCursorBundleText,
  buildFigmaComposeExamplePrompt,
  buildFigmaComposeSetupChecklist,
  FIGMA_COMPOSE_EXAMPLE_URL,
} from "@/lib/portal/core/figma-compose-cursor-bundle";
import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  figmaUrl?: string;
};

export function FigmaComposeSetupActions({ figmaUrl = FIGMA_COMPOSE_EXAMPLE_URL }: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const showHint = useCallback((message: string) => {
    setHint(message);
    window.setTimeout(() => setHint(null), 5000);
  }, []);

  const installPortalMcp = useCallback(() => {
    try {
      const apiKey = resolvePortalMcpApiKey();
      openCursorMcpInstallDeeplink(buildDesignSystemPortalMcpDeeplink(apiKey));
      void navigator.clipboard
        .writeText(buildFigmaComposeExamplePrompt(figmaUrl))
        .catch(() => undefined);
      showHint(
        "Подтвердите установку MCP в Cursor. Пример промпта скопирован в буфер. Включите также Figma MCP в Settings.",
      );
    } catch {
      setDialogOpen(true);
    }
  }, [figmaUrl, showHint]);

  const copyBundle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildFigmaComposeCursorBundleText());
      showHint("Чеклист установки и инструкции скопированы в буфер.");
    } catch {
      showHint("Не удалось скопировать в буфер.");
    }
  }, [showHint]);

  const copyExamplePrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildFigmaComposeExamplePrompt(figmaUrl));
      showHint("Пример промпта скопирован.");
    } catch {
      showHint("Не удалось скопировать промпт.");
    }
  }, [figmaUrl, showHint]);

  const copyUserRule = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildCursorUserRuleForFigmaCompose());
      showHint("User Rule скопировано — вставьте в Cursor Settings → Rules.");
    } catch {
      showHint("Не удалось скопировать правило.");
    }
  }, [showHint]);

  return (
    <Flex direction="column" gap="3" className={portalClass.pageActions}>
      <Text as="p" size="2" color="gray">
        One-click onboarding для промпта «ссылка Figma + собери макет». Нужны{" "}
        <Text as="span" weight="medium">
          design-system-portal
        </Text>{" "}
        и{" "}
        <Text as="span" weight="medium">
          Figma MCP
        </Text>{" "}
        в Cursor.
      </Text>

      <Flex gap="2" wrap="wrap">
        <Button type="button" onClick={installPortalMcp}>
          Add to Cursor
        </Button>
        <Button type="button" variant="soft" onClick={() => void copyExamplePrompt()}>
          Copy example prompt
        </Button>
        <Button type="button" variant="soft" color="gray" onClick={() => void copyBundle()}>
          Copy setup checklist
        </Button>
        <Button type="button" variant="soft" color="gray" onClick={() => void copyUserRule()}>
          Copy User Rule
        </Button>
      </Flex>

      <Text as="p" size="1" color="gray">
        Figma MCP:{" "}
        <Link href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer">
          Cursor Settings → MCP → Figma
        </Link>
        . Skill:{" "}
        <Text as="span" family="code" size="1">
          .cursor/skills/figma-to-radix-compose
        </Text>
      </Text>

      <details>
        <summary>
          <Text as="span" size="2">
            Setup checklist
          </Text>
        </summary>
        <Text as="pre" size="1" style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
          {buildFigmaComposeSetupChecklist()}
        </Text>
      </details>

      {hint ? (
        <Text as="p" size="1" color="gray" role="status">
          {hint}
        </Text>
      ) : null}

      <CursorMcpSetupDialog
        open={dialogOpen}
        componentSlug="figma-compose"
        onOpenChange={setDialogOpen}
        onInstalled={() => {
          void navigator.clipboard
            .writeText(buildFigmaComposeExamplePrompt(figmaUrl))
            .catch(() => undefined);
          showHint("MCP установлен. Пример промпта скопирован.");
        }}
      />
    </Flex>
  );
}
