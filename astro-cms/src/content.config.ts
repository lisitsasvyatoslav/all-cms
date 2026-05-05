import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

/** Коллекция компонентов — один JSON на файл (общая папка с Next). */
const components = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "../content/components",
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional().nullable(),
    figmaUrl: z.string().optional().nullable(),
    storybookUrl: z.string().optional().nullable(),
    docsUrl: z.string().optional().nullable(),
  }),
});

/** Массив цветов из одного файла — каждому элементу задаём стабильный id. */
const colors = defineCollection({
  loader: file("../content/colors.json", {
    parser: (text) => {
      const rows = JSON.parse(text) as Array<Record<string, unknown>>;
      return rows.map((row, i) => ({
        id: String(row.tokenKey ?? row.name ?? i),
        ...row,
      }));
    },
  }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    tokenKey: z.string().optional().nullable(),
    hex: z.string(),
    sortOrder: z.number().optional(),
    caption: z.string().optional().nullable(),
  }),
});

const icons = defineCollection({
  loader: file("../content/icons.json", {
    parser: (text) => {
      const rows = JSON.parse(text) as Array<Record<string, unknown>>;
      return rows.map((row, i) => ({
        id: String(row.slug ?? row.name ?? i),
        ...row,
      }));
    },
  }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional().nullable(),
    previewUrl: z.string().optional().nullable(),
    figmaUrl: z.string().optional().nullable(),
    storybookUrl: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

const portalSources = defineCollection({
  loader: file("../content/portal-sources.json", {
    parser: (text) => {
      const data = JSON.parse(text) as Record<string, unknown>;
      return [{ id: "portal-sources", ...data }];
    },
  }),
  schema: z.object({
    id: z.string(),
    figmaLibraryUrl: z.string().optional().nullable(),
    storybookUrl: z.string().optional().nullable(),
    documentationUrl: z.string().optional().nullable(),
    repositoryUrl: z.string().optional().nullable(),
  }),
});

export const collections = {
  components,
  colors,
  icons,
  portalSources,
};
