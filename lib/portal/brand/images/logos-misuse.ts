/** SVG из brandbook.finam.ru (cdn-lpbr01.finam.ru/lpbr-static). */
export type BrandLogoMisuseDemoKey =
  | "wrong-colors"
  | "wrong-font"
  | "wrong-layout"
  | "rotate-elements"
  | "rotate-logo"
  | "stretch"
  | "clearspace"
  | "shadow"
  | "low-contrast"
  | "busy-background"
  | "legacy";

export const brandLogoMisuseImagePaths: Record<BrandLogoMisuseDemoKey, string> = {
  "wrong-colors": "/brand/logos/misuse/wrong-colors.svg",
  "wrong-font": "/brand/logos/misuse/wrong-font.svg",
  "wrong-layout": "/brand/logos/misuse/wrong-layout.svg",
  "rotate-elements": "/brand/logos/misuse/rotate-elements.svg",
  "rotate-logo": "/brand/logos/misuse/rotate-logo.svg",
  stretch: "/brand/logos/misuse/stretch.svg",
  clearspace: "/brand/logos/misuse/clearspace.svg",
  shadow: "/brand/logos/misuse/shadow.svg",
  "low-contrast": "/brand/logos/misuse/low-contrast.svg",
  "busy-background": "/brand/logos/misuse/busy-background.svg",
  legacy: "/brand/logos/misuse/legacy.svg",
};
