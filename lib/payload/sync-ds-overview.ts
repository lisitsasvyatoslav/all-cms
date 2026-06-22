import type { Payload } from "payload";

import {
  buildDsOverviewSourceItemsSeed,
  DS_OVERVIEW_PAGE_SEED,
} from "@/lib/portal/components/ds-overview-seed";

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
    portalSources.storybookUrl?.trim() || "http://127.0.0.1:6006";
  const documentationUrl =
    portalSources.documentationUrl?.trim() || "https://payloadcms.com/docs";
  const repositoryUrl =
    portalSources.repositoryUrl?.trim() || "https://github.com/payloadcms/payload";

  await payload.updateGlobal({
    slug: "ds-overview",
    data: {
      ...DS_OVERVIEW_PAGE_SEED,
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
