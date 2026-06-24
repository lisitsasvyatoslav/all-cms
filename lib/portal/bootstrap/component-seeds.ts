import { componentFolderForSlug } from "@/lib/portal/components/folders";
import type { Component } from "@/payload-types";

import { RADIX_THEMES_CATALOG, radixThemesDocsUrl } from "./radix-themes-catalog";

export type ComponentSeedRow = {
  name: string;
  slug: string;
  status: "stable" | "beta" | "deprecated";
  statusNote?: string;
  description: string;
  figmaUrl?: string;
  storybookUrl: string;
  docsUrl: string;
  documentation?: Component["documentation"];
};

export function buildRadixComponentSeeds(
  storybookUrlForSlug: (slug: string) => string,
  documentationBySlug: Record<string, NonNullable<Component["documentation"]>>,
): ComponentSeedRow[] {
  return RADIX_THEMES_CATALOG.map((entry) => ({
    name: entry.name,
    slug: entry.slug,
    status: entry.status ?? "stable",
    ...(entry.statusNote ? { statusNote: entry.statusNote } : {}),
    description: entry.description,
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: storybookUrlForSlug(entry.slug),
    docsUrl: radixThemesDocsUrl(entry.slug),
    ...(documentationBySlug[entry.slug]
      ? { documentation: documentationBySlug[entry.slug] }
      : {}),
  }));
}

export function componentFolderNameForSlug(slug: string): string | undefined {
  return componentFolderForSlug(slug);
}
