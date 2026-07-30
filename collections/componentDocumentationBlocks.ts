import type { Block, Field } from "payload";

/** Флаг на каждом блоке: отдавать ли его в MCP (`listComponentsFull`) для LLM. */
const showLLMField: Field = {
  name: "showLLM",
  type: "checkbox",
  label: "showLLM",
  defaultValue: true,
  admin: {
    description:
      "Включено — блок попадает в ответ MCP для LLM. На портале блок показывается всегда.",
  },
};

function withShowLLM(block: Block): Block {
  return {
    ...block,
    fields: [showLLMField, ...(block.fields ?? [])],
  };
}

/** 13 типов blocks для `components` (слот №8 — Markdown export на уровне страницы, не block). */
export const COMPONENT_DOCUMENTATION_BLOCK_SLUGS = [
  "section",
  "propsTable",
  "storybookEmbed",
  "codeExample",
  "doDont",
  "accessibility",
  "relComponents",
  "designTokens",
  "changelog",
  "anatomy",
  "checklist",
  "resourceLinks",
  "motion",
] as const;

export type ComponentDocumentationBlockSlug =
  (typeof COMPONENT_DOCUMENTATION_BLOCK_SLUGS)[number];

const allDocumentationBlocks: Block[] = [
  withShowLLM({
    slug: "section",
    labels: { singular: "Описание / When to use", plural: "Секции" },
    admin: { group: "Контент" },
    fields: [
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      {
        name: "body",
        type: "textarea",
        label: "Вводный текст",
        admin: { description: "Абзац под заголовком (when to use, guidelines)." },
      },
      {
        name: "items",
        type: "array",
        label: "Список с иконками",
        labels: { singular: "Пункт", plural: "Пункты" },
        admin: {
          description: "Варианты, свойства или правила — с цветным маркером слева.",
        },
        fields: [
          { name: "label", type: "text", required: true, label: "Метка" },
          { name: "description", type: "textarea", label: "Описание" },
          {
            name: "accentColor",
            type: "text",
            label: "Цвет маркера (hex)",
            admin: { placeholder: "#1677ff" },
          },
          {
            name: "labelAsBadge",
            type: "checkbox",
            label: "Метка как badge (код)",
            defaultValue: false,
          },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "propsTable",
    labels: { singular: "Props / API table", plural: "Таблицы пропсов" },
    admin: { group: "API" },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Заголовок секции",
        defaultValue: "API Reference",
      },
      {
        name: "subtitle",
        type: "text",
        label: "Подзаголовок",
        admin: { description: "Например: Button Props, Modal.Content Props." },
      },
      {
        name: "rows",
        type: "array",
        label: "Пропсы",
        labels: { singular: "Проп", plural: "Пропсы" },
        fields: [
          { name: "name", type: "text", required: true, label: "Имя" },
          { name: "type", type: "text", required: true, label: "Тип" },
          { name: "defaultValue", type: "text", label: "По умолчанию" },
          { name: "description", type: "textarea", label: "Описание" },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "storybookEmbed",
    labels: { singular: "Live preview / Storybook", plural: "Storybook embed" },
    admin: { group: "Превью" },
    fields: [
      {
        name: "title",
        type: "text",
        required: true,
        label: "Подпись",
        defaultValue: "Превью",
      },
      {
        name: "storybookUrl",
        type: "text",
        required: true,
        label: "URL Storybook",
        admin: {
          description:
            "Story с args: ?path=/story/design-system-button--default&args=variant:secondary. Тема на портале синхронизируется с переключателем; чтобы зафиксировать — добавьте &globals=portalAppearance:dark или :light.",
        },
      },
      {
        name: "frameHeight",
        type: "number",
        label: "Высота iframe (px)",
        defaultValue: 280,
        min: 120,
        max: 800,
      },
    ],
  }),
  withShowLLM({
    slug: "codeExample",
    labels: { singular: "Code examples", plural: "Примеры кода" },
    admin: { group: "Код" },
    fields: [
      { name: "title", type: "text", label: "Заголовок секции", admin: { placeholder: "Sizes" } },
      {
        name: "previewStorybookUrl",
        type: "text",
        label: "Превью (URL Storybook, необяз.)",
        admin: { description: "Опциональный iframe над кодом — как на HeroUI. Тема синхронизируется с порталом." },
      },
      {
        name: "previewHeight",
        type: "number",
        label: "Высота превью (px)",
        defaultValue: 200,
        min: 80,
        max: 600,
      },
      {
        name: "code",
        type: "code",
        required: true,
        label: "Код",
        admin: { language: "typescript" },
      },
      {
        name: "defaultCollapsed",
        type: "checkbox",
        label: "Код свёрнут по умолчанию",
        defaultValue: true,
      },
    ],
  }),
  withShowLLM({
    slug: "doDont",
    labels: { singular: "Do / Don't", plural: "Do / Don't" },
    admin: { group: "Руководство" },
    fields: [
      { name: "heading", type: "text", label: "Заголовок" },
      { name: "intro", type: "textarea", label: "Вводный текст" },
      {
        name: "dos",
        type: "array",
        label: "Делайте",
        fields: [
          { name: "text", type: "textarea", required: true, label: "Текст" },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Скриншот (необяз.)",
          },
        ],
      },
      {
        name: "donts",
        type: "array",
        label: "Не делайте",
        fields: [
          { name: "text", type: "textarea", required: true, label: "Текст" },
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            label: "Скриншот (необяз.)",
          },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "accessibility",
    labels: { singular: "Accessibility", plural: "Accessibility" },
    admin: { group: "A11y" },
    fields: [
      {
        name: "intro",
        type: "textarea",
        label: "Вводный текст",
        admin: { description: "Например: соответствие WAI-ARIA Dialog pattern." },
      },
      {
        name: "patternLinkLabel",
        type: "text",
        label: "Текст ссылки на паттерн",
      },
      { name: "patternLinkUrl", type: "text", label: "URL паттерна (WAI-ARIA и т.д.)" },
      {
        name: "keyboardRows",
        type: "array",
        label: "Keyboard interactions",
        labels: { singular: "Строка", plural: "Строки" },
        fields: [
          { name: "keys", type: "text", required: true, label: "Клавиши" },
          { name: "description", type: "textarea", required: true, label: "Описание" },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "relComponents",
    labels: { singular: "Related components", plural: "Related components" },
    admin: { group: "Связи" },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Заголовок",
        defaultValue: "Related Components",
      },
      {
        name: "components",
        type: "relationship",
        relationTo: "components",
        hasMany: true,
        label: "Компоненты",
      },
    ],
  }),
  withShowLLM({
    slug: "designTokens",
    labels: { singular: "Design Tokens", plural: "Design Tokens" },
    admin: { group: "Токены" },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Заголовок",
        defaultValue: "Design Token",
      },
      {
        name: "groups",
        type: "array",
        label: "Группы токенов",
        labels: { singular: "Группа", plural: "Группы" },
        fields: [
          { name: "groupTitle", type: "text", required: true, label: "Название группы" },
          { name: "helpUrl", type: "text", label: "Ссылка «How to use?»" },
          {
            name: "rows",
            type: "array",
            label: "Токены",
            fields: [
              { name: "name", type: "text", required: true, label: "Token name" },
              { name: "description", type: "textarea", label: "Description" },
              {
                name: "valueType",
                type: "select",
                label: "Type",
                defaultValue: "string",
                options: [
                  { label: "string", value: "string" },
                  { label: "number", value: "number" },
                  { label: "color", value: "color" },
                ],
              },
              { name: "defaultValue", type: "text", label: "Default" },
              {
                name: "swatchColor",
                type: "text",
                label: "Цвет превью (hex)",
                admin: { condition: (_, siblingData) => siblingData?.valueType === "color" },
              },
            ],
          },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "changelog",
    labels: { singular: "Changelog", plural: "Changelog" },
    admin: { group: "История" },
    fields: [
      {
        name: "entries",
        type: "array",
        label: "Версии",
        labels: { singular: "Версия", plural: "Версии" },
        fields: [
          { name: "version", type: "text", required: true, label: "Версия" },
          {
            name: "kind",
            type: "select",
            label: "Тип",
            defaultValue: "patch",
            options: [
              { label: "Patch", value: "patch" },
              { label: "Minor", value: "minor" },
              { label: "Major", value: "major" },
            ],
          },
          {
            name: "changes",
            type: "array",
            label: "Изменения",
            fields: [{ name: "text", type: "text", required: true, label: "Пункт" }],
          },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "anatomy",
    labels: { singular: "Anatomy", plural: "Anatomy" },
    admin: { group: "Визуал" },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Заголовок",
        defaultValue: "Anatomy",
      },
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        required: true,
        label: "Диаграмма",
      },
      {
        name: "parts",
        type: "array",
        label: "Части",
        fields: [{ name: "label", type: "text", required: true, label: "Подпись" }],
      },
    ],
  }),
  withShowLLM({
    slug: "checklist",
    labels: { singular: "Design checklist", plural: "Design checklist" },
    admin: { group: "Чеклист" },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Заголовок",
        defaultValue: "Design checklist",
      },
      {
        name: "items",
        type: "array",
        label: "Пункты",
        fields: [
          { name: "title", type: "text", required: true, label: "Название" },
          { name: "description", type: "textarea", label: "Описание" },
          {
            name: "done",
            type: "checkbox",
            label: "Выполнено",
            defaultValue: false,
          },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "resourceLinks",
    labels: { singular: "Other source links", plural: "Ссылки" },
    admin: { group: "Ресурсы" },
    fields: [
      {
        name: "links",
        type: "array",
        label: "Список ссылок",
        labels: { singular: "Ссылка", plural: "Ссылки" },
        fields: [
          { name: "label", type: "text", required: true, label: "Текст" },
          { name: "url", type: "text", required: true, label: "URL" },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "motion",
    labels: { singular: "Motion", plural: "Motion" },
    admin: { group: "Motion" },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Заголовок",
        defaultValue: "Motion",
      },
      { name: "intro", type: "textarea", label: "Вводный текст" },
      {
        name: "tokens",
        type: "array",
        label: "Motion tokens",
        fields: [
          { name: "name", type: "text", required: true, label: "Имя" },
          { name: "description", type: "textarea", label: "Описание" },
          { name: "value", type: "text", required: true, label: "Значение (CSS)" },
          {
            name: "durationMs",
            type: "number",
            label: "Длительность (мс)",
            admin: { description: "Необязательно, для подписи в UI." },
          },
        ],
      },
    ],
  }),
];

function blockAdminSingularLabel(block: Block): string {
  const labels = block.labels;
  if (typeof labels === "string") return labels;
  if (labels && typeof labels === "object" && "singular" in labels) {
    const singular = labels.singular;
    if (typeof singular === "string") return singular;
  }
  return block.slug ?? "block";
}

const documentationBlockAdminLabels = new Map(
  allDocumentationBlocks.map((block) => [block.slug, blockAdminSingularLabel(block)]),
);

export function getDocumentationBlockAdminLabel(slug: string): string {
  return documentationBlockAdminLabels.get(slug) ?? slug;
}

export const COLORS_DOCUMENTATION_BLOCK_SLUGS = [
  "section",
  "doDont",
  "codeExample",
  "resourceLinks",
  "designTokens",
  "propsTable",
] as const satisfies readonly ComponentDocumentationBlockSlug[];

export type ColorsDocumentationBlockSlug =
  (typeof COLORS_DOCUMENTATION_BLOCK_SLUGS)[number];

export function pickDocumentationBlocks(slugs: readonly string[]): Block[] {
  const bySlug = new Map(allDocumentationBlocks.map((block) => [block.slug, block]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((block): block is Block => block != null);
}

export const documentationBlocksForComponents = allDocumentationBlocks;

export const documentationBlocksForColors = pickDocumentationBlocks(
  COLORS_DOCUMENTATION_BLOCK_SLUGS,
);
