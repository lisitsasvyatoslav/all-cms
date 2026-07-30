import { Flex } from "@radix-ui/themes";
import { useLayoutEffect, type ReactNode } from "react";

const EMBED_CLASS = "portal-storybook-embed";

function readPortalAppearanceFromUrl(): "light" | "dark" {
  const globals = new URLSearchParams(window.location.search).get("globals") ?? "";
  return globals.includes("portalAppearance:dark") ? "dark" : "light";
}

export function PortalEmbedShell({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.classList.add(EMBED_CLASS);
    document.documentElement.dataset.portalAppearance = readPortalAppearanceFromUrl();

    return () => {
      document.documentElement.classList.remove(EMBED_CLASS);
      delete document.documentElement.dataset.portalAppearance;
    };
  }, []);

  return (
    <Flex align="center" justify="center" width="100%" height="100%" className="portal-embed-shell">
      {children}
    </Flex>
  );
}
