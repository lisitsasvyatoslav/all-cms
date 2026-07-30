import { cache } from "react";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import type { PortalSearchArea } from "@/lib/payload/search/build-search-record";
import { normalizePortalSearchText } from "@/lib/payload/search/normalize-search-text";
import {
  buildPortalSearchIndexText,
  PORTAL_SEARCH_MATCH_SCOPE,
} from "@/lib/payload/search/search-config";

/** Пул записей для in-memory фильтрации (документация портала — сотни, не миллионы). */
const SEARCH_POOL_LIMIT = 500;

export type PortalSearchResult = {
  id: string;
  title: string;
  excerpt: string;
  portalUrl: string | null;
  area: PortalSearchArea | null;
  priority: number;
  collectionSlug: string | null;
};

const AREA_LABELS: Record<PortalSearchArea, string> = {
  ds: "DS · Overview",
  components: "Компоненты",
  brand: "Brand",
  text: "Text",
  colors: "Colors",
};

export function portalSearchAreaLabel(area: PortalSearchArea | null): string {
  if (!area) return "Портал";
  return AREA_LABELS[area] ?? area;
}

/** Нормализация запроса: trim + lower case (ru) для кириллицы и латиницы. */
export function normalizePortalSearchQuery(query: string): string {
  return normalizePortalSearchText(query);
}

type SearchDoc = {
  id: string | number;
  title?: string | null;
  searchText?: string | null;
  excerpt?: string | null;
  portalUrl?: string | null;
  area?: PortalSearchArea | null;
  priority?: number | null;
  doc?: {
    relationTo?: string | null;
    value?: string | number | null;
  } | null;
};

function matchesPortalSearchDoc(doc: SearchDoc, normalizedQuery: string): boolean {
  if (doc.searchText) {
    return doc.searchText.includes(normalizedQuery);
  }

  const title = doc.title?.trim() ?? "";
  if (PORTAL_SEARCH_MATCH_SCOPE === "title") {
    return normalizePortalSearchText(title).includes(normalizedQuery);
  }

  const fields = [title, doc.excerpt];
  return fields.some((value) => {
    if (!value) return false;
    return normalizePortalSearchText(value).includes(normalizedQuery);
  });
}

function mapSearchDoc(doc: SearchDoc): PortalSearchResult {
  return {
    id: String(doc.id),
    title: doc.title?.trim() ?? "Без названия",
    excerpt: doc.excerpt?.trim() ?? "",
    portalUrl: doc.portalUrl?.trim() || null,
    area: doc.area ?? null,
    priority: typeof doc.priority === "number" ? doc.priority : 0,
    collectionSlug: doc.doc?.relationTo?.trim() || null,
  };
}

export const searchPortalDocs = cache(
  async (query: string, limit = 20): Promise<PortalSearchResult[]> => {
    const normalizedQuery = normalizePortalSearchQuery(query);
    if (normalizedQuery.length < 2) return [];

    const payload = await getCachedPayload();
    const { docs } = await payload.find({
      collection: "search",
      depth: 0,
      limit: SEARCH_POOL_LIMIT,
      sort: "-priority",
      overrideAccess: true,
    });

    return (docs as SearchDoc[])
      .filter((doc) => matchesPortalSearchDoc(doc, normalizedQuery))
      .slice(0, limit)
      .map(mapSearchDoc);
  },
);
