import type { StrapiApp } from "@strapi/strapi/admin";

/**
 * Языки интерфейса админки (не путать с локализацией записей контента — плагин i18n).
 * `en` всегда в сборке как fallback и язык по умолчанию; здесь добавляем русский.
 * @see https://docs.strapi.io/cms/admin-panel-customization/locales-translations
 */
export default {
  config: {
    locales: ["ru"],
  },
  bootstrap(_app: StrapiApp) {},
};
