import type { PortalPreviewEntry } from "./portal-preview-config";

/** Каталог превью на портале — без импорта *.stories (быстрее cold compile в dev). */
export const portalPreviewCatalogBySlug = {
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
  "icon-button": [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Sizes", title: "Размеры" },
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
  alert: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "RelatedPreview", title: "Related preview" },
    { storyId: "Variants", title: "Варианты" },
  ],
} as const satisfies Record<string, PortalPreviewEntry[]>;
