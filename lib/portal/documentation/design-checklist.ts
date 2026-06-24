import { unstable_cache } from "next/cache";

import type { Component } from "@/payload-types";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import { PORTAL_CACHE_REVALIDATE_SECONDS, PORTAL_CACHE_TAGS } from "@/lib/portal/cache/tags";

export type MergedDesignChecklistItem = {
  key: string | number;
  title: string;
  description?: string | null;
  done: boolean;
  note?: string | null;
};

type DesignChecklistCatalogItem = {
  id: number;
  title: string;
  description?: string | null;
};

function resolveRelationshipId(
  value: number | { id?: number | null } | null | undefined,
): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  return value.id ?? null;
}

async function fetchDesignChecklistCatalog(): Promise<DesignChecklistCatalogItem[]> {
  const payload = await getCachedPayload();
  const { docs } = await payload.find({
    collection: "design-checklist-items",
    where: { isActive: { equals: true } },
    sort: "sortOrder",
    limit: 100,
    depth: 0,
    overrideAccess: true,
    select: {
      title: true,
      description: true,
    },
  });
  return docs;
}

const getCachedDesignChecklistCatalog = unstable_cache(
  fetchDesignChecklistCatalog,
  ["portal-design-checklist-catalog"],
  {
    revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
    tags: [PORTAL_CACHE_TAGS.designChecklist],
  },
);

/** Все активные пункты справочника + статусы с карточки компонента. */
export async function loadMergedDesignChecklist(
  component: Component,
): Promise<MergedDesignChecklistItem[]> {
  const catalogItems = await getCachedDesignChecklistCatalog();

  const statusByItemId = new Map<number, { done: boolean; note?: string | null }>();
  for (const row of component.designChecklist ?? []) {
    const itemId = resolveRelationshipId(
      row.item as number | { id?: number | null } | null | undefined,
    );
    if (itemId == null) continue;
    statusByItemId.set(itemId, {
      done: row.done ?? false,
      note: row.note,
    });
  }

  return catalogItems.map((item) => ({
    key: item.id,
    title: item.title,
    description: item.description,
    done: statusByItemId.get(item.id)?.done ?? false,
    note: statusByItemId.get(item.id)?.note ?? null,
  }));
}
