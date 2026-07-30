import type { BeforeSync } from "@payloadcms/plugin-search/types";

import { componentWebPagePath, colorPagePath } from "@/lib/portal/components/routes";
import { brandPath } from "@/lib/portal/core/portal-base-path";
import { PORTAL_TEXT_GLOSSARY_PATH } from "@/lib/portal/core/portal-base-path";
import { resolveDsPagePath } from "@/lib/portal/ds-pages/resolve-page-path";

import { extractPortalSearchExcerpt, joinSearchText } from "./extract-search-text";
import { buildPortalSearchIndexText } from "./search-config";

export const PORTAL_SEARCH_COLLECTIONS = [
  "ds-pages",
  "components",
  "brand-pages",
  "glossary-terms",
  "colors",
] as const;

export type PortalSearchArea = "ds" | "components" | "brand" | "text" | "colors";

function resolveSearchTitle(collectionSlug: string, doc: Record<string, unknown>): string {
  switch (collectionSlug) {
    case "components":
    case "colors":
      return String(doc.name ?? "").trim();
    case "glossary-terms":
      return String(doc.preferred ?? "").trim();
    default:
      return String(doc.title ?? "").trim();
  }
}

function resolvePortalUrl(collectionSlug: string, doc: Record<string, unknown>): string | null {
  switch (collectionSlug) {
    case "ds-pages": {
      const path = resolveDsPagePath(doc);
      return path;
    }
    case "components": {
      const slug = String(doc.slug ?? "").trim();
      return slug ? componentWebPagePath(slug) : null;
    }
    case "brand-pages": {
      const slug = String(doc.slug ?? "").trim();
      return slug ? brandPath(`/${slug}`) : null;
    }
    case "glossary-terms":
      return PORTAL_TEXT_GLOSSARY_PATH;
    case "colors": {
      const id = doc.id;
      if (typeof id === "number" || typeof id === "string") {
        return colorPagePath(id);
      }
      return null;
    }
    default:
      return null;
  }
}

function resolveSearchArea(collectionSlug: string): PortalSearchArea {
  switch (collectionSlug) {
    case "components":
      return "components";
    case "brand-pages":
      return "brand";
    case "glossary-terms":
      return "text";
    case "colors":
      return "colors";
    default:
      return "ds";
  }
}

/** Обогащает запись индекса: title, excerpt, URL портала, раздел. */
export const buildPortalSearchRecord: BeforeSync = async ({
  collectionSlug,
  originalDoc,
  searchDoc,
}) => {
  const doc = originalDoc as Record<string, unknown>;

  if (collectionSlug === "ds-pages" && doc._status === "draft") {
    return searchDoc;
  }

  const title = resolveSearchTitle(collectionSlug, doc);
  const portalUrl = resolvePortalUrl(collectionSlug, doc);
  const excerpt = extractPortalSearchExcerpt(collectionSlug, doc);
  const description =
    typeof doc.description === "string"
      ? doc.description.trim()
      : collectionSlug === "glossary-terms" && typeof doc.avoid === "string"
        ? doc.avoid.trim()
        : "";

  const excerptText = joinSearchText(description, excerpt);
  const searchText = buildPortalSearchIndexText(title, excerptText);

  return {
    ...searchDoc,
    title: title || searchDoc.title,
    excerpt: excerptText,
    searchText,
    portalUrl,
    area: resolveSearchArea(collectionSlug),
  };
};
