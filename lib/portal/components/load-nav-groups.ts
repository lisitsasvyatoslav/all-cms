import { cache } from "react";
import { unstable_cache } from "next/cache";

import type { Component } from "@/payload-types";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import { PORTAL_CACHE_REVALIDATE_SECONDS, PORTAL_CACHE_TAGS } from "@/lib/portal/cache/tags";
import { isComponentVisibleOnPortal } from "@/lib/portal/components/status";
import {
  COMPONENT_FOLDER_ORDER,
  folderSectionId,
} from "@/lib/portal/components/folders";
import { resolveRelatedComponentPreview } from "@/lib/portal/components/related-preview";
import { resolveRelatedComponentStorybookUrl } from "@/lib/portal/components/related-storybook-url";

export type PortalComponentNavItem = {
  slug: string;
  name: string;
  status: Component["status"];
};

export type PortalComponentNavGroup = {
  id: string;
  name: string;
  items: PortalComponentNavItem[];
};

export type PortalComponentCatalogItem = PortalComponentNavItem & {
  storybookUrl: string | null;
  previewLightUrl: string | null;
  previewDarkUrl: string | null;
  previewAlt: string;
};

export type PortalComponentCatalogGroup = {
  id: string;
  name: string;
  items: PortalComponentCatalogItem[];
};

function folderName(folder: Component["folder"]): string | null {
  if (!folder || typeof folder !== "object") return null;
  const name = folder.name?.trim();
  return name || null;
}

function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

function buildGroups<TItem extends { name: string }>(
  byFolder: Map<string, TItem[]>,
  ungrouped: TItem[],
): { id: string; name: string; items: TItem[] }[] {
  const groups: { id: string; name: string; items: TItem[] }[] = [];

  for (const name of COMPONENT_FOLDER_ORDER) {
    const items = byFolder.get(name);
    if (!items?.length) continue;
    groups.push({ id: folderSectionId(name), name, items: sortByName(items) });
    byFolder.delete(name);
  }

  for (const [name, items] of [...byFolder.entries()].sort(([a], [b]) => a.localeCompare(b, "ru"))) {
    if (!items.length) continue;
    groups.push({ id: folderSectionId(name), name, items: sortByName(items) });
  }

  if (ungrouped.length) {
    groups.push({
      id: folderSectionId("other"),
      name: "Other",
      items: sortByName(ungrouped),
    });
  }

  return groups;
}

export function buildComponentNavGroupsFromDocs(docs: Component[]): PortalComponentNavGroup[] {
  const byFolder = new Map<string, PortalComponentNavItem[]>();
  const ungrouped: PortalComponentNavItem[] = [];

  for (const doc of docs) {
    if (!isComponentVisibleOnPortal(doc)) continue;

    const item: PortalComponentNavItem = {
      slug: String(doc.slug),
      name: String(doc.name),
      status: doc.status,
    };
    const name = folderName(doc.folder);
    if (name) {
      const list = byFolder.get(name) ?? [];
      list.push(item);
      byFolder.set(name, list);
    } else {
      ungrouped.push(item);
    }
  }

  return buildGroups(byFolder, ungrouped);
}

function buildComponentCatalogGroupsFromDocs(docs: Component[]): PortalComponentCatalogGroup[] {
  const byFolder = new Map<string, PortalComponentCatalogItem[]>();
  const ungrouped: PortalComponentCatalogItem[] = [];

  for (const doc of docs) {
    if (!isComponentVisibleOnPortal(doc)) continue;

    const preview = resolveRelatedComponentPreview(doc);
    const item: PortalComponentCatalogItem = {
      slug: String(doc.slug),
      name: String(doc.name),
      status: doc.status,
      storybookUrl: preview.hasStaticPreview ? null : resolveRelatedComponentStorybookUrl(doc),
      previewLightUrl: preview.lightUrl,
      previewDarkUrl: preview.darkUrl,
      previewAlt: preview.alt,
    };
    const name = folderName(doc.folder);
    if (name) {
      const list = byFolder.get(name) ?? [];
      list.push(item);
      byFolder.set(name, list);
    } else {
      ungrouped.push(item);
    }
  }

  return buildGroups(byFolder, ungrouped);
}

async function fetchComponentNavDocs() {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "components",
    depth: 1,
    limit: 200,
    sort: "name",
    overrideAccess: true,
    select: {
      slug: true,
      name: true,
      description: true,
      status: true,
      folder: true,
    },
  });
  return docs as Component[];
}

async function fetchComponentCatalogDocs() {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "components",
    depth: 2,
    limit: 200,
    sort: "name",
    overrideAccess: true,
    select: {
      slug: true,
      name: true,
      description: true,
      status: true,
      folder: true,
      relatedPreviewLight: true,
      relatedPreviewDark: true,
    },
  });
  return docs as Component[];
}

const getCachedComponentNavDocs = unstable_cache(
  fetchComponentNavDocs,
  ["portal-component-nav-docs", "v2"],
  {
    revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
    tags: [PORTAL_CACHE_TAGS.componentNav, PORTAL_CACHE_TAGS.shell],
  },
);

const getCachedComponentCatalogDocs = unstable_cache(
  fetchComponentCatalogDocs,
  ["portal-component-catalog-docs", "v2"],
  {
    revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
    tags: [PORTAL_CACHE_TAGS.componentCatalog, PORTAL_CACHE_TAGS.shell],
  },
);

export const loadComponentNavGroups = cache(async (): Promise<PortalComponentNavGroup[]> => {
  const docs = await getCachedComponentNavDocs();
  return buildComponentNavGroupsFromDocs(docs);
});

export const loadComponentsCatalogGroups = cache(
  async (): Promise<PortalComponentCatalogGroup[]> => {
    const docs = await getCachedComponentCatalogDocs();
    return buildComponentCatalogGroupsFromDocs(docs);
  },
);

export { folderSectionId };
