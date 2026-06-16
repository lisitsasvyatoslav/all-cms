/**
 * Статические SVG в `public/icons/`.
 * Бренды — pill-ссылки и меню page actions; ui — CMS/портал.
 */
export const portalBrandIconPaths = {
  figma: "/icons/brands/figma.svg",
  github: "/icons/brands/github.svg",
  storybook: "/icons/brands/storybook.svg",
  markdown: "/icons/brands/markdown.svg",
  cursor: "/icons/brands/cursor.svg",
  claude: "/icons/brands/claude.svg",
} as const;

export const portalUiIconPaths = {
  "chevron-right": "/icons/ui/chevron-right.svg",
  close: "/icons/ui/close.svg",
  search: "/icons/ui/search.svg",
  user: "/icons/ui/user.svg",
} as const;

export type PortalBrandIconKey = keyof typeof portalBrandIconPaths;
export type PortalUiIconKey = keyof typeof portalUiIconPaths;
