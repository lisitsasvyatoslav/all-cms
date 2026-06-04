import type { ThemeProps } from "@radix-ui/themes";

/**
 * Все props `<Theme>`, которые задают глобальную тему Radix (не отдельные Button/Dialog).
 * Hex и точные токены — в `app/radix-themes.css`; здесь только пресеты Radix.
 *
 * @see https://www.radix-ui.com/themes/docs/theme/overview
 */
export type PortalRadixThemeConfig = Pick<
  ThemeProps,
  | "appearance"
  | "accentColor"
  | "grayColor"
  | "panelBackground"
  | "radius"
  | "scaling"
  | "hasBackground"
>;

/** Единые настройки Radix Themes для портала и Storybook — меняйте здесь. */
export const portalRadixThemeProps = {
  /**
   * На портале задаётся в `PortalThemeProvider` (light/dark + localStorage).
   * В Storybook — в `.storybook/preview.tsx` по фону canvas.
   */
  appearance: "inherit",
  /** → `--accent-*` в CSS; кастомные hex поверх в `radix-themes.css` */
  accentColor: "indigo",
  /** → `--gray-*` / палитра slate в CSS */
  grayColor: "slate",
  /** → `--color-panel-translucent`, blur панелей Card/Dialog */
  panelBackground: "translucent",
  /** → `--radius-*` через `--radius-factor` */
  radius: "medium",
  /** → `--scaling`, `--space-*`, `--font-size-*` */
  scaling: "105%",
  /**
   * false — фон страницы у Tailwind; `--color-background` из CSS для компонентов Radix.
   */
  hasBackground: false,
} as const satisfies PortalRadixThemeConfig;
