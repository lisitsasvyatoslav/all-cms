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

/**
 * Все 24 блока вкладки «Документация» (полный набор для `components`).
 * Набор покрывает типы полей Payload: text, textarea, number, checkbox, email, date,
 * radio, select, code, json, point, relationship, upload, richText, array, group,
 * blocks (вложенные), tabs (именованные).
 */
const allDocumentationBlocks: Block[] = [
  withShowLLM({
    slug: "section",
    labels: { singular: "Секция", plural: "Секции" },
    admin: { group: "Текст" },
    fields: [
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      { name: "body", type: "textarea", label: "Текст" },
    ],
  }),
  withShowLLM({
    slug: "doDont",
    labels: { singular: "Do / Don't", plural: "Do / Don't" },
    admin: { group: "Руководство" },
    fields: [
      {
        name: "dos",
        type: "array",
        label: "Делайте",
        fields: [{ name: "text", type: "text", required: true }],
      },
      {
        name: "donts",
        type: "array",
        label: "Не делайте",
        fields: [{ name: "text", type: "text", required: true }],
      },
    ],
  }),
  withShowLLM({
    slug: "callout",
    labels: { singular: "Заметка", plural: "Заметки" },
    admin: { group: "Выделение" },
    fields: [
      {
        name: "tone",
        type: "select",
        required: true,
        defaultValue: "info",
        label: "Тон",
        options: [
          { label: "Инфо", value: "info" },
          { label: "Внимание", value: "warning" },
          { label: "Успех", value: "success" },
        ],
      },
      { name: "text", type: "textarea", required: true, label: "Текст" },
    ],
  }),
  withShowLLM({
    slug: "codeExample",
    labels: { singular: "Пример кода (textarea)", plural: "Примеры кода (textarea)" },
    admin: { group: "Код" },
    fields: [
      { name: "title", type: "text", label: "Подпись" },
      { name: "code", type: "textarea", required: true, label: "Код (TSX / JSX)" },
    ],
  }),
  withShowLLM({
    slug: "codeMonaco",
    labels: { singular: "Код (Monaco / поле Code)", plural: "Код Monaco" },
    admin: { group: "Код" },
    fields: [
      { name: "title", type: "text", label: "Подпись" },
      {
        name: "snippet",
        type: "code",
        required: true,
        label: "Код",
        admin: { language: "typescript" },
      },
    ],
  }),
  withShowLLM({
    slug: "richTextSection",
    labels: { singular: "Rich Text (Lexical)", plural: "Rich Text" },
    admin: { group: "Текст" },
    fields: [
      { name: "title", type: "text", label: "Заголовок блока" },
      {
        name: "body",
        type: "richText",
        label: "Текст с разметкой",
      },
    ],
  }),
  withShowLLM({
    slug: "propsTable",
    labels: { singular: "Таблица пропсов", plural: "Таблицы пропсов" },
    admin: { group: "API" },
    fields: [
      { name: "title", type: "text", label: "Заголовок над таблицей" },
      {
        name: "rows",
        type: "array",
        label: "Строки",
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
    slug: "resourceLinks",
    labels: { singular: "Ссылки (array)", plural: "Ссылки" },
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
    slug: "mediaFigure",
    labels: { singular: "Изображение (Upload)", plural: "Изображения" },
    admin: { group: "Ресурсы" },
    fields: [
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        required: true,
        label: "Файл из Media",
      },
      { name: "caption", type: "text", label: "Подпись" },
    ],
  }),
  withShowLLM({
    slug: "relColor",
    labels: { singular: "Связь → Color", plural: "Связи Color" },
    admin: { group: "Ресурсы" },
    fields: [
      {
        name: "color",
        type: "relationship",
        relationTo: "colors",
        label: "Цвет из палитры",
      },
    ],
  }),
  withShowLLM({
    slug: "relIcon",
    labels: { singular: "Связь → Icon", plural: "Связи Icon" },
    admin: { group: "Ресурсы" },
    fields: [
      {
        name: "icon",
        type: "relationship",
        relationTo: "icons",
        label: "Иконка",
      },
    ],
  }),
  withShowLLM({
    slug: "geoPoint",
    labels: { singular: "Point (координаты)", plural: "Point" },
    admin: { group: "Данные" },
    fields: [
      { name: "label", type: "text", label: "Подпись" },
      {
        name: "location",
        type: "point",
        label: "Точка на карте (lng, lat)",
      },
    ],
  }),
  withShowLLM({
    slug: "calendarDate",
    labels: { singular: "Date", plural: "Даты" },
    admin: { group: "Данные" },
    fields: [
      { name: "title", type: "text", label: "Заголовок" },
      { name: "at", type: "date", label: "Дата / время" },
    ],
  }),
  withShowLLM({
    slug: "emailLine",
    labels: { singular: "Email", plural: "Email" },
    admin: { group: "Текст" },
    fields: [
      { name: "label", type: "text", label: "Подпись" },
      { name: "address", type: "email", label: "Адрес" },
    ],
  }),
  withShowLLM({
    slug: "numberStat",
    labels: { singular: "Number", plural: "Числа" },
    admin: { group: "Данные" },
    fields: [
      { name: "label", type: "text", label: "Метка" },
      { name: "value", type: "number", label: "Значение" },
    ],
  }),
  withShowLLM({
    slug: "radioPick",
    labels: { singular: "Radio", plural: "Radio" },
    admin: { group: "Данные" },
    fields: [
      {
        name: "mode",
        type: "radio",
        label: "Режим",
        options: [
          { label: "Быстро", value: "fast" },
          { label: "Нормально", value: "normal" },
          { label: "Точно", value: "precise" },
        ],
        defaultValue: "normal",
      },
      { name: "hint", type: "textarea", label: "Пояснение" },
    ],
  }),
  withShowLLM({
    slug: "multiSelect",
    labels: { singular: "Select (несколько)", plural: "Multi-select" },
    admin: { group: "Данные" },
    fields: [
      {
        name: "tags",
        type: "select",
        hasMany: true,
        label: "Теги",
        options: [
          { label: "A11y", value: "a11y" },
          { label: "Forms", value: "forms" },
          { label: "Layout", value: "layout" },
          { label: "Motion", value: "motion" },
        ],
      },
      { name: "note", type: "textarea", label: "Заметка" },
    ],
  }),
  withShowLLM({
    slug: "flagBox",
    labels: { singular: "Checkbox", plural: "Checkbox" },
    admin: { group: "Данные" },
    fields: [
      {
        name: "enabled",
        type: "checkbox",
        label: "Включено",
        defaultValue: false,
      },
      { name: "flagLabel", type: "text", label: "Описание флага" },
    ],
  }),
  withShowLLM({
    slug: "jsonBlock",
    labels: { singular: "JSON", plural: "JSON" },
    admin: { group: "Данные" },
    fields: [
      { name: "title", type: "text", label: "Заголовок" },
      { name: "payload", type: "json", label: "Произвольный JSON" },
    ],
  }),
  withShowLLM({
    slug: "groupStrip",
    labels: { singular: "Group (вложенный объект)", plural: "Group" },
    admin: { group: "Композиция" },
    fields: [
      {
        name: "bundle",
        type: "group",
        label: "Пакет полей",
        fields: [
          { name: "gTitle", type: "text", label: "Название" },
          { name: "gCount", type: "number", label: "Счётчик" },
          { name: "gOn", type: "checkbox", label: "Активно", defaultValue: true },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "nestedStack",
    labels: { singular: "Blocks внутри блока", plural: "Вложенные blocks" },
    admin: { group: "Композиция" },
    fields: [
      { name: "intro", type: "textarea", label: "Вводный текст" },
      {
        name: "items",
        type: "blocks",
        label: "Вложенные строки",
        blocks: [
          withShowLLM({
            slug: "nestLine",
            fields: [{ name: "line", type: "text", required: true, label: "Строка" }],
          }),
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "namedTabsStrip",
    labels: { singular: "Tabs (именованные)", plural: "Именованные tabs" },
    admin: { group: "Композиция" },
    fields: [
      {
        type: "tabs",
        tabs: [
          {
            name: "tabSummary",
            label: "Кратко",
            interfaceName: "ComponentDocTabSummary",
            fields: [{ name: "brief", type: "textarea", label: "Кратко" }],
          },
          {
            name: "tabDetail",
            label: "Подробно",
            interfaceName: "ComponentDocTabDetail",
            fields: [{ name: "detail", type: "textarea", label: "Детали" }],
          },
        ],
      },
    ],
  }),
  withShowLLM({
    slug: "divider",
    labels: { singular: "Разделитель", plural: "Разделители" },
    admin: { group: "Текст" },
    fields: [
      {
        name: "caption",
        type: "text",
        label: "Подпись к линии (необязательно)",
      },
    ],
  }),
  withShowLLM({
    slug: "quote",
    labels: { singular: "Цитата", plural: "Цитаты" },
    admin: { group: "Текст" },
    fields: [
      { name: "body", type: "textarea", required: true, label: "Текст" },
      { name: "attribution", type: "text", label: "Автор / источник" },
    ],
  }),
  withShowLLM({
    slug: "storybookEmbed",
    labels: { singular: "Storybook (URL)", plural: "Storybook (URL)" },
    admin: { group: "Storybook" },
    fields: [
      {
        name: "title",
        type: "text",
        required: true,
        label: "Подпись на портале",
        defaultValue: "Превью",
      },
      {
        name: "storybookUrl",
        type: "text",
        required: true,
        label: "URL Storybook",
        admin: {
          description:
            "Ссылка на story с args, скопированная из Storybook. Пример: http://127.0.0.1:6006/?path=/story/design-system-button--default&args=variant:secondary;size:sm — не /docs/…",
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
];

/**
 * Подмножество блоков для коллекции `colors` (палитра / токены).
 * В админке в «Add Documentation» видны только эти 8 типов.
 */
export const COLORS_DOCUMENTATION_BLOCK_SLUGS = [
  "section",
  "callout",
  "richTextSection",
  "codeExample",
  "doDont",
  "resourceLinks",
  "mediaFigure",
  "relColor",
] as const;

export type ColorsDocumentationBlockSlug =
  (typeof COLORS_DOCUMENTATION_BLOCK_SLUGS)[number];

export function pickDocumentationBlocks(slugs: readonly string[]): Block[] {
  const bySlug = new Map(
    allDocumentationBlocks.map((block) => [block.slug, block]),
  );
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((block): block is Block => block != null);
}

/** Полный набор — коллекция `components`. */
export const documentationBlocksForComponents = allDocumentationBlocks;

/** 8 блоков — коллекция `colors`. */
export const documentationBlocksForColors = pickDocumentationBlocks(
  COLORS_DOCUMENTATION_BLOCK_SLUGS,
);
