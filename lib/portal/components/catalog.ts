/**
 * Утилиты группировки компонентов в sidebar (runtime).
 * Статический каталог Radix Themes — `lib/portal/bootstrap/radix-themes-catalog.ts`.
 */

export { COMPONENT_FOLDER_ORDER as RADIX_THEMES_FOLDER_ORDER } from "@/lib/portal/components/folders";
export type { ComponentFolder as RadixThemesFolder } from "@/lib/portal/components/folders";
export { folderSectionId } from "@/lib/portal/components/folders";

/** @deprecated Используйте `@/lib/portal/bootstrap` (seed/codegen only). */
export {
  RADIX_THEMES_CATALOG,
  radixThemesDocsUrl,
  type RadixThemesCatalogEntry,
} from "@/lib/portal/bootstrap/radix-themes-catalog";
