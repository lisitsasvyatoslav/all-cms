import { getPayload } from "payload";

import config from "@payload-config";
import type { Component } from "@/payload-types";

export type MergedDesignChecklistItem = {
  key: string | number;
  title: string;
  description?: string | null;
  done: boolean;
  note?: string | null;
};

function resolveRelationshipId(
  value: number | { id?: number | null } | null | undefined,
): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  return value.id ?? null;
}

/** Все активные пункты справочника + статусы с карточки компонента. */
export async function loadMergedDesignChecklist(
  component: Component,
): Promise<MergedDesignChecklistItem[]> {
  const payload = await getPayload({ config });
  const { docs: catalogItems } = await payload.find({
    collection: "design-checklist-items",
    where: { isActive: { equals: true } },
    sort: "sortOrder",
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

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
