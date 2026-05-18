import type { Block } from "payload";

/**
 * Блоки вкладки «Документация» у коллекции `components`.
 * Набор покрывает типы полей Payload: text, textarea, number, checkbox, email, date,
 * radio, select, code, json, point, relationship, upload, richText, array, group,
 * blocks (вложенные), tabs (именованные).
 */
export const componentDocumentationBlocks: Block[] = [
  {
    slug: "section",
    labels: { singular: "Секция", plural: "Секции" },
    admin: { group: "Текст" },
    fields: [
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      { name: "body", type: "textarea", label: "Текст" },
    ],
  },
  {
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
  },
  {
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
  },
  {
    slug: "codeExample",
    labels: { singular: "Пример кода (textarea)", plural: "Примеры кода (textarea)" },
    admin: { group: "Код" },
    fields: [
      { name: "title", type: "text", label: "Подпись" },
      { name: "code", type: "textarea", required: true, label: "Код (TSX / JSX)" },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    slug: "calendarDate",
    labels: { singular: "Date", plural: "Даты" },
    admin: { group: "Данные" },
    fields: [
      { name: "title", type: "text", label: "Заголовок" },
      { name: "at", type: "date", label: "Дата / время" },
    ],
  },
  {
    slug: "emailLine",
    labels: { singular: "Email", plural: "Email" },
    admin: { group: "Текст" },
    fields: [
      { name: "label", type: "text", label: "Подпись" },
      { name: "address", type: "email", label: "Адрес" },
    ],
  },
  {
    slug: "numberStat",
    labels: { singular: "Number", plural: "Числа" },
    admin: { group: "Данные" },
    fields: [
      { name: "label", type: "text", label: "Метка" },
      { name: "value", type: "number", label: "Значение" },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    slug: "jsonBlock",
    labels: { singular: "JSON", plural: "JSON" },
    admin: { group: "Данные" },
    fields: [
      { name: "title", type: "text", label: "Заголовок" },
      { name: "payload", type: "json", label: "Произвольный JSON" },
    ],
  },
  {
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
  },
  {
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
          {
            slug: "nestLine",
            fields: [{ name: "line", type: "text", required: true, label: "Строка" }],
          },
        ],
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
    slug: "quote",
    labels: { singular: "Цитата", plural: "Цитаты" },
    admin: { group: "Текст" },
    fields: [
      { name: "body", type: "textarea", required: true, label: "Текст" },
      { name: "attribution", type: "text", label: "Автор / источник" },
    ],
  },
];
