import { getPayload } from "payload";

import config from "@payload-config";
import type { Component } from "@/payload-types";

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

export async function loadComponentNavGroups(): Promise<PortalComponentNavGroup[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "components",
    depth: 2,
    limit: 200,
    sort: "name",
    overrideAccess: true,
  });

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

export async function loadComponentsCatalogGroups(): Promise<PortalComponentCatalogGroup[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "components",
    depth: 2,
    limit: 200,
    sort: "name",
    overrideAccess: true,
  });

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

export { folderSectionId };
