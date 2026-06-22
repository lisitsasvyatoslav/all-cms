import type { Tab } from "payload";

const colorTokenFields = [
  { name: "name", type: "text" as const, required: true, label: "Название" },
  { name: "hex", type: "text" as const, required: true, label: "HEX" },
];

const hierarchyLevelFields = [
  { name: "title", type: "text" as const, label: "Название уровня" },
  { name: "description", type: "textarea" as const, label: "Описание" },
  {
    name: "tokens",
    type: "array" as const,
    label: "Токены",
    fields: colorTokenFields,
  },
];

/** Вкладка «Палитра» на странице brand-pages со slug color. */
export const brandColorPaletteTab: Tab = {
  label: "Палитра",
  admin: {
    condition: (_, siblingData) => siblingData?.slug === "color",
    description:
      "Иерархия цветов, семантика, градиенты и палитра для графиков — отображаются в секциях страницы /brand/color.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Иерархия",
          fields: [
            {
              name: "hierarchyBase",
              type: "group",
              label: "Base",
              fields: hierarchyLevelFields,
            },
            {
              name: "hierarchySemantic",
              type: "group",
              label: "Semantic",
              fields: hierarchyLevelFields,
            },
            {
              name: "hierarchyComponent",
              type: "group",
              label: "Component",
              fields: hierarchyLevelFields,
            },
            {
              name: "hierarchyMappings",
              type: "array",
              label: "Связи между уровнями",
              fields: [
                { name: "from", type: "text", required: true, label: "От" },
                { name: "to", type: "text", required: true, label: "К" },
              ],
            },
          ],
        },
        {
          label: "Семантика",
          fields: [
            {
              name: "semanticsSections",
              type: "array",
              label: "Разделы",
              fields: [
                { name: "title", type: "text", required: true, label: "Заголовок" },
                { name: "body", type: "textarea", required: true, label: "Текст" },
                {
                  name: "items",
                  type: "array",
                  label: "Пункты",
                  fields: [{ name: "text", type: "text", required: true, label: "Текст" }],
                },
              ],
            },
            {
              name: "semanticsNamingParts",
              type: "array",
              label: "Части имени токена",
              fields: [
                { name: "part", type: "text", required: true, label: "Часть" },
                { name: "required", type: "checkbox", label: "Обязательная", defaultValue: false },
                {
                  name: "examples",
                  type: "array",
                  label: "Примеры",
                  fields: [{ name: "text", type: "text", required: true, label: "Пример" }],
                },
              ],
            },
            {
              name: "semanticsExamples",
              type: "array",
              label: "Примеры токенов",
              fields: [
                { name: "token", type: "text", required: true, label: "Токен" },
                { name: "description", type: "text", required: true, label: "Описание" },
              ],
            },
          ],
        },
        {
          label: "Component tokens",
          fields: [
            {
              name: "componentTokensIntro",
              type: "array",
              label: "Вводные абзацы",
              fields: [{ name: "text", type: "textarea", required: true, label: "Текст" }],
            },
            {
              name: "componentTokensNamingParts",
              type: "array",
              label: "Части имени",
              fields: [
                { name: "part", type: "text", required: true, label: "Часть" },
                {
                  name: "examples",
                  type: "array",
                  label: "Примеры",
                  fields: [{ name: "text", type: "text", required: true, label: "Пример" }],
                },
              ],
            },
            {
              name: "componentTokensExamples",
              type: "array",
              label: "Примеры токенов",
              fields: [
                { name: "token", type: "text", required: true, label: "Токен" },
                { name: "description", type: "text", required: true, label: "Описание" },
              ],
            },
          ],
        },
        {
          label: "Градиенты",
          fields: [
            {
              name: "gradients",
              type: "array",
              label: "Градиенты",
              fields: [
                { name: "gradientId", type: "text", required: true, label: "ID" },
                { name: "title", type: "text", required: true, label: "Название" },
                {
                  name: "angle",
                  type: "number",
                  label: "Угол (градусы)",
                },
                {
                  name: "stops",
                  type: "array",
                  required: true,
                  label: "Стопы",
                  fields: [
                    { name: "hex", type: "text", required: true, label: "HEX" },
                    { name: "rgb", type: "text", required: true, label: "RGB (пробелы)" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Графики",
          fields: [
            {
              name: "chartPaletteLightLabel",
              type: "text",
              label: "Подпись светлой темы",
              defaultValue: "Светлая тема",
            },
            {
              name: "chartPaletteLight",
              type: "array",
              label: "Светлая тема",
              fields: [
                { name: "hex", type: "text", required: true, label: "HEX" },
                { name: "rgb", type: "text", required: true, label: "RGB" },
                { name: "name", type: "text", label: "Название (необяз.)" },
              ],
            },
            {
              name: "chartPaletteDarkLabel",
              type: "text",
              label: "Подпись тёмной темы",
              defaultValue: "Тёмная тема",
            },
            {
              name: "chartPaletteDark",
              type: "array",
              label: "Тёмная тема",
              fields: [
                { name: "hex", type: "text", required: true, label: "HEX" },
                { name: "rgb", type: "text", required: true, label: "RGB" },
                { name: "name", type: "text", label: "Название (необяз.)" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
