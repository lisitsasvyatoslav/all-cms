/** Реестр компонентов ui-kit: slug портала → исходный файл. */
export const UI_KIT_CATALOG = [
  { slug: "alert", exportName: "Alert", file: "alert.tsx" },
  { slug: "badge", exportName: "Badge", file: "badge.tsx" },
  { slug: "button", exportName: "Button", file: "button.tsx" },
  { slug: "card", exportName: "Card", file: "card.tsx" },
  { slug: "checkbox", exportName: "Checkbox", file: "checkbox.tsx" },
  { slug: "icon-button", exportName: "IconButton", file: "icon-button.tsx" },
  { slug: "input", exportName: "Input", file: "input.tsx" },
  { slug: "legacy-chip", exportName: "LegacyChip", file: "legacy-chip.tsx" },
  { slug: "link", exportName: "Link", file: "link.tsx" },
  { slug: "modal", exportName: "Modal", file: "modal.tsx" },
  { slug: "select", exportName: "Select", file: "select.tsx" },
  { slug: "tabs", exportName: "Tabs", file: "tabs.tsx", propsType: "TabsRootProps" },
] as const;

export type UiKitSlug = (typeof UI_KIT_CATALOG)[number]["slug"];

export const UI_KIT_SLUGS: UiKitSlug[] = UI_KIT_CATALOG.map((entry) => entry.slug);
