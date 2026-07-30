import type { Preview } from "@storybook/react";
import { Box, Flex, Theme } from "@radix-ui/themes";

import { portalRadixThemeProps } from "../lib/radix/portal-theme-config";
import { isPortalStorybookEmbed } from "../lib/storybook/portal-embed-mode";

import { PortalEmbedShell } from "./portal-embed-shell";

import "@radix-ui/themes/styles.css";
import "../app/globals.css";
import "../app/radix-themes.css";
import "./portal-embed.css";

const preview: Preview = {
  globalTypes: {
    portalAppearance: {
      name: "Portal appearance",
      description: "Radix Theme light/dark — синхронизируется с порталом в embed",
      defaultValue: "light",
      toolbar: {
        title: "Appearance",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#111113" },
        { name: "transparent", value: "transparent" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals.backgrounds?.value;
      const portalAppearanceGlobal = context.globals.portalAppearance;
      const isTransparent = bg === "transparent";
      const isPortalEmbed = isPortalStorybookEmbed();
      const fromPortalGlobal = portalAppearanceGlobal === "dark" ? "dark" : "light";
      const fromBackground =
        bg === "#111113" || bg === "#0a0a0a"
          ? "dark"
          : bg === "#ffffff"
            ? "light"
            : null;
      const appearance =
        isPortalEmbed || isTransparent
          ? fromPortalGlobal
          : (fromBackground ?? fromPortalGlobal);

      return (
        <Theme
          {...portalRadixThemeProps}
          appearance={appearance}
          hasBackground={isPortalEmbed ? false : portalRadixThemeProps.hasBackground}
          className="radix-themes-portal"
          style={{
            ...(isTransparent && !isPortalEmbed ? { background: "transparent" } : null),
            ...(isPortalEmbed
              ? {
                  height: "100%",
                  overflow: "hidden",
                  background: "transparent",
                }
              : null),
          }}
        >
          {isPortalEmbed ? (
            <PortalEmbedShell>
              <Story />
            </PortalEmbedShell>
          ) : (
            <Box p="4" minHeight="4rem">
              <Story />
            </Box>
          )}
        </Theme>
      );
    },
  ],
};

export default preview;
