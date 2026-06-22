import type { PortalPreviewEntry } from "./portal-preview-config";
import { UI_KIT_SLUGS } from "@next-app/ui-kit";

const basePreview = (): PortalPreviewEntry[] => [
  { storyId: "Default", title: "По умолчанию" },
  { storyId: "RelatedPreview", title: "Related preview" },
];

const PORTAL_PREVIEW_EXTENDED: Record<string, PortalPreviewEntry[]> = {
  button: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "PortalSync", title: "Синхронизация" },
    { storyId: "Variants", title: "Варианты" },
    { storyId: "Sizes", title: "Размеры" },
    { storyId: "Disabled", title: "Disabled" },
  ],
  input: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "WithLabel", title: "С label" },
    { storyId: "Sizes", title: "Размеры" },
    { storyId: "Invalid", title: "Ошибка" },
    { storyId: "Disabled", title: "Disabled" },
  ],
  link: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Variants", title: "Варианты" },
  ],
  badge: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Variants", title: "Варианты" },
  ],
  tabs: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
  ],
  card: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
  ],
  "legacy-chip": [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Group", title: "Группа" },
  ],
  modal: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
  ],
  select: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Sizes", title: "Размеры" },
  ],
  checkbox: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Group", title: "Группа" },
  ],
};

export const portalPreviewCatalogBySlug = {
  ...Object.fromEntries(UI_KIT_SLUGS.map((slug) => [slug, basePreview()])),
  ...PORTAL_PREVIEW_EXTENDED,
} as const satisfies Record<string, PortalPreviewEntry[]>;
