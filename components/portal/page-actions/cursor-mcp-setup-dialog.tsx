"use client";

import { Button, Checkbox, Code, Flex, IconButton, Link, Text, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { CheckIcon, CopyMarkdownIcon } from "@/components/portal/page-actions/page-action-icons";
import { portalClass } from "@/lib/portal/core/classes";
import {
  buildDesignSystemPortalMcpDeeplink,
  openCursorMcpInstallDeeplink,
  payloadMcpApiKeysAdminUrl,
  readStoredMcpApiKey,
  resolvePortalMcpApiKey,
  resolvePayloadMcpEndpointUrl,
  writeStoredMcpApiKey,
} from "@/lib/portal/core/cursor-mcp-install";

type Props = {
  open: boolean;
  componentSlug: string;
  onOpenChange: (open: boolean) => void;
  onInstalled?: () => void;
};

export function CursorMcpSetupDialog({
  open,
  componentSlug,
  onOpenChange,
  onInstalled,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const stored = readStoredMcpApiKey();
      setApiKey(resolvePortalMcpApiKey());
      setRemember(true);
      setError(null);
      setCopied(false);
      dialog.showModal();
      return;
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const install = useCallback(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError("MCP API key не задан.");
      return;
    }

    try {
      if (remember) {
        writeStoredMcpApiKey(trimmed);
      }
      const deeplink = buildDesignSystemPortalMcpDeeplink(trimmed);
      openCursorMcpInstallDeeplink(deeplink);
      onInstalled?.();
      close();
    } catch (installError) {
      setError(
        installError instanceof Error
          ? installError.message
          : "Не удалось открыть установку в Cursor.",
      );
    }
  }, [apiKey, remember, close, onInstalled]);

  const copyApiKey = useCallback(async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Не удалось скопировать ключ в буфер обмена.");
    }
  }, [apiKey]);

  return (
    <dialog
      ref={dialogRef}
      className={portalClass.cursorMcpDialog}
      onClose={close}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <form
        method="dialog"
        className={portalClass.cursorMcpDialogPanel}
        onSubmit={(event) => {
          event.preventDefault();
          install();
        }}
      >
        <Text as="p" size="4" weight="medium" mb="1">
          MCP API key
        </Text>
        <Text as="p" size="2" color="gray" mb="4">
          Ключ для подключения к MCP-серверу портала (
          <Text as="span" weight="medium">
            getComponent
          </Text>
          ,{" "}
          <Text as="span" weight="medium">
            listComponents
          </Text>
          ,{" "}
          <Text as="span" weight="medium">
            listComponentsFull
          </Text>
          ). Скопируйте для Claude, VS Code и других агентов или установите в Cursor.
        </Text>

        <label className={portalClass.cursorMcpDialogLabel}>
          <Text as="span" size="2" weight="medium" mb="1">
            API key
          </Text>
          <Flex gap="2" align="center">
            <TextField.Root
              style={{ flex: 1 }}
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                if (error) setError(null);
              }}
            />
            <IconButton
              type="button"
              variant="soft"
              color="gray"
              aria-label={copied ? "Скопировано" : "Скопировать API key"}
              onClick={() => void copyApiKey()}
            >
              {copied ? <CheckIcon /> : <CopyMarkdownIcon />}
            </IconButton>
          </Flex>
        </label>

        <Text as="p" size="1" color="gray" mt="2" mb="3">
          Свой ключ:{" "}
          <Link href={payloadMcpApiKeysAdminUrl()} target="_blank" rel="noopener noreferrer">
            Payload → MCP → API Keys
          </Link>
          .
        </Text>

        <Text as="p" size="1" color="gray" mb="3">
          Endpoint:{" "}
          <Code size="1" variant="ghost">
            {resolvePayloadMcpEndpointUrl()}
          </Code>
        </Text>

        <Text as="p" size="1" color="gray" mb="3">
          Компонент:{" "}
          <Code size="2" variant="ghost">
            {componentSlug}
          </Code>
        </Text>

        <Flex align="center" gap="2" mb="3">
          <Checkbox
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          <Text as="span" size="2">
            Запомнить ключ в этом браузере
          </Text>
        </Flex>

        {error ? (
          <Text as="p" size="2" color="red" mb="3" role="alert">
            {error}
          </Text>
        ) : null}

        <Flex gap="2" justify="end" mt="2">
          <Button type="button" variant="soft" color="gray" onClick={close}>
            Закрыть
          </Button>
          <Button type="submit">Установить в Cursor</Button>
        </Flex>
      </form>
    </dialog>
  );
}
