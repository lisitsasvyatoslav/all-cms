"use client";

import { DropdownMenu, Link, Text } from "@radix-ui/themes";
import { useCallback, useMemo, useState } from "react";

import { CursorMcpSetupDialog } from "@/components/portal/page-actions/cursor-mcp-setup-dialog";
import {
  CheckIcon,
  CopyMarkdownIcon,
} from "@/components/portal/page-actions/page-action-icons";
import { componentWebMarkdownPath } from "@/lib/portal/components/routes";
import { portalClass } from "@/lib/portal/core/classes";
import {
  buildCursorStarterPrompt,
  buildDesignSystemPortalMcpDeeplink,
  openCursorMcpInstallDeeplink,
  resolvePortalMcpApiKey,
} from "@/lib/portal/core/cursor-mcp-install";
import { portalBrandIconPaths } from "@/lib/portal/core/public-icon-paths";

type Props = {
  componentSlug: string;
  pageTitle?: string;
};

type MenuItem = {
  key: string;
  title: string;
  description: string;
  iconSrc: string;
  onSelect?: () => void;
};

function MenuBrandIcon({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand SVG from /public
    <img src={src} alt="" width={16} height={16} decoding="async" draggable={false} />
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`portal-page-actions__chevron${open ? " portal-page-actions__chevron--open" : ""}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PortalPageActions({ componentSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorDialogOpen, setCursorDialogOpen] = useState(false);
  const [cursorHint, setCursorHint] = useState(false);

  const markdownApiUrl = `/api/components/${componentSlug}/markdown`;
  const markdownViewUrl = componentWebMarkdownPath(componentSlug);

  const copyMarkdown = useCallback(async () => {
    if (copying) return;
    setCopying(true);
    try {
      const res = await fetch(markdownApiUrl);
      if (!res.ok) throw new Error(`Failed to fetch markdown: ${res.status}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy markdown:", error);
    } finally {
      setCopying(false);
    }
  }, [copying, markdownApiUrl]);

  const installMcpInCursor = useCallback(() => {
    try {
      const apiKey = resolvePortalMcpApiKey();
      openCursorMcpInstallDeeplink(buildDesignSystemPortalMcpDeeplink(apiKey));
      void navigator.clipboard
        .writeText(buildCursorStarterPrompt(componentSlug))
        .catch(() => undefined);
      setCursorHint(true);
      window.setTimeout(() => setCursorHint(false), 4000);
    } catch (error) {
      console.error("Failed to open Cursor MCP deeplink:", error);
      setCursorDialogOpen(true);
    }
  }, [componentSlug]);

  const addToCursor = useCallback(() => {
    installMcpInCursor();
  }, [installMcpInCursor]);

  const openMcpKeyDialog = useCallback(() => {
    setCursorDialogOpen(true);
  }, []);

  const menuItems = useMemo<MenuItem[]>(() => {
    return [
      {
        key: "markdown",
        title: "View as Markdown",
        description: "View page as Markdown format",
        iconSrc: portalBrandIconPaths.markdown,
        onSelect: () => {
          window.open(markdownViewUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        key: "cursor",
        title: "Add to Cursor",
        description: "Install MCP Server on Cursor",
        iconSrc: portalBrandIconPaths.cursor,
        onSelect: addToCursor,
      },
      {
        key: "mcp-key",
        title: "MCP API key",
        description: "Copy key for other AI agents",
        iconSrc: portalBrandIconPaths.markdown,
        onSelect: openMcpKeyDialog,
      },
      {
        key: "claude",
        title: "Open in Claude",
        description: "Ask questions about this page",
        iconSrc: portalBrandIconPaths.claude,
        onSelect: () => {
          /* placeholder: Claude with page context */
        },
      },
    ];
  }, [addToCursor, markdownViewUrl, openMcpKeyDialog]);

  return (
    <div className={portalClass.pageActions}>
      <div className={portalClass.pageActionsGroup} role="group" aria-label="Page actions">
        <button
          type="button"
          className={portalClass.pageActionsButton}
          onClick={() => void copyMarkdown()}
          disabled={copying}
          aria-live="polite"
        >
          <span className="portal-page-actions__icon" aria-hidden>
            {copied ? <CheckIcon /> : <CopyMarkdownIcon />}
          </span>
          {copied ? "Copied" : "Copy Markdown"}
        </button>

        <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenu.Trigger>
            <button
              type="button"
              className={`${portalClass.pageActionsButton} ${portalClass.pageActionsButtonIcon}`}
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="portal-page-actions__separator" aria-hidden />
              <ChevronDownIcon open={menuOpen} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className={portalClass.pageActionsMenu}
            align="end"
            sideOffset={6}
            size="1"
          >
            {menuItems.map((item) => (
              <DropdownMenu.Item
                key={item.key}
                className={portalClass.pageActionsMenuItem}
                onSelect={() => {
                  item.onSelect?.();
                }}
              >
                <div className="portal-page-actions__menu-item-inner">
                  <span className="portal-page-actions__menu-icon">
                    <MenuBrandIcon src={item.iconSrc} />
                  </span>
                  <span className="portal-page-actions__menu-text">
                    <span className="portal-page-actions__menu-title">{item.title}</span>
                    <span className="portal-page-actions__menu-description">{item.description}</span>
                  </span>
                </div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {cursorHint ? (
        <Text as="p" size="1" color="gray" mt="2" className="portal-page-actions__cursor-hint">
          Откройте Cursor и подтвердите установку MCP. Стартовый промпт скопирован в буфер.{" "}
          <Link
            as="button"
            type="button"
            size="1"
            onClick={openMcpKeyDialog}
          >
            Скопировать API key
          </Link>
        </Text>
      ) : null}

      <CursorMcpSetupDialog
        open={cursorDialogOpen}
        componentSlug={componentSlug}
        onOpenChange={setCursorDialogOpen}
        onInstalled={() => {
          void navigator.clipboard
            .writeText(buildCursorStarterPrompt(componentSlug))
            .catch(() => undefined);
          setCursorHint(true);
          window.setTimeout(() => setCursorHint(false), 4000);
        }}
      />
    </div>
  );
}
