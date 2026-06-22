import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Не копируем public/ в storybook-static: на Vercel Storybook 8.6 падает с
  // EEXIST при параллельном mkdir (brand/logos). Stories не используют public.
  viteFinal: async (viteConfig) => {
    viteConfig.publicDir = false;
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        "@": path.join(dirname, ".."),
        "@next-app/ui-kit": path.join(dirname, "../packages/ui-kit/src/index.ts"),
      },
    };
    return viteConfig;
  },
};

export default config;
