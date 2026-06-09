/**
 * Заполняет демо-данные: 2 компонента, 8 цветов, 4 иконки (+ SVG в Media), глобальные ссылки, справочник field-showcase.
 * Запуск: `npm run seed:portal` (нужен `PAYLOAD_SECRET` в `.env` или `.env.local`, см. `.env.example`).
 */
import "./load-env.js";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";
import { componentDocsBySlug, type PropRow } from "../lib/component-docs";
import { storybookStoryUrl } from "../lib/storybook/portal-preview-config";

function propsTableRowsFromDoc(props: PropRow[]) {
  return props.map((row) => ({
    name: row.name,
    type: row.type,
    defaultValue: row.default ?? "—",
    description: row.description,
  }));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const iconAssetsDir = path.join(projectRoot, "public", "icon-assets");

const demoSources = {
  figmaLibraryUrl: "https://www.figma.com/community/file/1199125538294350451",
  storybookUrl: "https://storybook.js.org/showcase",
  documentationUrl: "https://payloadcms.com/docs",
  repositoryUrl: "https://github.com/payloadcms/payload",
};

const storybookBase =
  process.env.NEXT_PUBLIC_STORYBOOK_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:6006";

function storybookEmbedSeed(
  componentSlug: string,
  storyId: string,
  title: string,
  frameHeight: number,
  args?: string,
) {
  return {
    blockType: "storybookEmbed" as const,
    showLLM: false,
    title,
    storybookUrl: storybookStoryUrl(storybookBase, componentSlug, storyId, args),
    frameHeight,
  };
}

/** Превью на портале — блоки Storybook (URL), порядок = секция «Превью». */
const buttonStorybookPreviewSeed = [
  storybookEmbedSeed("button", "Default", "По умолчанию", 200),
  storybookEmbedSeed("button", "PortalSync", "Синхронизация", 130),
  storybookEmbedSeed("button", "Variants", "Варианты", 180),
  storybookEmbedSeed("button", "Sizes", "Размеры", 180),
  storybookEmbedSeed("button", "Disabled", "Disabled", 160),
];

const inputStorybookPreviewSeed = [
  storybookEmbedSeed("input", "Default", "По умолчанию", 200),
  storybookEmbedSeed("input", "WithLabel", "С label", 200),
  storybookEmbedSeed("input", "Sizes", "Размеры", 220),
  storybookEmbedSeed("input", "Invalid", "Ошибка", 200),
  storybookEmbedSeed("input", "Disabled", "Disabled", 160),
];

/** Документация Button — превью Storybook + контентные блоки. */
const buttonDocumentationSeed = [
  ...buttonStorybookPreviewSeed,
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "When to use",
    body: "Button — для явного действия в интерфейсе: отправка формы, подтверждение в модалке, запуск процесса. Текст кнопки должен отвечать на вопрос «что произойдёт?»",
    items: [
      {
        label: "primary",
        description: "Основное действие на экране.",
        accentColor: "#1677ff",
        labelAsBadge: true,
      },
      {
        label: "secondary",
        description: "Вторичное действие рядом с primary.",
        accentColor: "#f0f0f0",
        labelAsBadge: true,
      },
      {
        label: "outline",
        description: "Действие с меньшим визуальным весом.",
        accentColor: "#ffffff",
        labelAsBadge: true,
      },
      {
        label: "danger",
        description: "Деструктивное действие (удаление, отмена без сохранения).",
        accentColor: "#ff4d4f",
        labelAsBadge: true,
      },
    ],
  },
  {
    blockType: "doDont" as const,
    showLLM: true,
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
    blockType: "accessibility" as const,
    showLLM: true,
    intro: "Кнопка рендерится как нативный <button> с корректными ролями и состояниями disabled.",
    patternLinkLabel: "Button pattern (WAI-ARIA)",
    patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
    keyboardRows: [
      { keys: "Enter", description: "Активирует кнопку, когда фокус на элементе." },
      { keys: "Space", description: "Активирует кнопку (для нативного button)." },
      { keys: "Tab", description: "Перемещает фокус к следующему интерактивному элементу." },
    ],
  },
  {
    blockType: "propsTable" as const,
    showLLM: true,
    title: "API Reference",
    subtitle: "Button Props",
    rows: propsTableRowsFromDoc(componentDocsBySlug.button.props),
  },
  {
    blockType: "codeExample" as const,
    showLLM: true,
    title: "Sizes",
    previewStorybookUrl: storybookStoryUrl(storybookBase, "button", "Sizes"),
    previewHeight: 180,
    code: `import { Button } from "@/components/ds/button";

export function Sizes() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`,
  },
  {
    blockType: "motion" as const,
    showLLM: true,
    title: "Motion",
    intro: "Пресеты длительности и кривых для hover/focus состояний кнопки.",
    tokens: [
      {
        name: "motionDurationFast",
        description: "Быстрые микро-взаимодействия.",
        value: "150ms",
        durationMs: 150,
      },
      {
        name: "motionEaseInOut",
        description: "Стандартная кривая для фона и рамки.",
        value: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      },
    ],
  },
  {
    blockType: "resourceLinks" as const,
    showLLM: true,
    links: [
      { label: "Storybook", url: "https://storybook.js.org/docs" },
      { label: "Figma", url: "https://www.figma.com/design/" },
    ],
  },
];

const inputDocumentationSeed = [
  ...inputStorybookPreviewSeed,
  {
    blockType: "section" as const,
    heading: "Когда использовать",
    body: "Input — для ввода короткого текста: имя, email, поиск, число в одной строке. Всегда сопровождайте понятным label и при необходимости подсказкой или сообщением об ошибке.",
  },
  {
    blockType: "doDont" as const,
    dos: [
      { text: "Связывайте label с полем (for / aria-labelledby)." },
      { text: "Показывайте ошибку под полем и не полагайтесь только на цвет рамки." },
      { text: "Используйте placeholder как подсказку, а не как замену label." },
    ],
    donts: [
      { text: "Не используйте Input для длинного текста — для этого textarea." },
      { text: "Не прячьте обязательность поля: отметьте required в UI." },
    ],
  },
  {
    blockType: "codeExample" as const,
    title: "Default",
    code: `import { Input } from "@/components/ds/input";

<Input label="Email" type="email" placeholder="name@company.com" />`,
  },
];

const linkDocumentationSeed = [
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "Когда использовать",
    body: "Link — для навигации без побочного действия: переход на другую страницу, якорь, внешний URL. Не дублируйте кнопку, если не нужен акцент действия.",
  },
  {
    blockType: "doDont" as const,
    showLLM: true,
    dos: [
      { text: "Текст ссылки должен описывать цель («Документация», не «Подробнее» без контекста)." },
      { text: "Внешние ссылки помечайте визуально или через aria." },
    ],
    donts: [
      { text: "Не используйте Link для submit формы — для этого Button." },
    ],
  },
];

const badgeDocumentationSeed = [
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "Когда использовать",
    body: "Badge — компактная метка статуса, счётчика или категории. Не интерактивен; для действия используйте Button или Link.",
  },
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "Content guidelines",
    body: "Не заменяет Tag/Chip с удалением — Badge только отображает информацию.",
  },
];

const components = [
  {
    name: "Button",
    slug: "button",
    status: "stable" as const,
    description:
      "Триггер действия: варианты primary / outline / ghost, размеры sm–lg, состояние disabled.",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "http://127.0.0.1:6006/?path=/story/design-system-button--default",
    docsUrl: "https://payloadcms.com/docs",
    documentation: [...buttonDocumentationSeed],
  },
  {
    name: "Input",
    slug: "input",
    status: "stable" as const,
    description:
      "Текстовое поле с label, ошибкой и подсказкой; размеры sm–lg, invalid state.",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "http://127.0.0.1:6006/?path=/story/design-system-input--default",
    docsUrl: "https://payloadcms.com/docs/getting-started/installation",
    documentation: [...inputDocumentationSeed],
  },
  {
    name: "Link",
    slug: "link",
    status: "stable" as const,
    description:
      "Текстовая ссылка для навигации: внутренние маршруты и внешние URL, состояния hover/focus.",
    figmaUrl: "https://www.figma.com/design/",
    docsUrl: "https://payloadcms.com/docs",
    documentation: [...linkDocumentationSeed],
  },
  {
    name: "Badge",
    slug: "badge",
    status: "stable" as const,
    description:
      "Метка статуса или счётчика: варианты neutral / success / warning, компактный размер.",
    figmaUrl: "https://www.figma.com/design/",
    docsUrl: "https://payloadcms.com/docs",
    documentation: [...badgeDocumentationSeed],
  },
  {
    name: "Tabs",
    slug: "tabs",
    status: "stable" as const,
    description: "",
    documentation: [
      {
        blockType: "section" as const,
        heading: "Черновик",
        body: "Нет краткого описания — карточка скрыта на портале, пока не заполните обязательные поля.",
      },
    ],
  },
  {
    name: "Card",
    slug: "card",
    status: "beta" as const,
    statusNote: "API может измениться до релиза v1.",
    description:
      "Контейнер с заголовком и телом. Статус Preview — в сайдбаре бейдж Preview.",
    figmaUrl: "https://www.figma.com/design/",
    docsUrl: "https://payloadcms.com/docs",
    documentation: [
      {
        blockType: "section" as const,
        heading: "Preview",
        body: "Компонент в стадии preview: можно смотреть документацию, но контракт не зафиксирован.",
      },
      {
        blockType: "section" as const,
        heading: "When not to use",
        body: "Обратная совместимость не гарантируется до перевода в stable.",
      },
    ],
  },
  {
    name: "Legacy Chip",
    slug: "legacy-chip",
    status: "deprecated" as const,
    statusNote: "Удалим в v2.0. Используйте Badge вместо Legacy Chip.",
    description:
      "Устаревший чип. Статус Deprecated — бейдж в сайдбаре и замена на Badge.",
    docsUrl: "https://payloadcms.com/docs",
    documentation: [
      {
        blockType: "section" as const,
        heading: "Deprecated",
        body: "Не используйте в новых интерфейсах. Мигрируйте на Badge.",
      },
      {
        blockType: "section" as const,
        heading: "Migration",
        body: "Компонент будет удалён в следующем мажорном релизе. Используйте Badge.",
      },
    ],
  },
];

/** Связи по slug (применяются после создания всех записей). */
const componentRelationsBySlug: Record<
  string,
  {
    parentSlug?: string;
    subcomponentSlugs?: string[];
    relatedSlugs?: string[];
    replacedBySlug?: string;
  }
> = {
  button: {
    subcomponentSlugs: ["link"],
    relatedSlugs: ["input", "badge"],
  },
  input: {
    relatedSlugs: ["button"],
  },
  link: {
    parentSlug: "button",
    relatedSlugs: ["button", "input"],
  },
  badge: {
    relatedSlugs: ["button", "link", "legacy-chip"],
  },
  card: {
    relatedSlugs: ["button", "badge"],
  },
  "legacy-chip": {
    replacedBySlug: "badge",
    relatedSlugs: ["badge"],
  },
};

const componentFolderBySlug: Record<string, string> = {
  button: "Actions",
  input: "Forms",
  link: "Actions",
  badge: "Feedback",
  tabs: "Forms",
  card: "Feedback",
  "legacy-chip": "Feedback",
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
): Promise<number> {
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
    return Number(doc.id);
  }
  const created = await payload.create({
    collection: "components",
    data: dataWithFolder,
    overrideAccess: true,
  });
  return Number(created.id);
}

async function getComponentIdBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
): Promise<number | null> {
  const found = await payload.find({
    collection: "components",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  return doc ? Number(doc.id) : null;
}

async function applyComponentRelations(
  payload: Awaited<ReturnType<typeof getPayload>>,
) {
  for (const [slug, rel] of Object.entries(componentRelationsBySlug)) {
    const id = await getComponentIdBySlug(payload, slug);
    if (!id) continue;

    const parentId = rel.parentSlug
      ? await getComponentIdBySlug(payload, rel.parentSlug)
      : null;
    const subIds = rel.subcomponentSlugs
      ? (
          await Promise.all(
            rel.subcomponentSlugs.map((s) => getComponentIdBySlug(payload, s)),
          )
        ).filter((n): n is number => n != null)
      : [];
    const relatedIds = rel.relatedSlugs
      ? (
          await Promise.all(
            rel.relatedSlugs.map((s) => getComponentIdBySlug(payload, s)),
          )
        ).filter((n): n is number => n != null)
      : [];
    const replacedById = rel.replacedBySlug
      ? await getComponentIdBySlug(payload, rel.replacedBySlug)
      : null;

    await payload.update({
      collection: "components",
      id,
      data: {
        parentComponent: parentId,
        subcomponents: subIds,
        relatedComponents: relatedIds,
        replacedBy: replacedById,
      },
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
  const feedbackFolderId = await ensureComponentFolder(payload, "Feedback");

  const folderIdByName: Record<string, number> = {
    Actions: actionsFolderId,
    Forms: formsFolderId,
    Feedback: feedbackFolderId,
  };

  for (const row of components) {
    const folderName = componentFolderBySlug[row.slug];
    const folderId = folderName ? folderIdByName[folderName] : undefined;
    await upsertComponent(payload, row, folderId);
  }

  await applyComponentRelations(payload);

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

  console.log(
    "Seed OK: portal-sources, components×7, colors×8, icons×4, field-showcase×1 + SVG в Media.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
