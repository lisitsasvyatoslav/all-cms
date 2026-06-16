import { Flex } from "@radix-ui/themes";
import { useLayoutEffect, type ReactNode } from "react";

const EMBED_CLASS = "portal-storybook-embed";

export function PortalEmbedShell({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.classList.add(EMBED_CLASS);
    return () => document.documentElement.classList.remove(EMBED_CLASS);
  }, []);

  return (
    <Flex align="center" justify="center" width="100%" height="100%" p="4" className="portal-embed-shell">
      {children}
    </Flex>
  );
}
