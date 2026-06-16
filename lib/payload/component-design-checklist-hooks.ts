import type { CollectionAfterReadHook, CollectionBeforeChangeHook } from "payload";

import {
  loadActiveDesignChecklistCatalog,
  mergeDesignChecklistRows,
  syncDesignChecklistOnAllComponents,
  type DesignChecklistStatusRow,
} from "@/lib/payload/sync-component-design-checklist";

export const syncComponentDesignChecklistBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {
  if (!data) return data;

  const catalog = await loadActiveDesignChecklistCatalog(req.payload);
  const merged = mergeDesignChecklistRows(
    catalog,
    (data.designChecklist as DesignChecklistStatusRow[] | null | undefined) ?? null,
  );

  return {
    ...data,
    designChecklist: merged,
  };
};

/** В админке при открытии записи сразу показываем полный список пунктов. */
export const syncComponentDesignChecklistAfterRead: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  if (!req.user) return doc;

  const catalog = await loadActiveDesignChecklistCatalog(req.payload);
  const merged = mergeDesignChecklistRows(
    catalog,
    (doc.designChecklist as DesignChecklistStatusRow[] | null | undefined) ?? null,
  );

  return {
    ...doc,
    designChecklist: merged,
  };
};

export const syncAllComponentsAfterChecklistItemChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const becameActive = doc.isActive !== false;
  const wasInactive = previousDoc?.isActive === false;
  const isNew = !previousDoc;

  if (isNew || (becameActive && wasInactive)) {
    await syncDesignChecklistOnAllComponents(req.payload);
  }
};
