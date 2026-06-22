import { getPayload } from "payload";

import config from "@payload-config";

export type PortalSourcesLinks = {
  figmaUrl: string | null;
  repositoryUrl: string | null;
  storybookUrl: string | null;
};

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

export async function loadPortalSources(): Promise<PortalSourcesLinks> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "portal-sources",
    depth: 0,
    overrideAccess: true,
  });

  return {
    figmaUrl: trimOrNull(doc.figmaLibraryUrl),
    repositoryUrl: trimOrNull(doc.repositoryUrl),
    storybookUrl: trimOrNull(doc.storybookUrl),
  };
}
