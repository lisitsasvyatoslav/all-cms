import type { ReactNode } from "react";

import { portalClass } from "@/lib/portal/core/classes";
import { portalIframeHeight } from "@/lib/portal/core/css-vars";

const DEFAULT_MIN_HEIGHT = 350;

type Props = {
  title: string;
  iframeSrc: string | null;
  height?: number;
  /** `standalone` — отдельный блок; `unified` — верх code example без своей обводки. */
  variant?: "standalone" | "unified";
  fallback?: ReactNode;
};

export function PortalStorybookPreviewFrame({
  title,
  iframeSrc,
  height = DEFAULT_MIN_HEIGHT,
  variant = "standalone",
  fallback = null,
}: Props) {
  const frameHeight = Math.min(800, Math.max(DEFAULT_MIN_HEIGHT, height));
  const frameClassName =
    variant === "unified"
      ? `${portalClass.embedPreview} ${portalClass.embedPreviewUnified}`
      : portalClass.embedPreview;

  return (
    <div className={frameClassName} style={portalIframeHeight(frameHeight)}>
      <div className={portalClass.embedPreviewInner}>
        {iframeSrc ? (
          <iframe
            title={title}
            src={iframeSrc}
            className={portalClass.embedPreviewIframe}
            loading="lazy"
            scrolling="no"
          />
        ) : (
          fallback
        )}
      </div>
    </div>
  );
}
