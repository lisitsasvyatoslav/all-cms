import { getPayload } from "payload";

import config from "@payload-config";
import type { Component } from "@/payload-types";

import { isComponentVisibleOnPortal } from "@/lib/portal/component-status";
import { resolveRelatedComponentPreview } from "@/lib/portal/resolve-related-component-preview";
import { resolveRelatedComponentStorybookUrl } from "@/lib/portal/resolve-related-component-storybook-url";

export type PortalComponentCatalogItem = {
  slug: string;
  name: string;
  status: Component["status"];
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

const KNOWN_FOLDER_ORDER = ["Actions", "Forms", "Feedback"] as const;

function folderName(folder: Component["folder"]): string | null {
  if (!folder || typeof folder !== "object") return null;
  const name = folder.name?.trim();
  return name || null;
}

export function folderSectionId(name: string): string {
  return `folder-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function toCatalogItem(doc: Component): PortalComponentCatalogItem {
  const preview = resolveRelatedComponentPreview(doc);

  return {
    slug: String(doc.slug),
    name: String(doc.name),
    status: doc.status,
    storybookUrl: preview.hasStaticPreview ? null : resolveRelatedComponentStorybookUrl(doc),
    previewLightUrl: preview.lightUrl,
    previewDarkUrl: preview.darkUrl,
    previewAlt: preview.alt,
  };
}

function sortByName(items: PortalComponentCatalogItem[]): PortalComponentCatalogItem[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "ru"));
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

    const item = toCatalogItem(doc);
    const name = folderName(doc.folder);

    if (name) {
      const list = byFolder.get(name) ?? [];
      list.push(item);
      byFolder.set(name, list);
    } else {
      ungrouped.push(item);
    }
  }

  const groups: PortalComponentCatalogGroup[] = [];

  for (const name of KNOWN_FOLDER_ORDER) {
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
