import type { Payload } from "payload";

export type DesignChecklistStatusRow = {
  item: number | { id?: number | null };
  done?: boolean | null;
  note?: string | null;
  id?: string | null;
};

export type DesignChecklistCatalogEntry = {
  id: number;
  sortOrder: number;
};

function resolveRelationshipId(
  value: number | { id?: number | null } | null | undefined,
): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  return value.id ?? null;
}

export async function loadActiveDesignChecklistCatalog(
  payload: Payload,
): Promise<DesignChecklistCatalogEntry[]> {
  const { docs } = await payload.find({
    collection: "design-checklist-items",
    where: { isActive: { equals: true } },
    sort: "sortOrder",
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });

  return docs.map((doc) => ({
    id: doc.id,
    sortOrder: doc.sortOrder ?? 0,
  }));
}

/** Дополняет недостающие пункты, сохраняет done/note, сортирует по справочнику. */
export function mergeDesignChecklistRows(
  catalog: DesignChecklistCatalogEntry[],
  existing?: DesignChecklistStatusRow[] | null,
): Array<{ item: number; done: boolean; note?: string | null; id?: string | null }> {
  const byItemId = new Map<number, DesignChecklistStatusRow>();

  for (const row of existing ?? []) {
    const itemId = resolveRelationshipId(row.item);
    if (itemId == null) continue;
    byItemId.set(itemId, row);
  }

  const sortedCatalog = [...catalog].sort((a, b) => a.sortOrder - b.sortOrder);

  return sortedCatalog.map(({ id }) => {
    const existingRow = byItemId.get(id);
    return {
      id: existingRow?.id ?? undefined,
      item: id,
      done: existingRow?.done ?? false,
      note: existingRow?.note ?? null,
    };
  });
}

export async function syncDesignChecklistForComponentData(
  payload: Payload,
  designChecklist?: DesignChecklistStatusRow[] | null,
) {
  const catalog = await loadActiveDesignChecklistCatalog(payload);
  return mergeDesignChecklistRows(catalog, designChecklist);
}

export async function syncDesignChecklistOnAllComponents(payload: Payload) {
  const catalog = await loadActiveDesignChecklistCatalog(payload);
  const { docs } = await payload.find({
    collection: "components",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  for (const doc of docs) {
    const merged = mergeDesignChecklistRows(catalog, doc.designChecklist);
    await payload.update({
      collection: "components",
      id: doc.id,
      data: { designChecklist: merged },
      overrideAccess: true,
    });
  }

  return docs.length;
}
