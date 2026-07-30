import type { CollectionConfig } from "payload";

import { documentationBlocksForComponents } from "@/collections/componentDocumentationBlocks";
import { accessHasRole, accessIsAdmin } from "@/lib/payload/access";
import {
  syncComponentDesignChecklistAfterRead,
  syncComponentDesignChecklistBeforeChange,
} from "@/lib/payload/component-design-checklist-hooks";
import { isPortalDocumentationReadable } from "@/lib/payload/documentation-access";
import {
  revalidatePortalComponentNavAfterChange,
  revalidatePortalComponentNavAfterDelete,
} from "@/lib/payload/portal-cache-hooks";

/** Демо-портал: карточка компонента + ссылки; вкладка с блоками документации (как в Notion / Uber Base). */
export const ComponentsCollection: CollectionConfig = {
  slug: "components",
  folders: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "status", "updatedAt"],
    description:
      "Карточка и ссылки; вкладка «Документация» — блоки для портала (визуал на сайте). Все типы полей Payload — коллекция «Справочник полей».",
  },
  access: {
    read: accessHasRole(["admin", "pm"]),
    create: accessHasRole(["admin", "pm"]),
    update: accessHasRole(["admin", "pm"]),
    delete: accessIsAdmin,
  },
  hooks: {
    beforeChange: [syncComponentDesignChecklistBeforeChange],
    afterRead: [syncComponentDesignChecklistAfterRead],
    afterChange: [revalidatePortalComponentNavAfterChange],
    afterDelete: [revalidatePortalComponentNavAfterDelete],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Карточка",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Название",
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              label: "Slug (URL)",
              admin: {
                description:
                  "Латиница, без пробелов — страница портала /components/[slug]",
              },
            },
            {
              name: "description",
              type: "textarea",
              label: "Краткое описание",
              admin: { description: "Лид под заголовком на портале." },
            },
            {
              name: "figmaUrl",
              type: "text",
              label: "Ссылка на Figma",
            },
            {
              name: "storybookUrl",
              type: "text",
              label: "Ссылка на Storybook",
            },
            {
              name: "relatedPreviewLight",
              type: "upload",
              relationTo: "media",
              label: "Превью Related (светлая тема)",
              admin: {
                description:
                  "Скриншот для карточек Related Components. Генерация: npm run capture:related-previews",
              },
            },
            {
              name: "relatedPreviewDark",
              type: "upload",
              relationTo: "media",
              label: "Превью Related (тёмная тема)",
              admin: {
                description:
                  "Скриншот для карточек Related Components в тёмной теме портала.",
              },
            },
            {
              name: "docsUrl",
              type: "text",
              label: "Документация (внешняя или внутренняя)",
            },
            {
              name: "status",
              type: "select",
              label: "Статус",
              defaultValue: "stable",
              options: [
                { label: "Stable", value: "stable" },
                { label: "Preview (beta)", value: "beta" },
                { label: "Deprecated", value: "deprecated" },
              ],
              admin: {
                description:
                  "Не заполнены обязательные поля карточки — запись не попадает на портал (черновик в CMS без отдельного статуса).",
              },
            },
            {
              name: "statusNote",
              type: "textarea",
              label: "Примечание к статусу",
              admin: {
                description: "Текст бейджа или предупреждения на портале.",
              },
            },
            {
              name: "parentComponent",
              type: "relationship",
              relationTo: "components",
              label: "Родительский компонент",
              admin: {
                description: "Вариант или часть семейства (отдельная страница-родитель).",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "subcomponents",
              type: "relationship",
              relationTo: "components",
              hasMany: true,
              label: "Состоит из",
              admin: {
                description: "Дочерние компоненты со своими страницами в портале.",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "relatedComponents",
              type: "relationship",
              relationTo: "components",
              hasMany: true,
              label: "Связанные компоненты",
              admin: {
                description: "Смежные компоненты (часто используют вместе).",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "replacedBy",
              type: "relationship",
              relationTo: "components",
              label: "Заменён на",
              admin: {
                description: "Для deprecated — куда перейти вместо этого компонента.",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "showTOC",
              type: "checkbox",
              label: "Показывать оглавление",
              defaultValue: true,
              admin: {
                position: "sidebar",
                description:
                  "Правая колонка «На этой странице». Список строится из заголовков H2 на странице.",
              },
            },
          ],
        },
        {
          label: "Design checklist",
          description:
            "Отметьте галочками выполненные требования. Все пункты подставляются автоматически из коллекции «Design checklist».",
          fields: [
            {
              name: "designChecklist",
              type: "array",
              label: "Статусы требований",
              labels: { singular: "Пункт", plural: "Пункты" },
              admin: {
                description:
                  "Список заполняется автоматически. Редактору нужно только включить «Выполнено».",
                initCollapsed: false,
                isSortable: false,
              },
              fields: [
                {
                  name: "item",
                  type: "relationship",
                  relationTo: "design-checklist-items",
                  required: true,
                  label: "Пункт",
                  admin: {
                    readOnly: true,
                    description: "Подставляется из справочника автоматически.",
                  },
                },
                {
                  name: "done",
                  type: "checkbox",
                  label: "Выполнено",
                  defaultValue: false,
                },
                {
                  name: "note",
                  type: "textarea",
                  label: "Комментарий",
                },
              ],
            },
          ],
        },
        {
          label: "Документация",
          description:
            "Здесь — только данные (формы). Красивый макет рисуется на портале /components/[slug]. Справочник по типам полей Payload — коллекция «Справочник полей».",
          fields: [
            {
              name: "documentation",
              type: "blocks",
              label: "Контент со страницы",
              blocks: documentationBlocksForComponents,
              access: {
                read: isPortalDocumentationReadable,
              },
              admin: {
                initCollapsed: false,
                description:
                  "13 типов контент-блоков (14-й слот — Markdown export на странице). Порядок = порядок на портале.",
              },
            },
          ],
        },
      ],
    },
  ],
};
