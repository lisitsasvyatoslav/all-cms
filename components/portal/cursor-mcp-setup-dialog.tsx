"use client";

import { Button, Checkbox, Code, Flex, Link, Text, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { portalClass } from "@/lib/portal/classes";
import {
  buildDesignSystemPortalMcpDeeplink,
  openCursorMcpInstallDeeplink,
  payloadMcpApiKeysAdminUrl,
  readStoredMcpApiKey,
  resolvePayloadMcpEndpointUrl,
  writeStoredMcpApiKey,
} from "@/lib/portal/cursor-mcp-install";

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const stored = readStoredMcpApiKey();
      setApiKey(stored ?? "");
      setRemember(Boolean(stored));
      setError(null);
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
      setError("Введите MCP API key из админки Payload.");
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
          Add to Cursor
        </Text>
        <Text as="p" size="2" color="gray" mb="4">
          Подключите MCP-сервер Payload, чтобы агент в Cursor мог вызывать{" "}
          <Text as="span" weight="medium">
            getComponent
          </Text>
          ,{" "}
          <Text as="span" weight="medium">
            listComponents
          </Text>{" "}
          и{" "}
          <Text as="span" weight="medium">
            listComponentsFull
          </Text>{" "}
          для компонента{" "}
          <Code size="2" variant="ghost">
            {componentSlug}
          </Code>
          .
        </Text>

        <label className={portalClass.cursorMcpDialogLabel}>
          <Text as="span" size="2" weight="medium" mb="1">
            MCP API key
          </Text>
          <TextField.Root
            type="password"
            autoComplete="off"
            placeholder="MCP-…"
            value={apiKey}
            onChange={(event) => {
              setApiKey(event.target.value);
              if (error) setError(null);
            }}
          />
        </label>

        <Text as="p" size="1" color="gray" mt="2" mb="3">
          Создайте ключ в{" "}
          <Link href={payloadMcpApiKeysAdminUrl()} target="_blank" rel="noopener noreferrer">
            Payload → MCP → API Keys
          </Link>
          . Включите tools{" "}
          <Code size="1" variant="ghost">
            getComponent
          </Code>
          ,{" "}
          <Code size="1" variant="ghost">
            listComponents
          </Code>
          ,{" "}
          <Code size="1" variant="ghost">
            listComponentsFull
          </Code>
          .
        </Text>

        <Text as="p" size="1" color="gray" mb="3">
          Endpoint:{" "}
          <Code size="1" variant="ghost">
            {resolvePayloadMcpEndpointUrl()}
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
            Отмена
          </Button>
          <Button type="submit">Установить в Cursor</Button>
        </Flex>
      </form>
    </dialog>
  );
}
