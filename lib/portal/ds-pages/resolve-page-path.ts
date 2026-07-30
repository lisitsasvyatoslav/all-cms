import { portalPath } from "@/lib/portal/core/portal-base-path";

import { DS_INTRODUCTION_SLUG, dsPagePathFromSlug } from "./paths";

export type DsPagePathDoc = {
  id?: string | number;
  slug?: string | null;
  parent?: string | number | { id?: string | number | null } | null;
  breadcrumbs?: Array<{
    label?: string | null;
    url?: string | null;
  }> | null;
};

function trimOrEmpty(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function getDsPageParentId(doc: DsPagePathDoc): number | null {
  const parent = doc.parent;
  if (parent == null) return null;
  if (typeof parent === "number") return parent;
  if (typeof parent === "object" && parent.id != null && typeof parent.id === "number") {
    return parent.id;
  }
  return null;
}

export function hasDsPageParent(doc: DsPagePathDoc): boolean {
  return getDsPageParentId(doc) != null;
}

function pathFromSlugChain(slugs: string[]): string | null {
  if (slugs.length === 0) return null;
  if (slugs.length === 1 && slugs[0] === DS_INTRODUCTION_SLUG) {
    return portalPath();
  }
  return portalPath(`/${slugs.join("/")}`);
}

function pathFromParentChain(
  doc: DsPagePathDoc,
  docsById: Map<number, DsPagePathDoc>,
): string | null {
  const slugs: string[] = [];
  let current: DsPagePathDoc | undefined = doc;
  const visited = new Set<number>();

  while (current) {
    const slug = trimOrEmpty(current.slug);
    if (!slug) return null;
    slugs.unshift(slug);

    const parentId = getDsPageParentId(current);
    if (parentId == null) break;
    if (visited.has(parentId)) return null;
    visited.add(parentId);

    current = docsById.get(parentId);
    if (!current) return null;
  }

  return pathFromSlugChain(slugs);
}

/** URL страницы на портале: breadcrumbs → цепочка parent → корневой slug. */
export function resolveDsPagePath(
  doc: DsPagePathDoc,
  docsById?: Map<number, DsPagePathDoc>,
): string | null {
  const crumbs = doc.breadcrumbs ?? [];
  const lastUrl = crumbs[crumbs.length - 1]?.url?.trim();
  if (lastUrl) return lastUrl;

  if (docsById) {
    const fromParents = pathFromParentChain(doc, docsById);
    if (fromParents) return fromParents;
  }

  const slug = trimOrEmpty(doc.slug);
  if (!slug || hasDsPageParent(doc)) return null;
  return dsPagePathFromSlug(slug);
}

export function buildDsPageDocsById(docs: DsPagePathDoc[]): Map<number, DsPagePathDoc> {
  const map = new Map<number, DsPagePathDoc>();
  for (const doc of docs) {
    if (typeof doc.id === "number") {
      map.set(doc.id, doc);
    }
  }
  return map;
}
