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
        { name: "dark", value: "#0a0a0a" },
        { name: "transparent", value: "transparent" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals.backgrounds?.value;
      const isDark = bg === "#0a0a0a";
      const isTransparent = bg === "transparent";
      const isPortalEmbed = isPortalStorybookEmbed();

      return (
        <Theme
          {...portalRadixThemeProps}
          appearance={isDark ? "dark" : "light"}
          className="radix-themes-portal"
          style={{
            ...(isTransparent ? { background: "transparent" } : null),
            ...(isPortalEmbed ? { height: "100%", overflow: "hidden" } : null),
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
