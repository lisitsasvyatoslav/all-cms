import type { Core } from "@strapi/strapi";

const DEMO_PORTAL = {
  figmaLibraryUrl: "https://www.figma.com/design/",
  storybookUrl: "https://storybook.js.org/",
  documentationUrl: "https://docs.strapi.io/",
  repositoryUrl: "https://github.com/strapi/strapi",
};

const DEMO_COMPONENTS = [
  {
    name: "Button",
    slug: "button",
    description:
      "Кнопка для основных действий. Демо-запись из seed — правьте в Content Manager.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Text Field",
    slug: "text-field",
    description: "Поле ввода текста в формах.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
] as const;

const DEMO_COLORS = [
  {
    name: "Primary",
    tokenKey: "color.primary",
    hex: "#2563eb",
    sortOrder: 0,
    caption: "Основной акцент",
  },
  {
    name: "Surface",
    tokenKey: "color.surface",
    hex: "#fafafa",
    sortOrder: 1,
    caption: "Фон карточек (light)",
  },
  {
    name: "Danger",
    tokenKey: "color.danger",
    hex: "#dc2626",
    sortOrder: 2,
    caption: "Ошибка / деструктивное действие",
  },
  {
    name: "Success",
    tokenKey: "color.success",
    hex: "#16a34a",
    sortOrder: 3,
    caption: "Успех, подтверждение",
  },
  {
    name: "Warning",
    tokenKey: "color.warning",
    hex: "#ca8a04",
    sortOrder: 4,
    caption: "Предупреждение",
  },
  {
    name: "Text primary",
    tokenKey: "color.text.primary",
    hex: "#18181b",
    sortOrder: 5,
    caption: "Основной текст",
  },
  {
    name: "Text muted",
    tokenKey: "color.text.muted",
    hex: "#71717a",
    sortOrder: 6,
    caption: "Второстепенный текст",
  },
  {
    name: "Border",
    tokenKey: "color.border",
    hex: "#e4e4e7",
    sortOrder: 7,
    caption: "Границы и разделители",
  },
] as const;

const DEMO_ICONS = [
  {
    name: "Arrow right",
    slug: "arrow-right",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    notes: "Демо-иконка без превью — загрузите картинку в Media при желании.",
  },
  {
    name: "Check",
    slug: "check",
    figmaUrl: "https://www.figma.com/",
    notes: "Галочка",
  },
  {
    name: "Close",
    slug: "close",
    figmaUrl: "https://www.figma.com/",
    notes: "Закрыть / крестик",
  },
  {
    name: "Menu",
    slug: "menu",
    figmaUrl: "https://www.figma.com/",
    notes: "Гамбургер / навигация",
  },
] as const;

/**
 * Заполняет демо-данные один раз: только если коллекции Component, Color и Icon пусты.
 * Отключить: STRAPI_SEED_DEMO=false
 */
export async function seedDemoPortal(strapi: Core.Strapi): Promise<void> {
  if (process.env.STRAPI_SEED_DEMO === "false") {
    strapi.log.info("[seed-demo] skipped (STRAPI_SEED_DEMO=false)");
    return;
  }

  const doc = strapi.documents;

  const [nComponents, nColors, nIcons] = await Promise.all([
    doc("api::component.component").count({}),
    doc("api::color.color").count({}),
    doc("api::icon.icon").count({}),
  ]);

  if (nComponents > 0 || nColors > 0 || nIcons > 0) {
    strapi.log.info(
      `[seed-demo] skipped (existing entries: components=${nComponents}, colors=${nColors}, icons=${nIcons})`,
    );
    return;
  }

  strapi.log.info("[seed-demo] inserting demo portal content…");

  const portal = await doc("api::portal-source.portal-source").findFirst({});
  if (portal?.documentId) {
    await doc("api::portal-source.portal-source").update({
      documentId: portal.documentId,
      data: { ...DEMO_PORTAL },
    });
  } else {
    await doc("api::portal-source.portal-source").create({
      data: { ...DEMO_PORTAL },
    });
  }

  for (const row of DEMO_COMPONENTS) {
    await doc("api::component.component").create({
      data: { ...row },
    });
  }

  for (const row of DEMO_COLORS) {
    await doc("api::color.color").create({
      data: { ...row },
    });
  }

  for (const row of DEMO_ICONS) {
    await doc("api::icon.icon").create({
      data: { ...row },
    });
  }

  strapi.log.info("[seed-demo] done.");
}
