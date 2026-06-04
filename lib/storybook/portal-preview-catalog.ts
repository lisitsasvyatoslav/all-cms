import type { PortalPreviewEntry } from "./portal-preview-config";

/** Каталог превью на портале — без импорта *.stories (быстрее cold compile в dev). */
export const portalPreviewCatalogBySlug = {
  button: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "PortalSync", title: "Синхронизация" },
    { storyId: "Variants", title: "Варианты" },
    { storyId: "Sizes", title: "Размеры" },
    { storyId: "Disabled", title: "Disabled" },
  ],
  input: [
    { storyId: "Default", title: "По умолчанию" },
    { storyId: "WithLabel", title: "С label" },
    { storyId: "Sizes", title: "Размеры" },
    { storyId: "Invalid", title: "Ошибка" },
    { storyId: "Disabled", title: "Disabled" },
  ],
} as const satisfies Record<string, PortalPreviewEntry[]>;
