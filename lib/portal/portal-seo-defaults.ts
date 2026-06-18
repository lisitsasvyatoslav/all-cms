import {
  PORTAL_COMPONENTS_WEB_PATH,
  PORTAL_HOME_PATH,
  PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
} from "@/lib/portal/component-routes";
import { PORTAL_SITE_OG_RELATIVE_PATH } from "@/lib/portal/portal-default-og";

export type NormalizedPortalSeo = {
  siteName: string;
  titleDefault: string;
  titleTemplate: string;
  defaultDescription: string;
  locale: string;
  defaultOgImagePath: string;
  homeShareTitle: string;
  homeShareDescription: string;
  homeShareImagePath: string | null;
  catalogWebShareTitle: string;
  catalogWebShareDescription: string;
  catalogWebShareImagePath: string | null;
  showcaseShareTitle: string;
  showcaseShareDescription: string;
  showcaseShareImagePath: string | null;
  homePath: string;
  catalogWebPath: string;
  showcasePath: string;
};

/** Встроенные значения, если global portal-seo пуст или недоступен. */
export const PORTAL_SEO_FALLBACKS: NormalizedPortalSeo = {
  siteName: "Design System",
  titleDefault: "Design System · Portal",
  titleTemplate: "%s · Design System",
  defaultDescription: "Портал дизайн-системы: компоненты, документация, Storybook.",
  locale: "ru_RU",
  defaultOgImagePath: PORTAL_SITE_OG_RELATIVE_PATH,
  homeShareTitle: "Дизайн-система",
  homeShareDescription:
    "Портал дизайн-системы: компоненты, документация, Storybook и ссылки на источники.",
  homeShareImagePath: null as string | null,
  catalogWebShareTitle: "Components",
  catalogWebShareDescription: "Каталог компонентов дизайн-системы для Web.",
  catalogWebShareImagePath: null as string | null,
  showcaseShareTitle: "Блоки документации",
  showcaseShareDescription:
    "Демо 13 блоков вкладки «Документация» коллекции components — как на реальной странице компонента.",
  showcaseShareImagePath: null as string | null,
  homePath: PORTAL_HOME_PATH,
  catalogWebPath: PORTAL_COMPONENTS_WEB_PATH,
  showcasePath: PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
};
