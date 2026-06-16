import { access } from "node:fs/promises";
import path from "node:path";

import type { BasePayload } from "payload";

import {
  RELATED_PREVIEW_OUTPUT_DIR,
  relatedPreviewOutputFilename,
  type RelatedPreviewTheme,
} from "../storybook/related-preview-capture.js";

export function relatedPreviewMediaAlt(slug: string, theme: RelatedPreviewTheme): string {
  return `Related preview: ${slug} (${theme})`;
}

export function relatedPreviewFilePath(
  projectRoot: string,
  slug: string,
  theme: RelatedPreviewTheme,
): string {
  return path.join(
    projectRoot,
    RELATED_PREVIEW_OUTPUT_DIR,
    relatedPreviewOutputFilename(slug, theme),
  );
}

async function getComponentIdBySlug(
  payload: BasePayload,
  slug: string,
): Promise<number | null> {
  const { docs } = await payload.find({
    collection: "components",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  return docs[0] ? Number(docs[0].id) : null;
}

function mediaIdFromField(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id: unknown }).id;
    return typeof id === "number" ? id : null;
  }
  return null;
}

async function findMediaIdByAlt(payload: BasePayload, alt: string): Promise<number | null> {
  const { docs } = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
    overrideAccess: true,
  });
  return docs[0] ? Number(docs[0].id) : null;
}

/** Создаёт или перезаписывает файл в Media (повторный capture обновляет картинку). */
export async function upsertRelatedPreviewMedia(
  payload: BasePayload,
  projectRoot: string,
  slug: string,
  theme: RelatedPreviewTheme,
  preferredMediaId?: number | null,
): Promise<number | null> {
  const filePath = relatedPreviewFilePath(projectRoot, slug, theme);

  try {
    await access(filePath);
  } catch {
    return null;
  }

  const alt = relatedPreviewMediaAlt(slug, theme);
  const existingId = preferredMediaId ?? (await findMediaIdByAlt(payload, alt));

  if (existingId) {
    await payload.update({
      collection: "media",
      id: existingId,
      data: { alt },
      filePath,
      overrideAccess: true,
    });
    return existingId;
  }

  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    overrideAccess: true,
  });
  return Number(doc.id);
}

export async function syncComponentRelatedPreviewsToPayload(
  payload: BasePayload,
  projectRoot: string,
  slug: string,
): Promise<{ lightId: number | null; darkId: number | null; linked: boolean }> {
  const componentId = await getComponentIdBySlug(payload, slug);
  if (!componentId) {
    return { lightId: null, darkId: null, linked: false };
  }

  const component = await payload.findByID({
    collection: "components",
    id: componentId,
    depth: 0,
    overrideAccess: true,
  });

  const lightId = await upsertRelatedPreviewMedia(
    payload,
    projectRoot,
    slug,
    "light",
    mediaIdFromField(component.relatedPreviewLight),
  );
  const darkId = await upsertRelatedPreviewMedia(
    payload,
    projectRoot,
    slug,
    "dark",
    mediaIdFromField(component.relatedPreviewDark),
  );

  if (!lightId && !darkId) {
    return { lightId: null, darkId: null, linked: false };
  }

  await payload.update({
    collection: "components",
    id: componentId,
    data: {
      ...(lightId ? { relatedPreviewLight: lightId } : {}),
      ...(darkId ? { relatedPreviewDark: darkId } : {}),
    },
    overrideAccess: true,
  });

  return { lightId, darkId, linked: true };
}

export async function syncRelatedPreviewsForSlugs(
  payload: BasePayload,
  projectRoot: string,
  slugs: string[],
): Promise<void> {
  for (const slug of slugs) {
    const result = await syncComponentRelatedPreviewsToPayload(payload, projectRoot, slug);
    if (!result.linked) {
      console.warn(`  Payload: no CMS component for "${slug}" — previews saved to disk only`);
      continue;
    }
    console.log(
      `  Payload: ${slug} (light=${result.lightId ?? "—"}, dark=${result.darkId ?? "—"})`,
    );
  }
}
