import fs from "fs/promises";
import path from "path";

import {
  colorEntrySchema,
  componentEntrySchema,
  iconEntrySchema,
  portalSourcesSchema,
  type ColorEntryContent,
  type ComponentEntryContent,
  type IconEntryContent,
  type PortalSourcesContent,
} from "./schemas";

const ROOT = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(ROOT, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getPortalSources(): Promise<PortalSourcesContent | null> {
  const data = await readJson<unknown>("portal-sources.json");
  if (!data) return null;
  const parsed = portalSourcesSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function getComponents(): Promise<
  (ComponentEntryContent & { id: string })[]
> {
  const dir = path.join(ROOT, "components");
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const jsonFiles = names.filter((n) => n.endsWith(".json"));
  const out: (ComponentEntryContent & { id: string })[] = [];
  for (const file of jsonFiles) {
    const raw = await readJson<unknown>(path.join("components", file));
    if (!raw) continue;
    const parsed = componentEntrySchema.safeParse(raw);
    if (!parsed.success) continue;
    out.push({ ...parsed.data, id: parsed.data.slug });
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return out;
}

export async function getComponentBySlug(
  slug: string,
): Promise<(ComponentEntryContent & { id: string }) | null> {
  const all = await getComponents();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getColors(): Promise<
  (ColorEntryContent & { id: number })[]
> {
  const data = await readJson<unknown>("colors.json");
  if (!data || !Array.isArray(data)) return [];
  const list: (ColorEntryContent & { id: number })[] = [];
  let i = 0;
  for (const item of data) {
    const parsed = colorEntrySchema.safeParse(item);
    if (!parsed.success) continue;
    i += 1;
    list.push({ ...parsed.data, id: i });
  }
  list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return list;
}

/** Для UI совместимости с прежним шаблоном (preview.url) */
export type IconForUi = IconEntryContent & {
  id: number;
  preview: { url: string } | null;
};

export async function getIcons(): Promise<IconForUi[]> {
  const data = await readJson<unknown>("icons.json");
  if (!data || !Array.isArray(data)) return [];
  const list: IconForUi[] = [];
  let i = 0;
  for (const item of data) {
    const parsed = iconEntrySchema.safeParse(item);
    if (!parsed.success) continue;
    i += 1;
    const previewUrl = parsed.data.previewUrl?.trim() || null;
    list.push({
      ...parsed.data,
      id: i,
      preview: previewUrl ? { url: previewUrl } : null,
    });
  }
  list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return list;
}
