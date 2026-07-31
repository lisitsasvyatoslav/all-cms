import { Flex } from "@radix-ui/themes";
import { useLayoutEffect, type ReactNode } from "react";

import type { PortalAppearance } from "../lib/radix/portal-appearance";

const EMBED_CLASS = "portal-storybook-embed";

type PortalEmbedShellProps = {
  appearance: PortalAppearance;
  children: ReactNode;
};

export function PortalEmbedShell({ appearance, children }: PortalEmbedShellProps) {
  useLayoutEffect(() => {
    document.documentElement.classList.add(EMBED_CLASS);
    document.documentElement.dataset.portalAppearance = appearance;

    return () => {
      document.documentElement.classList.remove(EMBED_CLASS);
      delete document.documentElement.dataset.portalAppearance;
    };
  }, [appearance]);

  return (
    <Flex align="center" justify="center" width="100%" height="100%" className="portal-embed-shell">
      {children}
    </Flex>
  );
}
