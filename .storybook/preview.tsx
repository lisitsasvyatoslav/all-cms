import type { Preview } from "@storybook/react";
import { Theme } from "@radix-ui/themes";
import type { ReactNode } from "react";

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
      const wrapper = (children: ReactNode) => (
        <Theme
          {...portalRadixThemeProps}
          appearance={isDark ? "dark" : "light"}
          className="radix-themes-portal"
        >
          <div
            className={isDark ? "dark" : undefined}
            style={{
              padding: "1.5rem",
              minHeight: "4rem",
              color: "var(--foreground)",
              background: "var(--background)",
            }}
          >
            {children}
          </div>
        </Theme>
      );
      return wrapper(<Story />);
    },
  ],
};

export default preview;
