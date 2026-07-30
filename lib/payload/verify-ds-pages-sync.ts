import type { Payload } from "payload";

import {
  dsPageDescriptionBySlug,
  dsPageDocumentationBySlug,
  dsPageTitleBySlug,
  dsOverviewSeedTree,
} from "@/lib/payload/ds-pages-seeds";
import {
  buildDsPageDocsById,
  resolveDsPagePath,
} from "@/lib/portal/ds-pages/resolve-page-path";
import { DS_OVERVIEW_PAGE_SLUGS } from "@/lib/portal/ds-pages/paths";

type DsPageDoc = {
  id: number;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  documentation?: unknown[] | null;
  _status?: string | null;
  breadcrumbs?: Array<{ url?: string | null; label?: string | null }> | null;
  parent?: number | { id?: number | null } | null;
};

export type DsPageSyncIssue = {
  slug: string;
  path: string | null;
  issues: string[];
};

function collectSeedSlugs(): Set<string> {
  const slugs = new Set<string>();

  function walk(node: { slug: string; children?: Array<{ slug: string; children?: unknown }> }) {
    slugs.add(node.slug);
    for (const child of node.children ?? []) {
      walk(child as { slug: string; children?: Array<{ slug: string }> });
    }
  }

  for (const rootSlug of DS_OVERVIEW_PAGE_SLUGS) {
    walk(dsOverviewSeedTree[rootSlug]);
  }

  return slugs;
}

function docBlockCount(doc: DsPageDoc): number {
  return doc.documentation?.length ?? 0;
}

function seedBlockCount(slug: string): number {
  return dsPageDocumentationBySlug[slug]?.length ?? 0;
}

export async function verifyDsPagesSync(payload: Payload): Promise<{
  ok: boolean;
  total: number;
  issues: DsPageSyncIssue[];
}> {
  const { docs } = await payload.find({
    collection: "ds-pages",
    depth: 0,
    limit: 200,
    draft: false,
    overrideAccess: true,
    where: {
      _status: { equals: "published" },
    },
  });

  const pages = docs as DsPageDoc[];
  const docsById = buildDsPageDocsById(pages);
  const expectedSlugs = collectSeedSlugs();
  const foundSlugs = new Set<string>();
  const issues: DsPageSyncIssue[] = [];

  for (const doc of pages) {
    const slug = doc.slug?.trim() ?? "";
    if (!slug) continue;
    foundSlugs.add(slug);

    const path = resolveDsPagePath(doc, docsById);
    const pageIssues: string[] = [];

    if (!path) {
      pageIssues.push("не удалось вычислить URL для портала");
    }

    const cmsTitle = doc.title?.trim() ?? "";
    const seedTitle = dsPageTitleBySlug[slug] ?? "";
    if (!cmsTitle) {
      pageIssues.push("пустой title в CMS");
    } else if (seedTitle && cmsTitle !== seedTitle) {
      pageIssues.push(`title в CMS («${cmsTitle}») ≠ сид («${seedTitle}»)`);
    }

    const cmsDescription = doc.description?.trim() ?? "";
    const seedDescription = dsPageDescriptionBySlug[slug] ?? "";
    if (!cmsDescription) {
      pageIssues.push("пустое description в CMS");
    } else if (seedDescription && cmsDescription !== seedDescription) {
      pageIssues.push("description в CMS ≠ сид");
    }

    const cmsBlocks = docBlockCount(doc);
    const seedBlocks = seedBlockCount(slug);
    if (cmsBlocks === 0) {
      pageIssues.push("нет блоков documentation в CMS — портал покажет fallback из сидов");
    } else if (seedBlocks > 0 && cmsBlocks !== seedBlocks) {
      pageIssues.push(
        `блоков documentation: CMS=${cmsBlocks}, сид=${seedBlocks} — портал покажет CMS (${cmsBlocks})`,
      );
    }

    if (pageIssues.length > 0) {
      issues.push({ slug, path, issues: pageIssues });
    }
  }

  for (const slug of expectedSlugs) {
    if (!foundSlugs.has(slug)) {
      issues.push({
        slug,
        path: null,
        issues: ["страница отсутствует в CMS (published)"],
      });
    }
  }

  return {
    ok: issues.length === 0,
    total: expectedSlugs.size,
    issues,
  };
}
