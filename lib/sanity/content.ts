import "server-only";

import { sanityClient, sanityConfigured } from "./client";

export { sanityConfigured };
export const sanityStudioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333";

export type PortalSource = {
  documentationUrl?: string;
  figmaLibraryUrl?: string;
  repositoryUrl?: string;
  storybookUrl?: string;
};

export type ComponentRow = {
  _id: string;
  description?: string;
  docsUrl?: string;
  figmaUrl?: string;
  name: string;
  slug: string;
  storybookUrl?: string;
};

export type ColorRow = {
  _id: string;
  caption?: string;
  hex: string;
  name: string;
  sortOrder?: number;
  tokenKey?: string;
};

export type IconRow = {
  _id: string;
  figmaUrl?: string;
  name: string;
  notes?: string;
  previewUrl?: string;
  slug?: string;
  storybookUrl?: string;
};

const queries = {
  colors: `*[_type == "color"] | order(sortOrder asc, name asc) {
    _id,
    name,
    tokenKey,
    hex,
    sortOrder,
    caption
  }`,
  componentBySlug: `*[_type == "component" && slug == $slug][0] {
    _id,
    name,
    slug,
    description,
    figmaUrl,
    storybookUrl,
    docsUrl
  }`,
  components: `*[_type == "component"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    figmaUrl,
    storybookUrl,
    docsUrl
  }`,
  icons: `*[_type == "icon"] | order(name asc) {
    _id,
    name,
    slug,
    figmaUrl,
    storybookUrl,
    notes,
    "previewUrl": preview.asset->url
  }`,
  portalSources: `*[_type == "portalSource"][0] {
    figmaLibraryUrl,
    storybookUrl,
    documentationUrl,
    repositoryUrl
  }`,
};

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

async function fetchQuery<T>(
  query: string,
  params?: Record<string, string | number | boolean | null>,
): Promise<T | null> {
  if (!sanityConfigured) return null;
  try {
    if (params) {
      return await sanityClient.fetch<T>(query, params);
    }
    return await sanityClient.fetch<T>(query);
  } catch {
    return null;
  }
}

export async function getPortalSource(): Promise<PortalSource | null> {
  const data = await fetchQuery<PortalSource>(queries.portalSources);
  if (!data) return null;
  return {
    documentationUrl: cleanText(data.documentationUrl),
    figmaLibraryUrl: cleanText(data.figmaLibraryUrl),
    repositoryUrl: cleanText(data.repositoryUrl),
    storybookUrl: cleanText(data.storybookUrl),
  };
}

export async function getComponents(): Promise<ComponentRow[]> {
  const rows = await fetchQuery<ComponentRow[]>(queries.components);
  if (!rows) return [];
  return rows.filter((row) => cleanText(row.slug) && cleanText(row.name)).map((row) => ({
    ...row,
    docsUrl: cleanText(row.docsUrl),
    figmaUrl: cleanText(row.figmaUrl),
    name: cleanText(row.name) || "Без названия",
    slug: cleanText(row.slug) || "",
    storybookUrl: cleanText(row.storybookUrl),
  }));
}

export async function getComponentBySlug(
  slug: string,
): Promise<ComponentRow | null> {
  const row = await fetchQuery<ComponentRow>(queries.componentBySlug, { slug });
  if (!row || !cleanText(row.slug)) return null;
  return {
    ...row,
    docsUrl: cleanText(row.docsUrl),
    figmaUrl: cleanText(row.figmaUrl),
    name: cleanText(row.name) || "Без названия",
    slug: cleanText(row.slug) || "",
    storybookUrl: cleanText(row.storybookUrl),
  };
}

export async function getColors(): Promise<ColorRow[]> {
  const rows = await fetchQuery<ColorRow[]>(queries.colors);
  if (!rows) return [];
  return rows.filter((row) => cleanText(row.name) && cleanText(row.hex)).map((row) => ({
    ...row,
    caption: cleanText(row.caption),
    hex: cleanText(row.hex) || "#000000",
    name: cleanText(row.name) || "Без названия",
    tokenKey: cleanText(row.tokenKey),
  }));
}

export async function getIcons(): Promise<IconRow[]> {
  const rows = await fetchQuery<IconRow[]>(queries.icons);
  if (!rows) return [];
  return rows.map((row) => ({
    ...row,
    figmaUrl: cleanText(row.figmaUrl),
    name: cleanText(row.name) || "Без названия",
    notes: cleanText(row.notes),
    previewUrl: cleanText(row.previewUrl),
    slug: cleanText(row.slug),
    storybookUrl: cleanText(row.storybookUrl),
  }));
}

