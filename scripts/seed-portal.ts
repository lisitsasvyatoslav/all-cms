/**
 * Заполняет демо-данные: 2 компонента, 8 цветов, 4 иконки (+ SVG в Media), глобальные ссылки, справочник field-showcase.
 * Запуск: `npm run seed:portal` (нужен `PAYLOAD_SECRET` и `DATABASE_URI` в `.env` или `.env.local`).
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local"), override: true });
const iconAssetsDir = path.join(projectRoot, "public", "icon-assets");

const demoSources = {
  figmaLibraryUrl: "https://www.figma.com/community/file/1199125538294350451",
  storybookUrl: "https://storybook.js.org/showcase",
  documentationUrl: "https://payloadcms.com/docs",
  repositoryUrl: "https://github.com/payloadcms/payload",
};

/** Базовая документация Button; после сида цветов/иконок к ней дописываются демо-блоки с relationship/upload и др. */
const buttonDocumentationSeedBase = [
  {
    blockType: "section" as const,
    heading: "Когда использовать",
    body: "Button — для явного действия в интерфейсе: отправка формы, подтверждение в модалке, запуск процесса. Текст кнопки должен отвечать на вопрос «что произойдёт?»",
  },
  {
    blockType: "doDont" as const,
    dos: [
      { text: "Один основной (primary) акцент на логический экран или модалку." },
      { text: "Используйте глагол: «Сохранить», «Отправить», а не «OK»." },
      { text: "Для destructive-действий используйте variant danger и явный текст." },
    ],
    donts: [
      { text: "Не ставьте две primary-кнопки рядом без приоритета." },
      { text: "Не маскируйте навигацию между страницами как button, если достаточно ссылки." },
    ],
  },
  {
    blockType: "callout" as const,
    tone: "warning" as const,
    text: "Для перехода на другую страницу без побочных эффектов предпочтительнее текстовая ссылка или Link — кнопка ожидается как действие в текущем контексте.",
  },
  {
    blockType: "divider" as const,
    caption: "Параметры",
  },
  {
    blockType: "propsTable" as const,
    title: "Основные пропсы (пример таблицы из CMS)",
    rows: [
      {
        name: "variant",
        type: '"primary" | "secondary" | …',
        defaultValue: '"primary"',
        description: "Визуальный стиль.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Размер кнопки.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "—",
        description: "Отключает взаимодействие.",
      },
    ],
  },
  {
    blockType: "resourceLinks" as const,
    links: [
      { label: "Payload — Blocks", url: "https://payloadcms.com/docs/fields/blocks" },
      { label: "Payload — Tabs", url: "https://payloadcms.com/docs/fields/tabs" },
    ],
  },
  {
    blockType: "quote" as const,
    body: "Кнопка — самый сильный призыв к действию на экране: не тратьте его зря.",
    attribution: "Руководство по UI (пример)",
  },
  {
    blockType: "codeExample" as const,
    title: "Минимальный пример",
    code: `<Button variant="primary" type="submit">
  Сохранить
</Button>`,
  },
];

const lexicalDemoParagraph = {
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    children: [
      {
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "text",
            format: 0,
            style: "",
            detail: 0,
            mode: "normal",
            text: "Абзац из поля Rich Text (Lexical). Ниже на странице — ещё примеры типов полей Payload из сида.",
            version: 1,
          },
        ],
        direction: null,
        textStyle: "",
        textFormat: 0,
      },
    ],
    direction: "ltr",
  },
};

function buildExtraButtonDocumentationBlocks(opts: {
  colorId?: number;
  iconId?: number;
  mediaId?: number;
}) {
  const blocks: Record<string, unknown>[] = [
    { blockType: "divider", caption: "Ещё примеры полей (после сида)" },
    {
      blockType: "richTextSection",
      title: "Rich Text",
      body: lexicalDemoParagraph,
    },
    {
      blockType: "codeMonaco",
      title: "Поле Code (Monaco)",
      snippet: `export function ping() {\n  return "pong";\n}`,
    },
  ];
  if (opts.colorId != null) {
    blocks.push({ blockType: "relColor", color: opts.colorId });
  }
  if (opts.iconId != null) {
    blocks.push({ blockType: "relIcon", icon: opts.iconId });
  }
  if (opts.mediaId != null) {
    blocks.push({
      blockType: "mediaFigure",
      image: opts.mediaId,
      caption: "Загрузка из Media (превью иконки из сида).",
    });
  }
  blocks.push(
    {
      blockType: "geoPoint",
      label: "Точка на карте (Point)",
      location: [37.6173, 55.7558],
    },
    {
      blockType: "calendarDate",
      title: "Релиз / проверка (Date)",
      at: new Date().toISOString(),
    },
    {
      blockType: "emailLine",
      label: "Контакт дизайн-системы",
      address: "design-system@example.com",
    },
    { blockType: "numberStat", label: "Версия доки (Number)", value: 1 },
    {
      blockType: "radioPick",
      mode: "normal" as const,
      hint: "Пример поля Radio внутри блока.",
    },
    {
      blockType: "multiSelect",
      tags: ["a11y", "forms"] as ("a11y" | "forms" | "layout" | "motion")[],
      note: "Select с несколькими значениями.",
    },
    {
      blockType: "flagBox",
      enabled: true,
      flagLabel: "Компонент стабилен (Checkbox)",
    },
    {
      blockType: "jsonBlock",
      title: "Произвольный JSON",
      payload: { source: "seed", component: "button" },
    },
    {
      blockType: "groupStrip",
      bundle: {
        gTitle: "Сводка (Group)",
        gCount: 3,
        gOn: true,
      },
    },
    {
      blockType: "nestedStack",
      intro: "Вложенные blocks (array of block rows):",
      items: [
        { blockType: "nestLine" as const, line: "Проверить контраст текста на кнопке." },
        { blockType: "nestLine" as const, line: "Проверить focus ring при клавиатуре." },
      ],
    },
    {
      blockType: "namedTabsStrip",
      tabSummary: { brief: "Именованные Tabs: кратко — один объект tabSummary в JSON." },
      tabDetail: {
        detail: "Во втором табе — tabDetail. В админке переключение вкладок, на портале оба блока показаны рядом.",
      },
    },
    { blockType: "callout", tone: "success" as const, text: "Все эти блоки можно менять в Payload; порядок на портале совпадает с порядком в форме." },
  );
  return blocks;
}

async function finalizeButtonDocumentation(
  payload: Awaited<ReturnType<typeof getPayload>>,
) {
  const foundBtn = await payload.find({
    collection: "components",
    where: { slug: { equals: "button" } },
    limit: 1,
    overrideAccess: true,
  });
  const btn = foundBtn.docs[0];
  if (!btn) return;

  const firstColor = await payload.find({
    collection: "colors",
    limit: 1,
    sort: "sortOrder",
    overrideAccess: true,
  });
  const searchIcon = await payload.find({
    collection: "icons",
    where: { slug: { equals: "search" } },
    limit: 1,
    overrideAccess: true,
  });
  const firstMedia = await payload.find({
    collection: "media",
    limit: 1,
    overrideAccess: true,
  });

  const colorId = firstColor.docs[0]?.id != null ? Number(firstColor.docs[0].id) : undefined;
  const iconId = searchIcon.docs[0]?.id != null ? Number(searchIcon.docs[0].id) : undefined;
  const mediaId = firstMedia.docs[0]?.id != null ? Number(firstMedia.docs[0].id) : undefined;

  const documentation = [
    ...buttonDocumentationSeedBase,
    ...buildExtraButtonDocumentationBlocks({ colorId, iconId, mediaId }),
  ];

  await payload.update({
    collection: "components",
    id: btn.id,
    data: { documentation },
    overrideAccess: true,
  });
}

const components = [
  {
    name: "Button",
    slug: "button",
    description:
      "Триггер действия: варианты primary / outline / ghost, размеры sm–lg, состояние disabled.",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    docsUrl: "https://payloadcms.com/docs",
    documentation: [...buttonDocumentationSeedBase],
  },
  {
    name: "Input",
    slug: "input",
    description:
      "Текстовое поле с label, ошибкой и подсказкой; размеры sm–lg, invalid state.",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    docsUrl: "https://payloadcms.com/docs/getting-started/installation",
  },
];

const componentFolderBySlug: Record<string, string> = {
  button: "Actions",
  input: "Forms",
};

const colors = [
  { name: "Neutral 50", tokenKey: "color.neutral.50", hex: "#fafafa", sortOrder: 0 },
  { name: "Neutral 500", tokenKey: "color.neutral.500", hex: "#71717a", sortOrder: 1 },
  { name: "Neutral 900", tokenKey: "color.neutral.900", hex: "#18181b", sortOrder: 2 },
  { name: "Brand primary", tokenKey: "color.brand.primary", hex: "#2563eb", sortOrder: 3 },
  { name: "Accent", tokenKey: "color.accent", hex: "#f97316", sortOrder: 4 },
  { name: "Success", tokenKey: "color.semantic.success", hex: "#22c55e", sortOrder: 5 },
  { name: "Warning", tokenKey: "color.semantic.warning", hex: "#eab308", sortOrder: 6 },
  { name: "Danger", tokenKey: "color.semantic.danger", hex: "#ef4444", sortOrder: 7 },
];

const iconFileBySlug: Record<string, string> = {
  search: "search.svg",
  close: "close.svg",
  "chevron-right": "chevron-right.svg",
  user: "user.svg",
};

const icons = [
  {
    name: "Search",
    slug: "search",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Иконка поиска, 16–24px",
  },
  {
    name: "Close",
    slug: "close",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Закрытие модалок и тегов",
  },
  {
    name: "Chevron right",
    slug: "chevron-right",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Навигация, аккордеоны",
  },
  {
    name: "User",
    slug: "user",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Профиль, аватар-плейсхолдер",
  },
];

async function ensureIconMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  filename: string,
) {
  const alt = `Icon asset: ${slug}`;
  const found = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
    overrideAccess: true,
  });
  if (found.docs[0]) {
    return Number(found.docs[0].id);
  }
  const filePath = path.join(iconAssetsDir, filename);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    overrideAccess: true,
  });
  return Number(doc.id);
}

async function upsertComponent(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof components)[number],
  folderId?: number,
) {
  const found = await payload.find({
    collection: "components",
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  const dataWithFolder = {
    ...data,
    ...(folderId ? { folder: folderId } : {}),
  };
  if (doc) {
    await payload.update({
      collection: "components",
      id: doc.id,
      data: dataWithFolder,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "components",
      data: dataWithFolder,
      overrideAccess: true,
    });
  }
}

async function ensureComponentFolder(
  payload: Awaited<ReturnType<typeof getPayload>>,
  name: string,
): Promise<number> {
  const existing = await payload.find({
    collection: "payload-folders",
    limit: 100,
    overrideAccess: true,
  });

  const found = existing.docs.find(
    (doc: any) =>
      doc.name === name &&
      Array.isArray(doc.folderType) &&
      doc.folderType.includes("components") &&
      !doc.folder,
  );

  if (found) return Number(found.id);

  const created = await payload.create({
    collection: "payload-folders",
    data: {
      name,
      folderType: ["components"],
    },
    overrideAccess: true,
  });

  return Number(created.id);
}

type IconDoc = (typeof icons)[number] & { preview: number };

async function upsertIcon(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: IconDoc,
) {
  const found = await payload.find({
    collection: "icons",
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "icons",
      id: doc.id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "icons",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertFieldShowcaseDoc(payload: Awaited<ReturnType<typeof getPayload>>) {
  const title = "Все типы полей Payload (Data Fields)";
  const found = await payload.find({
    collection: "field-showcase",
    where: { title: { equals: title } },
    limit: 1,
    overrideAccess: true,
  });
  const firstColor = await payload.find({
    collection: "colors",
    limit: 1,
    sort: "sortOrder",
    overrideAccess: true,
  });
  const colorId = firstColor.docs[0] ? Number(firstColor.docs[0].id) : undefined;

  const data = {
    title,
    demoText: "Пример Text",
    demoTextarea: "Пример Textarea — несколько строк.",
    demoNumber: 42,
    demoCheckbox: true,
    demoEmail: "design-system@example.com",
    demoRadio: "b" as const,
    demoSelect: ["red", "blue"] as ("red" | "green" | "blue")[],
    demoCode: "const ok = true;",
    demoJson: { seeded: true, purpose: "поле type: json" },
    demoPoint: [37.6173, 55.7558] as [number, number],
    demoArray: [
      { label: "Первый элемент array", count: 1 },
      { label: "Второй", count: 2 },
    ],
    demoGroup: {
      groupTitle: "Заголовок group",
      groupNote: "Поля group лежат в объекте demoGroup.",
    },
    demoBlocks: [
      { blockType: "line" as const, key: "role", value: "demo" },
      { blockType: "tag" as const, label: "blocks-field" },
    ],
    tabMeta: { metaSlug: "field-showcase-demo" },
    tabMetrics: { score: 100 },
    ...(colorId ? { demoRelationship: colorId } : {}),
  };

  if (found.docs[0]) {
    await payload.update({
      collection: "field-showcase",
      id: found.docs[0].id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "field-showcase",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertColor(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof colors)[number],
) {
  const found = await payload.find({
    collection: "colors",
    where: { tokenKey: { equals: data.tokenKey } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "colors",
      id: doc.id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "colors",
      data,
      overrideAccess: true,
    });
  }
}

async function main() {
  if (!process.env.PAYLOAD_SECRET?.trim()) {
    console.error(`
Не задан PAYLOAD_SECRET — Payload не инициализируется.

Добавьте в корень проекта в файл .env или .env.local (см. .env.example):
  PAYLOAD_SECRET=<случайная строка не короче 32 символов>

Затем снова: npm run seed:portal
`);
    process.exit(1);
  }

  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "portal-sources",
    data: demoSources,
    overrideAccess: true,
  });

  const actionsFolderId = await ensureComponentFolder(payload, "Actions");
  const formsFolderId = await ensureComponentFolder(payload, "Forms");
  await ensureComponentFolder(payload, "Feedback");

  const folderIdByName: Record<string, number> = {
    Actions: actionsFolderId,
    Forms: formsFolderId,
  };

  for (const row of components) {
    const folderName = componentFolderBySlug[row.slug];
    const folderId = folderName ? folderIdByName[folderName] : undefined;
    await upsertComponent(payload, row, folderId);
  }

  for (const row of colors) {
    await upsertColor(payload, row);
  }

  await upsertFieldShowcaseDoc(payload);

  for (const row of icons) {
    const file = iconFileBySlug[row.slug];
    if (!file) {
      throw new Error(`No icon file mapped for slug: ${row.slug}`);
    }
    const preview = await ensureIconMedia(payload, row.slug, file);
    await upsertIcon(payload, { ...row, preview });
  }

  await finalizeButtonDocumentation(payload);

  console.log(
    "Seed OK: portal-sources, components×2, colors×8, icons×4, field-showcase×1 + SVG в Media.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
