import type { CollectionConfig } from "payload";

import { accessHasRole } from "@/lib/payload/access";
import { applyGlossaryTermLetter } from "@/lib/payload/glossary-term-letter";
import {
  revalidatePortalGlossaryTermsAfterChange,
  revalidatePortalGlossaryTermsAfterDelete,
} from "@/lib/payload/portal-cache-hooks";

/** Термины глоссария — /text/glossary и коллекция в Payload Admin. */
export const GlossaryTermsCollection: CollectionConfig = {
  slug: "glossary-terms",
  labels: {
    singular: "Термин",
    plural: "Глоссарий — термины",
  },
  admin: {
    useAsTitle: "preferred",
    group: "Text",
    defaultColumns: ["letter", "preferred", "avoid"],
    description:
      "Слова для интерфейса и коммуникации с пользователями. Список сгруппирован по букве (латиница, затем кириллица).",
    groupBy: true,
    pagination: {
      defaultLimit: 200,
      limits: [50, 100, 200],
    },
    components: {
      views: {
        list: {
          Component: "@/components/payload/glossary-terms-list-view#GlossaryTermsListView",
        },
      },
    },
  },
  access: {
    read: () => true,
    create: accessHasRole(["admin", "pm", "designer"]),
    update: accessHasRole(["admin", "pm", "designer"]),
    delete: accessHasRole(["admin"]),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data;
        return applyGlossaryTermLetter(data);
      },
    ],
    afterChange: [revalidatePortalGlossaryTermsAfterChange],
    afterDelete: [revalidatePortalGlossaryTermsAfterDelete],
  },
  fields: [
    {
      name: "preferred",
      type: "text",
      required: true,
      label: "Используем",
      admin: {
        description: "Правильное слово или формулировка для интерфейса и текстов.",
      },
    },
    {
      name: "avoid",
      type: "text",
      label: "Не используем",
      admin: {
        description: "Неправильные варианты через запятую — на портале показываются перечёркнутыми.",
      },
    },
    {
      name: "letter",
      type: "text",
      label: "Буква",
      index: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Первая буква «Используем» — для группировки (EN, затем RU).",
      },
    },
  ],
};
