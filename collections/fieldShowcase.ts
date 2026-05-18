import type { Block, CollectionConfig } from "payload";

/** Минимальные блоки только для поля type: `blocks` в этой коллекции. */
const fieldShowcaseBlocks: Block[] = [
  {
    slug: "line",
    labels: { singular: "Строка KV", plural: "Строки KV" },
    fields: [
      { name: "key", type: "text", required: true, label: "Ключ" },
      { name: "value", type: "text", label: "Значение" },
    ],
  },
  {
    slug: "tag",
    labels: { singular: "Тег", plural: "Теги" },
    fields: [{ name: "label", type: "text", required: true, label: "Подпись" }],
  },
];

type AccessArgs = { req: { user?: unknown } };
const isLoggedIn = ({ req }: AccessArgs) => !!req.user;
const isAdmin = ({ req }: any) =>
  req.user?.role === "admin" || (!!req.user && !req.user.role);

/**
 * Демонстрация всех Data Fields из документации Payload (admin-only create/update).
 * https://payloadcms.com/docs/fields/overview
 */
export const FieldShowcaseCollection: CollectionConfig = {
  slug: "field-showcase",
  labels: { singular: "Справочник полей", plural: "Справочник полей" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
    description:
      "Один документ на команду: все типы полей данных Payload (array, blocks, checkbox, code, …) для ориентира в админке.",
    group: "Система",
  },
  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Название документа",
      defaultValue: "Все типы полей Payload (Data Fields)",
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Скаляры и редакторы",
          description:
            "Text, Textarea, Number, Checkbox, Email, Date, Radio, Select, Code, JSON, Point, Rich Text.",
          fields: [
            { name: "demoText", type: "text", label: "Text" },
            {
              name: "demoTextarea",
              type: "textarea",
              label: "Textarea",
              admin: { rows: 3 },
            },
            {
              name: "demoNumber",
              type: "number",
              label: "Number",
              admin: { step: 1 },
            },
            {
              name: "demoCheckbox",
              type: "checkbox",
              label: "Checkbox",
              defaultValue: false,
            },
            { name: "demoEmail", type: "email", label: "Email" },
            {
              name: "demoDate",
              type: "date",
              label: "Date",
              admin: { date: { pickerAppearance: "dayAndTime" } },
            },
            {
              name: "demoRadio",
              type: "radio",
              label: "Radio",
              options: [
                { label: "Вариант A", value: "a" },
                { label: "Вариант B", value: "b" },
              ],
              defaultValue: "a",
            },
            {
              name: "demoSelect",
              type: "select",
              label: "Select",
              hasMany: true,
              options: [
                { label: "Red", value: "red" },
                { label: "Green", value: "green" },
                { label: "Blue", value: "blue" },
              ],
            },
            {
              name: "demoCode",
              type: "code",
              label: "Code",
              admin: { language: "typescript" },
            },
            {
              name: "demoJson",
              type: "json",
              label: "JSON",
              defaultValue: { example: true, note: "редактор JSON в админке" },
            },
            {
              name: "demoPoint",
              type: "point",
              label: "Point (координаты)",
            },
            {
              name: "demoRichText",
              type: "richText",
              label: "Rich Text (Lexical из корня payload.config)",
            },
          ],
        },
        {
          label: "Связи и файлы",
          fields: [
            {
              name: "demoRelationship",
              type: "relationship",
              label: "Relationship → colors",
              relationTo: "colors",
            },
            {
              name: "demoUpload",
              type: "upload",
              label: "Upload → media",
              relationTo: "media",
            },
          ],
        },
        {
          label: "Структуры и именованные вкладки",
          description:
            "Array, Group, Blocks; внизу — Tabs (Named): у под-вкладок задано `name` — в API объекты tabMeta / tabMetrics на корне документа (рядом с demoArray и т.д.).",
          fields: [
            {
              name: "demoArray",
              type: "array",
              label: "Array",
              labels: { singular: "Элемент", plural: "Элементы" },
              fields: [
                { name: "label", type: "text", required: true, label: "Подпись" },
                { name: "count", type: "number", label: "Число" },
              ],
            },
            {
              name: "demoGroup",
              type: "group",
              label: "Group (объект в документе)",
              fields: [
                { name: "groupTitle", type: "text", label: "Заголовок группы" },
                { name: "groupNote", type: "textarea", label: "Заметка" },
              ],
            },
            {
              name: "demoBlocks",
              type: "blocks",
              label: "Blocks",
              blocks: fieldShowcaseBlocks,
            },
            {
              type: "tabs",
              tabs: [
                {
                  name: "tabMeta",
                  label: "Named tab: Meta",
                  interfaceName: "FieldShowcaseTabMeta",
                  fields: [
                    {
                      name: "metaSlug",
                      type: "text",
                      label: "Сохраняется в tabMeta.metaSlug",
                    },
                  ],
                },
                {
                  name: "tabMetrics",
                  label: "Named tab: Metrics",
                  interfaceName: "FieldShowcaseTabMetrics",
                  fields: [
                    {
                      name: "score",
                      type: "number",
                      label: "Сохраняется в tabMetrics.score",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
