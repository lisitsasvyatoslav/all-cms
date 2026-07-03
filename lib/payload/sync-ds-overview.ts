import type { Payload } from "payload";

import {
  buildDsOverviewSourceItemsSeed,
  DS_OVERVIEW_PAGE_SEED,
} from "@/lib/portal/components/ds-overview-seed";
import { defaultStorybookBaseUrl } from "@/lib/storybook/portal-preview-config";
type PortalSourcesDoc = {
  figmaLibraryUrl?: string | null;
  storybookUrl?: string | null;
  documentationUrl?: string | null;
  repositoryUrl?: string | null;
};

/** Заполняет global ds-overview демо-текстами и карточками источников. */
export async function syncDsOverview(
  payload: Payload,
  sources?: PortalSourcesDoc,
): Promise<void> {
  // Getting started and agent principles are CMS-authored. Do not overwrite
  // them during routine source/overview synchronization.
  const overviewSeed = {
    eyebrow: DS_OVERVIEW_PAGE_SEED.eyebrow,
    title: DS_OVERVIEW_PAGE_SEED.title,
    lead: DS_OVERVIEW_PAGE_SEED.lead,
    capabilitiesHeading: DS_OVERVIEW_PAGE_SEED.capabilitiesHeading,
    capabilities: DS_OVERVIEW_PAGE_SEED.capabilities,
    stackHeading: DS_OVERVIEW_PAGE_SEED.stackHeading,
    stackItems: DS_OVERVIEW_PAGE_SEED.stackItems,
    navigationNote: DS_OVERVIEW_PAGE_SEED.navigationNote,
    roadmapHeading: DS_OVERVIEW_PAGE_SEED.roadmapHeading,
    roadmap: DS_OVERVIEW_PAGE_SEED.roadmap,
    sourcesHeading: DS_OVERVIEW_PAGE_SEED.sourcesHeading,
    sourcesIntro: DS_OVERVIEW_PAGE_SEED.sourcesIntro,
  };

  const portalSources =
    sources ??
    (await payload.findGlobal({
      slug: "portal-sources",
      depth: 0,
      overrideAccess: true,
    }));

  const figmaLibraryUrl =
    portalSources.figmaLibraryUrl?.trim() ||
    "https://www.figma.com/community/file/1199125538294350451";
  const storybookUrl =
    portalSources.storybookUrl?.trim() || defaultStorybookBaseUrl();
  const documentationUrl =
    portalSources.documentationUrl?.trim() || "https://payloadcms.com/docs";
  const repositoryUrl =
    portalSources.repositoryUrl?.trim() || "https://github.com/payloadcms/payload";

  await payload.updateGlobal({
    slug: "ds-overview",
    data: {
      ...overviewSeed,
      sourceItems: buildDsOverviewSourceItemsSeed({
        figmaLibraryUrl,
        storybookUrl,
        documentationUrl,
        repositoryUrl,
      }),
    },
    overrideAccess: true,
  });
}
