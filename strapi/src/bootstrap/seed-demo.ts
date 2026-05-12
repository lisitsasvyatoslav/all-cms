import type { Core } from "@strapi/strapi";

const DEMO_PORTAL = {
  figmaLibraryUrl: "https://www.figma.com/design/",
  storybookUrl: "https://storybook.js.org/",
  documentationUrl: "https://docs.strapi.io/",
  repositoryUrl: "https://github.com/strapi/strapi",
};

type DemoComponentGroup =
  | "data_display"
  | "feedback"
  | "inputs"
  | "layout"
  | "navigation";

type DemoComponentNode = {
  name: string;
  slug: string;
  componentGroup: DemoComponentGroup;
  description: string;
  figmaUrl: string;
  storybookUrl: string;
  docsUrl: string;
  children?: readonly DemoComponentNode[];
};

/**
 * Демо-каталог: `componentGroup` — одна из пяти категорий; опционально parent по slug.
 * Имена на английском (как в UI-китах). Старый slug `text-field` — в LEGACY_DEMO_COMPONENT_ROWS.
 */
const DEMO_COMPONENT_TREE: readonly DemoComponentNode[] = [
  {
    name: "Form",
    slug: "form",
    componentGroup: "inputs",
    description: "Groups fields and primary actions before submit.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
    children: [
      {
        name: "Text input",
        slug: "input",
        componentGroup: "inputs",
        description: "Single-line text control inside a form.",
        figmaUrl: "https://www.figma.com/",
        storybookUrl: "https://storybook.js.org/",
        docsUrl: "https://docs.strapi.io/",
      },
      {
        name: "Button",
        slug: "button",
        componentGroup: "inputs",
        description: "Primary action control (demo entry; edit in Strapi).",
        figmaUrl: "https://www.figma.com/",
        storybookUrl: "https://storybook.js.org/",
        docsUrl: "https://docs.strapi.io/",
      },
    ],
  },
  {
    name: "Header",
    slug: "header",
    componentGroup: "layout",
    description: "Top region: logo, navigation, and key actions.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Footer",
    slug: "footer",
    componentGroup: "layout",
    description: "Bottom region: links, legal, secondary navigation.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Data table",
    slug: "data-table",
    componentGroup: "data_display",
    description: "Tabular data with columns and sorting.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Badge",
    slug: "badge",
    componentGroup: "data_display",
    description: "Compact status or count label.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Alert",
    slug: "alert",
    componentGroup: "feedback",
    description: "Inline error, warning, or success message.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Progress",
    slug: "progress",
    componentGroup: "feedback",
    description: "Shows completion of a long-running task.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    componentGroup: "navigation",
    description: "Trail of sections leading to the current page.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Tabs",
    slug: "tabs",
    componentGroup: "navigation",
    description: "Switch between content panels in one region.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    componentGroup: "inputs",
    description: "Binary on/off choice.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Select",
    slug: "select",
    componentGroup: "inputs",
    description: "Pick one option from a list.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Sidebar",
    slug: "sidebar",
    componentGroup: "layout",
    description: "Side column for filters, menus, or secondary content.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Grid",
    slug: "grid",
    componentGroup: "layout",
    description: "Align blocks in columns and rows.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "List",
    slug: "list",
    componentGroup: "data_display",
    description: "Vertical list of similar items.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Stat card",
    slug: "stat-card",
    componentGroup: "data_display",
    description: "Metric highlight with a short caption.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Toast",
    slug: "toast",
    componentGroup: "feedback",
    description: "Short, non-blocking notification.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    componentGroup: "feedback",
    description: "Loading placeholder for content.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Pagination",
    slug: "pagination",
    componentGroup: "navigation",
    description: "Move through pages of a long list.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
  {
    name: "Nav menu",
    slug: "nav-menu",
    componentGroup: "navigation",
    description: "Horizontal or vertical list of section links.",
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
] as const;

type DemoFlatRow = Omit<DemoComponentNode, "children"> & {
  parentSlug: string | null;
};

/** Старые slug, которых нет в дереве DEMO_COMPONENT_TREE. */
const LEGACY_DEMO_COMPONENT_ROWS: readonly DemoFlatRow[] = [
  {
    slug: "text-field",
    name: "Text field",
    componentGroup: "inputs",
    description: "Single-line text input in forms.",
    parentSlug: null,
    figmaUrl: "https://www.figma.com/",
    storybookUrl: "https://storybook.js.org/",
    docsUrl: "https://docs.strapi.io/",
  },
];

/** Порядок DFS: родитель всегда раньше детей — удобно для merge по slug. */
function demoComponentRowsInOrder(
  nodes: readonly DemoComponentNode[],
  parentSlug: string | null,
): DemoFlatRow[] {
  const rows: DemoFlatRow[] = [];
  for (const node of nodes) {
    const { children, ...fields } = node;
    rows.push({ ...fields, parentSlug });
    if (children?.length) {
      rows.push(...demoComponentRowsInOrder(children, node.slug));
    }
  }
  return rows;
}

/** Создаёт только отсутствующие демо-записи (по slug). Уже существующие не трогает. */
async function mergeDemoComponents(strapi: Core.Strapi): Promise<void> {
  const doc = strapi.documents;
  const rows = demoComponentRowsInOrder(DEMO_COMPONENT_TREE, null);
  let rounds = 0;
  let createdInRound: number;
  do {
    createdInRound = 0;
    rounds += 1;
    for (const row of rows) {
      const existing = await strapi.db.query("api::component.component").findOne({
        where: { slug: row.slug },
      });
      if (existing) continue;

      let parentDocumentId: string | undefined;
      if (row.parentSlug) {
        const parent = await strapi.db.query("api::component.component").findOne({
          where: { slug: row.parentSlug },
        });
        if (!parent?.documentId) continue;
        parentDocumentId = parent.documentId;
      }

      const { parentSlug: _parentSlug, ...data } = row;
      await doc("api::component.component").create({
        data: {
          ...data,
          ...(parentDocumentId ? { parent: parentDocumentId } : {}),
        },
      });
      createdInRound += 1;
    }
  } while (createdInRound > 0 && rounds < 30);

  if (rounds >= 30) {
    strapi.log.warn("[seed-demo] merge components: остановка после 30 проходов");
  }
}

function demoCatalogRowsFlat(): readonly DemoFlatRow[] {
  return [
    ...demoComponentRowsInOrder(DEMO_COMPONENT_TREE, null),
    ...LEGACY_DEMO_COMPONENT_ROWS,
  ];
}

/** Обновляет существующие записи по slug: имя, описание, группа, ссылки, родитель из каталога. */
async function syncDemoComponentCatalog(strapi: Core.Strapi): Promise<void> {
  const doc = strapi.documents;
  for (const row of demoCatalogRowsFlat()) {
    const existing = await strapi.db.query("api::component.component").findOne({
      where: { slug: row.slug },
    });
    if (!existing?.documentId) continue;

    const data: {
      name: string;
      description: string;
      componentGroup: DemoComponentGroup;
      figmaUrl: string;
      storybookUrl: string;
      docsUrl: string;
      parent?: string;
    } = {
      name: row.name,
      description: row.description,
      componentGroup: row.componentGroup,
      figmaUrl: row.figmaUrl,
      storybookUrl: row.storybookUrl,
      docsUrl: row.docsUrl,
    };

    if (row.parentSlug) {
      const parent = await strapi.db.query("api::component.component").findOne({
        where: { slug: row.parentSlug },
      });
      if (parent?.documentId) {
        data.parent = parent.documentId;
      }
    }

    await doc("api::component.component").update({
      documentId: existing.documentId,
      data,
    });
  }
}

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
 * Демо-данные при старте (если STRAPI_SEED_DEMO не false):
 * - Color + Icon + Portal: только если обе коллекции цветов и иконок пусты.
 * - Components: всегда merge по slug — добавляет недостающие демо-записи (старые не удаляет).
 * Отключить всё: STRAPI_SEED_DEMO=false
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

  if (nColors === 0 && nIcons === 0) {
    strapi.log.info("[seed-demo] inserting portal…");
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
  }

  if (nColors === 0) {
    strapi.log.info("[seed-demo] inserting colors…");
    for (const row of DEMO_COLORS) {
      await doc("api::color.color").create({
        data: { ...row },
      });
    }
  }

  if (nIcons === 0) {
    strapi.log.info("[seed-demo] inserting icons…");
    for (const row of DEMO_ICONS) {
      await doc("api::icon.icon").create({
        data: { ...row },
      });
    }
  }

  if (nColors > 0 && nIcons > 0) {
    strapi.log.info(
      `[seed-demo] colors/icons already present (colors=${nColors}, icons=${nIcons})`,
    );
  }

  strapi.log.info(
    `[seed-demo] merge demo components (components in DB before: ${nComponents})…`,
  );
  await mergeDemoComponents(strapi);

  strapi.log.info("[seed-demo] sync component catalog (names, groups, parents)…");
  await syncDemoComponentCatalog(strapi);

  strapi.log.info("[seed-demo] done.");
}
