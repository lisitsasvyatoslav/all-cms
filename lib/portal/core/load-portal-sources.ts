import { cache } from "react";
import { unstable_cache } from "next/cache";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import { PORTAL_CACHE_REVALIDATE_SECONDS, PORTAL_CACHE_TAGS } from "@/lib/portal/cache/tags";

export type PortalSourcesLinks = {
  figmaUrl: string | null;
  repositoryUrl: string | null;
  storybookUrl: string | null;
};

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

type PortalSourcesDoc = {
  figmaLibraryUrl?: string | null;
  repositoryUrl?: string | null;
  storybookUrl?: string | null;
};

export function mapPortalSourcesDoc(doc: PortalSourcesDoc): PortalSourcesLinks {
  return {
    figmaUrl: trimOrNull(doc.figmaLibraryUrl),
    repositoryUrl: trimOrNull(doc.repositoryUrl),
    storybookUrl: trimOrNull(doc.storybookUrl),
  };
}

async function fetchPortalSources(): Promise<PortalSourcesLinks> {
  const payload = await getCachedPayload();
  const doc = await payload.findGlobal({
    slug: "portal-sources",
    depth: 0,
    overrideAccess: true,
  });
  return mapPortalSourcesDoc(doc);
}

const getCachedPortalSources = unstable_cache(fetchPortalSources, ["portal-sources"], {
  revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
  tags: [PORTAL_CACHE_TAGS.portalSources, PORTAL_CACHE_TAGS.shell],
});

export const loadPortalSources = cache(async (): Promise<PortalSourcesLinks> => {
  return getCachedPortalSources();
});
