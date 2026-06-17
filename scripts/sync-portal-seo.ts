/**
 * Заполняет global portal-seo демо-значениями.
 * Запуск: npm run sync:portal-seo
 */
import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config.js";

const demoPortalSeo = {
  siteName: "Design System",
  titleDefault: "Design System · Portal",
  titleTemplate: "%s · Design System",
  defaultDescription: "Портал дизайн-системы: компоненты, документация, Storybook.",
  locale: "ru_RU",
  homeShareTitle: "Дизайн-система",
  homeShareDescription:
    "Портал дизайн-системы: компоненты, документация, Storybook и ссылки на источники.",
  catalogWebShareTitle: "Components",
  catalogWebShareDescription: "Каталог компонентов дизайн-системы для Web.",
  showcaseShareTitle: "Блоки документации",
  showcaseShareDescription:
    "Демо 13 блоков вкладки «Документация» коллекции components — как на реальной странице компонента.",
};

async function main() {
  const payload = await getPayload({ config });
  await payload.updateGlobal({
    slug: "portal-seo",
    data: demoPortalSeo,
    overrideAccess: true,
  });
  console.log("portal-seo global updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
