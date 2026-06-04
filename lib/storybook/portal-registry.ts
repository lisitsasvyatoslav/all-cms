"use client";

import type { PortalPreviewEntry } from "./portal-preview-config";
import { portalPreviewCatalogBySlug } from "./portal-preview-catalog";

import type { StoriesModule } from "./stories-module";

export type PortalStorybookEntry = {
  loadStories: () => Promise<StoriesModule>;
  catalog: PortalPreviewEntry[];
  layoutClassName?: string;
};

export { portalPreviewCatalogBySlug };

export const PORTAL_STORYBOOK_REGISTRY: Record<string, PortalStorybookEntry> = {
  button: {
    loadStories: () =>
      import("@/components/ds/button.stories") as Promise<StoriesModule>,
    catalog: [...portalPreviewCatalogBySlug.button],
  },
  input: {
    loadStories: () =>
      import("@/components/ds/input.stories") as Promise<StoriesModule>,
    catalog: [...portalPreviewCatalogBySlug.input],
    layoutClassName: "max-w-lg",
  },
};
