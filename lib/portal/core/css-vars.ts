import type { CSSProperties } from "react";

/** Динамический цвет образца (единственный допустимый inline — CSS-переменная). */
export function portalSwatchBg(hex: string): CSSProperties {
  return { "--portal-swatch-bg": hex } as CSSProperties;
}

/** Высота iframe Storybook. */
export function portalIframeHeight(px: number): CSSProperties {
  return { "--portal-iframe-height": `${px}px` } as CSSProperties;
}
