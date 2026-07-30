import type { CollectionConfig } from "payload";

import { documentationBlocksForColors } from "@/collections/componentDocumentationBlocks";
import { accessHasRole, accessIsAdmin } from "@/lib/payload/access";
import { isPortalDocumentationReadable } from "@/lib/payload/documentation-access";

export const ColorsCollection: CollectionConfig = {
  slug: "colors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "hex", "sortOrder"],
    description:
      "Цветовые токены / образцы палитры; вкладка «Документация» — те же 24 блока, что у components.",
  },
  access: {
    read: () => true,
    create: accessHasRole(["admin", "designer"]),
    update: accessHasRole(["admin", "designer"]),
    delete: accessIsAdmin,
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
              name: "tokenKey",
              type: "text",
              label: "Ключ в коде",
              admin: { description: "Например color.primary или palette.blue.500" },
            },
            {
              name: "hex",
              type: "text",
              required: true,
              label: "HEX",
              admin: { description: "#RRGGBB" },
            },
            {
              name: "sortOrder",
              type: "number",
              label: "Порядок сортировки",
              defaultValue: 0,
            },
            {
              name: "caption",
              type: "textarea",
              label: "Подпись",
            },
          ],
        },
        {
          label: "Документация",
          description:
            "Те же типы контент-блоков, что у components. Макет на портале — /colors/[id].",
          fields: [
            {
              name: "documentation",
              type: "blocks",
              label: "Контент со страницы",
              blocks: documentationBlocksForColors,
              access: {
                read: isPortalDocumentationReadable,
              },
              admin: {
                initCollapsed: false,
                description:
                  "8 типов блоков для документации цвета (секция, заметка, rich text, код, Do/Don't, ссылки, изображение, связанный цвет).",
              },
            },
          ],
        },
      ],
    },
  ],
};
