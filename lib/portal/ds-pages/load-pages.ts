import { cache } from "react";

import { unstable_cache } from "next/cache";



import {

  resolveDsPageTitle,

  dsPageDocumentationBySlug,

  dsPageDescriptionBySlug,

} from "@/lib/payload/ds-pages-seeds";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";

import { PORTAL_CACHE_REVALIDATE_SECONDS, PORTAL_CACHE_TAGS } from "@/lib/portal/cache/tags";

import { portalPath } from "@/lib/portal/core/portal-base-path";

import type { Component } from "@/payload-types";



import {

  DS_INTRODUCTION_SLUG,

  DS_OVERVIEW_PAGE_SLUGS,

} from "./paths";

import {

  buildDsPageDocsById,

  getDsPageParentId,

  hasDsPageParent,

  resolveDsPagePath,

  type DsPagePathDoc,

} from "./resolve-page-path";

import { dsPagePathFromSegments } from "./routes";



type DocumentationBlocks = NonNullable<Component["documentation"]>;



export type DsPageBreadcrumb = {

  label: string;

  href?: string;

};



export type NormalizedDsPage = {

  id: string;

  title: string;

  description: string;

  path: string;

  slug: string;

  breadcrumbs: DsPageBreadcrumb[];

  documentation: DocumentationBlocks;

};



export type DsPageNavItem = {

  id: string;

  title: string;

  href: string;

  slug: string;

  depth: number;

};



type DsPageDoc = DsPagePathDoc & {

  title?: string | null;

  description?: string | null;

  documentation?: DocumentationBlocks | null;

  _order?: string | null;

};



function trimOrEmpty(value: string | null | undefined): string {

  return value?.trim() ?? "";

}



function slugFromPortalPagePath(path: string): string | null {

  const base = portalPath();

  if (path === base || path === `${base}/`) return DS_INTRODUCTION_SLUG;

  if (!path.startsWith(`${base}/`)) return null;

  const segments = path.slice(base.length + 1).split("/").filter(Boolean);

  return segments[segments.length - 1] ?? null;

}



function resolveDsPageLabel(pathOrSlug: string | null, cmsFallback: string): string {

  if (!pathOrSlug) return cmsFallback;

  const slug = pathOrSlug.includes("/") ? slugFromPortalPagePath(pathOrSlug) : pathOrSlug;

  if (!slug) return cmsFallback;

  return cmsFallback || resolveDsPageTitle(slug, "");

}



function normalizeDsPageDoc(

  doc: DsPageDoc,

  docsById: Map<number, DsPagePathDoc>,

): NormalizedDsPage | null {

  const path = resolveDsPagePath(doc, docsById);

  const slug = trimOrEmpty(doc.slug);

  const cmsTitle = trimOrEmpty(doc.title);

  const title = cmsTitle || resolveDsPageTitle(slug, "");

  if (!path || !title || !slug) return null;



  const cmsDescription = trimOrEmpty(doc.description);

  const cmsDocumentation = doc.documentation ?? [];



  const cmsCrumbs = doc.breadcrumbs ?? [];

  const breadcrumbs: DsPageBreadcrumb[] =

    slug === DS_INTRODUCTION_SLUG && !hasDsPageParent(doc)

      ? [{ label: title }]

      : [

          { label: "Введение", href: portalPath() },

          ...cmsCrumbs.map((crumb, index) => {

            const href = crumb.url?.trim() || undefined;

            const cmsLabel = trimOrEmpty(crumb.label);

            const label =

              cmsLabel ||

              (href

                ? resolveDsPageLabel(href, href || "Страница")

                : resolveDsPageLabel(slug, "Страница"));

            const isLast = index === cmsCrumbs.length - 1;

            return {

              label,

              href: isLast ? undefined : href,

            };

          }),

        ];



  return {

    id: String(doc.id),

    title,

    slug,

    description: cmsDescription || (dsPageDescriptionBySlug[slug] ?? ""),

    path,

    breadcrumbs,

    documentation:

      cmsDocumentation.length > 0 ? cmsDocumentation : (dsPageDocumentationBySlug[slug] ?? []),

  };

}



async function fetchPublishedDsPageDocs(): Promise<DsPageDoc[]> {

  const payload = await getCachedPayload();

  const { docs } = await payload.find({

    collection: "ds-pages",

    depth: 0,

    limit: 200,

    sort: "_order",

    draft: false,

    overrideAccess: true,

    where: {

      _status: {

        equals: "published",

      },

    },

  });



  return docs as DsPageDoc[];

}



const getCachedPublishedDsPageDocs = unstable_cache(

  fetchPublishedDsPageDocs,

  ["portal-ds-pages"],

  {

    revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,

    tags: [PORTAL_CACHE_TAGS.dsPages, PORTAL_CACHE_TAGS.shell],

  },

);



export async function loadPublishedDsPagePathSegments(): Promise<string[][]> {

  const docs = await getCachedPublishedDsPageDocs();

  const docsById = buildDsPageDocsById(docs);

  const base = portalPath();



  return docs

    .map((doc) => {

      const path = resolveDsPagePath(doc, docsById);

      if (!path || path === base || !path.startsWith(`${base}/`)) return null;

      return path.slice(base.length + 1).split("/").filter(Boolean);

    })

    .filter((segments): segments is string[] => segments != null && segments.length > 0);

}



function walkNavBranch(

  docs: DsPageDoc[],

  childrenByParent: Map<number | "root", DsPageDoc[]>,

  docsById: Map<number, DsPagePathDoc>,

  parentId: number | "root",

  depth: number,

): DsPageNavItem[] {

  const items: DsPageNavItem[] = [];



  for (const doc of childrenByParent.get(parentId) ?? []) {

    const page = normalizeDsPageDoc(doc, docsById);

    if (!page) continue;



    items.push({

      id: page.id,

      title: page.title,

      href: page.path,

      slug: page.slug,

      depth,

    });



    const docId = typeof doc.id === "number" ? doc.id : null;

    if (docId != null) {

      items.push(...walkNavBranch(docs, childrenByParent, docsById, docId, depth + 1));

    }

  }



  return items;

}



export const loadDsOverviewNavItems = cache(async (): Promise<DsPageNavItem[]> => {

  const docs = await getCachedPublishedDsPageDocs();

  const docsById = buildDsPageDocsById(docs);

  const childrenByParent = new Map<number | "root", DsPageDoc[]>();

  const rootsBySlug = new Map<string, DsPageDoc>();



  for (const doc of docs) {

    const parentId = getDsPageParentId(doc);

    const key = parentId ?? "root";

    const list = childrenByParent.get(key) ?? [];

    list.push(doc);

    childrenByParent.set(key, list);



    if (parentId == null && doc.slug) {

      rootsBySlug.set(doc.slug, doc);

    }

  }



  const items: DsPageNavItem[] = [];



  for (const rootSlug of DS_OVERVIEW_PAGE_SLUGS) {

    const root = rootsBySlug.get(rootSlug);

    if (!root || typeof root.id !== "number") continue;



    const page = normalizeDsPageDoc(root, docsById);

    if (!page) continue;



    items.push({

      id: page.id,

      title: page.title,

      href: page.path,

      slug: page.slug,

      depth: 0,

    });



    items.push(...walkNavBranch(docs, childrenByParent, docsById, root.id, 1));

  }



  return items;

});



export const loadDsPageNavItems = loadDsOverviewNavItems;



export const loadDsIntroductionPage = cache(async (): Promise<NormalizedDsPage | null> => {

  return loadDsPageBySegments([]);

});



export const loadDsPageBySegments = cache(

  async (segments: string[]): Promise<NormalizedDsPage | null> => {

    const targetPath = dsPagePathFromSegments(segments);

    const docs = await getCachedPublishedDsPageDocs();

    const docsById = buildDsPageDocsById(docs);

    const doc = docs.find((item) => resolveDsPagePath(item, docsById) === targetPath);

    if (!doc) return null;

    return normalizeDsPageDoc(doc, docsById);

  },

);


