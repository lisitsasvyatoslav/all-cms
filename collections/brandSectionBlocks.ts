import type { Block, Field } from "payload";

/** Вложенные блоки текста: подзаголовок, абзац, список. */
export const brandContentBlocksField: Field = {
  name: "blocks",
  type: "blocks",
  label: "Блоки контента",
  labels: { singular: "Блок", plural: "Блоки" },
  blocks: [
    {
      slug: "subheading",
      labels: { singular: "Подзаголовок", plural: "Подзаголовки" },
      fields: [{ name: "text", type: "text", required: true, label: "Текст" }],
    },
    {
      slug: "paragraph",
      labels: { singular: "Абзац", plural: "Абзацы" },
      fields: [{ name: "text", type: "textarea", required: true, label: "Текст" }],
    },
    {
      slug: "list",
      labels: { singular: "Список", plural: "Списки" },
      fields: [
        {
          name: "items",
          type: "array",
          label: "Пункты",
          labels: { singular: "Пункт", plural: "Пункты" },
          fields: [{ name: "text", type: "text", required: true, label: "Текст" }],
        },
      ],
    },
    {
      slug: "figure",
      labels: { singular: "Изображение", plural: "Изображения" },
      fields: [
        { name: "src", type: "text", required: true, label: "URL изображения" },
        { name: "alt", type: "text", required: true, label: "Alt-текст" },
      ],
    },
  ],
};

const typographyScaleRowFields: Field[] = [
  { name: "name", type: "text", required: true, label: "Название" },
  { name: "fontSize", type: "number", required: true, label: "Размер (px)" },
  { name: "lineHeight", type: "number", required: true, label: "Межстрочный (px)" },
  { name: "letterSpacing", type: "number", required: true, label: "Letter spacing" },
  { name: "weight", type: "number", required: true, label: "Weight" },
];

export const brandSectionBlocks: Block[] = [
  {
    slug: "contentBlocks",
    labels: { singular: "Текстовая секция", plural: "Текстовые секции" },
    fields: [
      {
        name: "sectionId",
        type: "text",
        required: true,
        label: "ID секции (якорь)",
        admin: { description: "Латиница и дефис, например logo-background." },
      },
      { name: "heading", type: "text", label: "Заголовок" },
      brandContentBlocksField,
    ],
  },
  {
    slug: "contentAccordion",
    labels: { singular: "Аккордеон", plural: "Аккордеоны" },
    fields: [
      {
        name: "sectionId",
        type: "text",
        label: "ID обёртки",
        admin: { description: "Необязательный якорь для всей секции." },
      },
      {
        name: "items",
        type: "array",
        required: true,
        label: "Пункты аккордеона",
        labels: { singular: "Пункт", plural: "Пункты" },
        fields: [
          {
            name: "anchorId",
            type: "text",
            required: true,
            label: "ID пункта (якорь)",
          },
          { name: "heading", type: "text", required: true, label: "Заголовок" },
          brandContentBlocksField,
        ],
      },
    ],
  },
  {
    slug: "typographyScale",
    labels: { singular: "Типографическая шкала", plural: "Типографические шкалы" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      {
        name: "groups",
        type: "array",
        required: true,
        label: "Группы",
        labels: { singular: "Группа", plural: "Группы" },
        fields: [
          { name: "groupId", type: "text", required: true, label: "ID группы" },
          { name: "title", type: "text", required: true, label: "Название" },
          {
            name: "rows",
            type: "array",
            required: true,
            label: "Стили",
            fields: typographyScaleRowFields,
          },
        ],
      },
    ],
  },
  {
    slug: "fontSetup",
    labels: { singular: "Подключение шрифта", plural: "Подключение шрифта" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      { name: "desktopLabel", type: "text", required: true, label: "Подпись десктоп-версии" },
      { name: "downloadHref", type: "text", required: true, label: "Ссылка на скачивание" },
      { name: "downloadLabel", type: "text", required: true, label: "Текст кнопки скачивания" },
      { name: "cssLabel", type: "text", required: true, label: "Подпись CSS-блока" },
      { name: "cssCode", type: "textarea", required: true, label: "CSS / HTML для подключения" },
    ],
  },
  {
    slug: "colorSystem",
    labels: { singular: "Система цвета", plural: "Система цвета" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
    ],
  },
  {
    slug: "colorGradients",
    labels: { singular: "Градиенты", plural: "Градиенты" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
    ],
  },
  {
    slug: "colorChartPalette",
    labels: { singular: "Палитра для графиков", plural: "Палитра для графиков" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
    ],
  },
  {
    slug: "logoBackgroundGrid",
    labels: { singular: "Сетка логотипов на фоне", plural: "Сетка логотипов на фоне" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      {
        name: "rules",
        type: "array",
        required: true,
        label: "Варианты",
        labels: { singular: "Вариант", plural: "Варианты" },
        fields: [
          { name: "label", type: "text", required: true, label: "Подпись" },
          {
            name: "surface",
            type: "select",
            required: true,
            label: "Фон",
            options: [
              { label: "Светлый", value: "light" },
              { label: "Тёмный", value: "dark" },
            ],
          },
          { name: "logoSrc", type: "text", required: true, label: "URL логотипа" },
        ],
      },
    ],
  },
  {
    slug: "logoClearspace",
    labels: { singular: "Охранные поля", plural: "Охранные поля" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      {
        name: "items",
        type: "array",
        required: true,
        label: "Пункты",
        labels: { singular: "Пункт", plural: "Пункты" },
        fields: [{ name: "text", type: "text", required: true, label: "Текст" }],
      },
    ],
  },
  {
    slug: "logoMisuseGrid",
    labels: { singular: "Запрещённые варианты", plural: "Запрещённые варианты" },
    fields: [
      { name: "sectionId", type: "text", required: true, label: "ID секции" },
      { name: "heading", type: "text", required: true, label: "Заголовок" },
      { name: "intro", type: "textarea", label: "Вводный текст" },
      {
        name: "items",
        type: "array",
        required: true,
        label: "Примеры",
        labels: { singular: "Пример", plural: "Примеры" },
        fields: [
          { name: "imageSrc", type: "text", required: true, label: "URL изображения" },
          { name: "text", type: "text", required: true, label: "Описание (после «Не»)" },
        ],
      },
    ],
  },
];
