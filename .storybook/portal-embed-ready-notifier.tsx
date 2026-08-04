import { useEffect } from "react";

import {
  isStorybookEmbeddedInParent,
  notifyPortalStorybookEmbedReady,
  PORTAL_STORYBOOK_EMBED_READY_MESSAGE,
} from "../lib/storybook/portal-embed-messages";

export { PORTAL_STORYBOOK_EMBED_READY_MESSAGE };

type PortalEmbedReadyNotifierProps = {
  /** Re-notify when SPA navigation changes story without remounting the iframe. */
  storyId?: string;
};

/** Double rAF ≈ after layout + paint of the mounted story (not iframe.html load). */
function afterPaint(callback: () => void): () => void {
  let raf2 = 0;
  const raf1 = window.requestAnimationFrame(() => {
    raf2 = window.requestAnimationFrame(callback);
  });
  return () => {
    window.cancelAnimationFrame(raf1);
    if (raf2) window.cancelAnimationFrame(raf2);
  };
}

/**
 * Notifies the portal parent when the story canvas has painted.
 * Event-driven only — no timeouts; the portal keeps Skeleton until this fires.
 */
export function PortalEmbedReadyNotifier({ storyId }: PortalEmbedReadyNotifierProps) {
  useEffect(() => {
    if (!isStorybookEmbeddedInParent()) return;

    let cancelled = false;
    const cancelPaint = afterPaint(() => {
      if (cancelled) return;
      notifyPortalStorybookEmbedReady();
    });

    return () => {
      cancelled = true;
      cancelPaint();
    };
  }, [storyId]);

  return null;
}
