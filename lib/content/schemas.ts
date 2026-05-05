import { z } from "zod";

/** Модель как у Astro Content Collections: схемы для JSON в `content/`. */

export const portalSourcesSchema = z.object({
  figmaLibraryUrl: z.string().optional().nullable(),
  storybookUrl: z.string().optional().nullable(),
  documentationUrl: z.string().optional().nullable(),
  repositoryUrl: z.string().optional().nullable(),
});

export const componentEntrySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  figmaUrl: z.string().optional().nullable(),
  storybookUrl: z.string().optional().nullable(),
  docsUrl: z.string().optional().nullable(),
});

export const colorEntrySchema = z.object({
  name: z.string(),
  tokenKey: z.string().optional().nullable(),
  hex: z.string(),
  sortOrder: z.number().default(0),
  caption: z.string().optional().nullable(),
});

export const iconEntrySchema = z.object({
  name: z.string(),
  slug: z.string().optional().nullable(),
  /** Путь под `public/`, например `/portal-icons/check.svg` */
  previewUrl: z.string().optional().nullable(),
  figmaUrl: z.string().optional().nullable(),
  storybookUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type PortalSourcesContent = z.infer<typeof portalSourcesSchema>;
export type ComponentEntryContent = z.infer<typeof componentEntrySchema>;
export type ColorEntryContent = z.infer<typeof colorEntrySchema>;
export type IconEntryContent = z.infer<typeof iconEntrySchema>;
