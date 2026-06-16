/**
 * Radix Themes layout props (m, mb, …) — не документируем в портале.
 * @see https://www.radix-ui.com/themes/docs/overview/props
 */
export const RADIX_THEME_LAYOUT_PROP_NAMES = [
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
  "position",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "gridColumn",
  "gridRow",
  "gridArea",
  "gridColumnStart",
  "gridColumnEnd",
  "gridRowStart",
  "gridRowEnd",
  "overflow",
  "overflowX",
  "overflowY",
  "display",
  "align",
  "justify",
  "direction",
  "wrap",
  "gap",
  "columns",
  "rows",
] as const;

export type RadixThemeLayoutPropName = (typeof RADIX_THEME_LAYOUT_PROP_NAMES)[number];

/** Убирает layout-утилиты Radix Themes из публичного API. */
export type WithoutRadixLayout<T> = Omit<T, RadixThemeLayoutPropName>;
