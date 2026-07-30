import type { Payload, Where } from "payload";

import { dsOverviewSeedTree } from "@/lib/payload/ds-pages-seeds";
import { revalidatePortalDsPagesCache } from "@/lib/payload/revalidate-portal-cache";
import { DS_OVERVIEW_PAGE_SLUGS } from "@/lib/portal/ds-pages/paths";
import type { DsPageSeedNode } from "@/lib/payload/ds-pages-seeds";

function seedKey(parentKey: string, slug: string): string {
  return `${parentKey}/${slug}`;
}

async function findDsPageId(
  payload: Payload,
  slug: string,
  parentId: number | null,
): Promise<number | null> {
  const where: Where = {
    slug: { equals: slug },
  };

  if (parentId != null) {
    where.parent = { equals: parentId };
  } else {
    where.parent = { exists: false };
  }

  const { docs } = await payload.find({
    collection: "ds-pages",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where,
  });

  const id = docs[0]?.id;
  return typeof id === "number" ? id : null;
}

async function upsertDsPage(
  payload: Payload,
  seed: DsPageSeedNode,
  parentId: number | null,
): Promise<number> {
  const existingId = await findDsPageId(payload, seed.slug, parentId);
  const data = {
    title: seed.title,
    slug: seed.slug,
    description: seed.description,
    documentation: seed.documentation,
    parent: parentId,
    _status: "published" as const,
  };

  const syncContext = { skipPortalRevalidate: true };

  if (existingId != null) {
    const doc = await payload.update({
      collection: "ds-pages",
      id: existingId,
      data,
      overrideAccess: true,
      draft: false,
      context: syncContext,
    });
    return doc.id;
  }

  const doc = await payload.create({
    collection: "ds-pages",
    data,
    overrideAccess: true,
    draft: false,
    context: syncContext,
  });

  return doc.id;
}

async function syncSeedNode(
  payload: Payload,
  seed: DsPageSeedNode,
  parentId: number | null,
  parentKey: string,
  seededKeys: Set<string>,
): Promise<void> {
  seededKeys.add(seedKey(parentKey, seed.slug));
  const id = await upsertDsPage(payload, seed, parentId);

  for (const child of seed.children ?? []) {
    await syncSeedNode(payload, child, id, seedKey(parentKey, seed.slug), seededKeys);
  }
}

function getParentId(doc: {
  parent?: number | { id?: number | null } | null;
}): number | null {
  const parent = doc.parent;
  if (parent == null) return null;
  if (typeof parent === "number") return parent;
  if (typeof parent === "object" && parent.id != null && typeof parent.id === "number") {
    return parent.id;
  }
  return null;
}

async function docToSeedKey(payload: Payload, docId: number): Promise<string | null> {
  const slugs: string[] = [];
  let currentId: number | null = docId;

  while (currentId != null) {
    const doc = await payload.findByID({
      collection: "ds-pages",
      id: currentId,
      depth: 0,
      overrideAccess: true,
    });
    const slug = doc.slug?.trim();
    if (!slug) return null;
    slugs.unshift(slug);
    currentId = getParentId(doc);
  }

  return `root/${slugs.join("/")}`;
}

async function deleteOrphanPages(payload: Payload, seededKeys: Set<string>): Promise<void> {
  const { docs } = await payload.find({
    collection: "ds-pages",
    depth: 0,
    limit: 200,
    overrideAccess: true,
  });

  for (const doc of docs) {
    if (typeof doc.id !== "number") continue;
    const key = await docToSeedKey(payload, doc.id);
    if (key && seededKeys.has(key)) continue;

    await payload.delete({
      collection: "ds-pages",
      id: doc.id,
      overrideAccess: true,
      context: { skipPortalRevalidate: true },
    });
  }
}

export async function syncDsPagesIntroduction(payload: Payload): Promise<void> {
  await syncDsPages(payload);
}

export async function syncDsPages(payload: Payload): Promise<void> {
  const seededKeys = new Set<string>();

  for (const rootSlug of DS_OVERVIEW_PAGE_SLUGS) {
    const seed = dsOverviewSeedTree[rootSlug];
    await syncSeedNode(payload, seed, null, "root", seededKeys);
  }

  await deleteOrphanPages(payload, seededKeys);
  revalidatePortalDsPagesCache();
}
