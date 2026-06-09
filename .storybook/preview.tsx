import type { Preview } from "@storybook/react";
import { Box, Theme } from "@radix-ui/themes";

import { portalRadixThemeProps } from "../lib/radix/portal-theme-config";

import "@radix-ui/themes/styles.css";
import "../app/globals.css";
import "../app/radix-themes.css";

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
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals.backgrounds?.value;
      const isDark = bg === "#0a0a0a";
      return (
        <Theme
          {...portalRadixThemeProps}
          appearance={isDark ? "dark" : "light"}
          className="radix-themes-portal"
        >
          <Box p="4" minHeight="4rem">
            <Story />
          </Box>
        </Theme>
      );
    },
  ],
};

export default preview;
