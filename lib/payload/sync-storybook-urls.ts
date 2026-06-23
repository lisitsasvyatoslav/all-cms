import type { Payload } from "payload";

import { syncDsOverview } from "@/lib/payload/sync-ds-overview";
import { defaultStorybookBaseUrl } from "@/lib/storybook/portal-preview-config";
import {
  rewriteStorybookBaseUrl,
  rewriteStorybookDocumentUrl,
} from "@/lib/storybook/rewrite-storybook-url";
import type { Color, Component, Icon } from "@/payload-types";

type DocumentationBlock = NonNullable<Component["documentation"]>[number];

function rewriteDocumentationBlocks(
  blocks: DocumentationBlock[] | null | undefined,
  baseUrl: string,
): DocumentationBlock[] | null | undefined {
  if (!blocks?.length) return blocks;

  let changed = false;
  const next = blocks.map((block) => {
    if (block.blockType === "codeExample" && block.previewStorybookUrl) {
      const rewritten = rewriteStorybookDocumentUrl(block.previewStorybookUrl, baseUrl);
      if (rewritten !== block.previewStorybookUrl) {
        changed = true;
        return { ...block, previewStorybookUrl: rewritten };
      }
    }

    if (block.blockType === "storybookEmbed" && block.storybookUrl) {
      const rewritten = rewriteStorybookDocumentUrl(block.storybookUrl, baseUrl);
      if (rewritten !== block.storybookUrl) {
        changed = true;
        return { ...block, storybookUrl: rewritten };
      }
    }

    return block;
  });

  return changed ? next : blocks;
}

export type SyncStorybookUrlsResult = {
  baseUrl: string;
  portalSourcesUpdated: boolean;
  componentsUpdated: number;
  colorsUpdated: number;
  iconsUpdated: number;
};

export async function syncStorybookUrls(
  payload: Payload,
  baseUrl: string = defaultStorybookBaseUrl(),
): Promise<SyncStorybookUrlsResult> {
  const base = baseUrl.replace(/\/$/, "");
  const result: SyncStorybookUrlsResult = {
    baseUrl: base,
    portalSourcesUpdated: false,
    componentsUpdated: 0,
    colorsUpdated: 0,
    iconsUpdated: 0,
  };

  const portalSources = await payload.findGlobal({
    slug: "portal-sources",
    depth: 0,
    overrideAccess: true,
  });

  const nextPortalStorybookUrl = rewriteStorybookBaseUrl(
    portalSources.storybookUrl ?? "",
    base,
  );

  if (nextPortalStorybookUrl !== (portalSources.storybookUrl ?? "")) {
    await payload.updateGlobal({
      slug: "portal-sources",
      data: { storybookUrl: nextPortalStorybookUrl },
      overrideAccess: true,
    });
    result.portalSourcesUpdated = true;
  }

  await syncDsOverview(payload);

  const components = await payload.find({
    collection: "components",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  for (const doc of components.docs) {
    const data: Partial<Component> = {};
    let changed = false;

    if (doc.storybookUrl) {
      const next = rewriteStorybookDocumentUrl(doc.storybookUrl, base);
      if (next !== doc.storybookUrl) {
        data.storybookUrl = next;
        changed = true;
      }
    }

    const documentation = rewriteDocumentationBlocks(doc.documentation, base);
    if (documentation !== doc.documentation) {
      data.documentation = documentation;
      changed = true;
    }

    if (!changed) continue;

    await payload.update({
      collection: "components",
      id: doc.id,
      data,
      overrideAccess: true,
    });
    result.componentsUpdated += 1;
  }

  const colors = await payload.find({
    collection: "colors",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  for (const doc of colors.docs) {
    const documentation = rewriteDocumentationBlocks(
      doc.documentation as DocumentationBlock[] | null | undefined,
      base,
    );
    if (documentation === doc.documentation) continue;

    await payload.update({
      collection: "colors",
      id: doc.id,
      data: { documentation } as Partial<Color>,
      overrideAccess: true,
    });
    result.colorsUpdated += 1;
  }

  const icons = await payload.find({
    collection: "icons",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  for (const doc of icons.docs) {
    if (!doc.storybookUrl) continue;

    const next = rewriteStorybookDocumentUrl(doc.storybookUrl, base);
    if (next === doc.storybookUrl) continue;

    await payload.update({
      collection: "icons",
      id: doc.id,
      data: { storybookUrl: next } as Partial<Icon>,
      overrideAccess: true,
    });
    result.iconsUpdated += 1;
  }

  return result;
}
