import { useEffect } from "react";

import {
  isStorybookEmbeddedInParent,
  requestPortalStorybookEmbedCollapse,
  requestPortalStorybookEmbedExpand,
} from "../lib/storybook/portal-embed-messages";

/**
 * Radix overlays expose data-state="open" on content.
 * Dialog/AlertDialog use role; menus/selects use menu/listbox (+ popper wrapper).
 */
const OPEN_OVERLAY_SELECTOR = [
  '[role="dialog"][data-state="open"]',
  '[role="alertdialog"][data-state="open"]',
  '[role="menu"][data-state="open"]',
  '[role="listbox"][data-state="open"]',
  "[data-radix-popper-content-wrapper]",
].join(",");

function countOpenOverlays(): number {
  return document.querySelectorAll(OPEN_OVERLAY_SELECTOR).length;
}

/**
 * When Dialog/Popover/etc. open inside the compact portal iframe, ask the parent
 * to expand; collapse again when all overlays close.
 */
export function PortalEmbedOverlayNotifier() {
  useEffect(() => {
    if (!isStorybookEmbeddedInParent()) return;

    let expanded = false;

    const sync = () => {
      const open = countOpenOverlays() > 0;
      if (open && !expanded) {
        expanded = true;
        requestPortalStorybookEmbedExpand();
      } else if (!open && expanded) {
        expanded = false;
        requestPortalStorybookEmbedCollapse();
      }
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      observer.disconnect();
      if (expanded) requestPortalStorybookEmbedCollapse();
    };
  }, []);

  return null;
}
