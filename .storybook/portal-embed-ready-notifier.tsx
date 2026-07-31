"use client";

import { useEffect } from "react";

export const PORTAL_STORYBOOK_EMBED_READY_MESSAGE = "portal-storybook-embed-ready";

function isStoryCanvasReady(): boolean {
  return document.body.classList.contains("sb-show-main");
}

/**
 * Notifies the portal parent when Storybook has finished preparing the story canvas.
 * Event-driven only — no timeouts; the portal keeps Skeleton until this fires.
 */
export function PortalEmbedReadyNotifier() {
  useEffect(() => {
    let cancelled = false;
    let notified = false;

    const notifyReady = () => {
      if (cancelled || notified) return;
      notified = true;
      window.parent.postMessage({ type: PORTAL_STORYBOOK_EMBED_READY_MESSAGE }, "*");
    };

    if (isStoryCanvasReady()) {
      notifyReady();
      return () => {
        cancelled = true;
      };
    }

    const observer = new MutationObserver(() => {
      if (!isStoryCanvasReady()) return;
      observer.disconnect();
      notifyReady();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return null;
}
