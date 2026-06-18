import type { GlobalConfig } from "payload";

import { accessHasRole } from "@/lib/payload/access";

/** Тексты страницы /text/glossary (шапка и принципы выбора слов). */
export const TextGlossaryGlobal: GlobalConfig = {
  slug: "text-glossary",
  label: "Text · Глоссарий",
  admin: {
    group: "Text",
    description:
      "Заголовок, вводный текст и принципы на странице /text/glossary. Сами термины — коллекция «Глоссарий — термины».",
  },
  access: {
    read: () => true,
    update: accessHasRole(["admin", "pm", "designer"]),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Страница",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Заголовок",
              defaultValue: "Глоссарий",
            },
            {
              name: "intro",
              type: "textarea",
              label: "Вводный текст",
              defaultValue:
                "Слова, которые нужно использовать в общении с пользователями — в интерфейсе, в новостях и в разговоре с клиентами.",
            },
            {
              name: "principlesHeading",
              type: "text",
              label: "Заголовок блока принципов",
              defaultValue: "Как мы выбираем слова",
            },
            {
              name: "principles",
              type: "array",
              label: "Принципы",
              admin: {
                description: "Нумерованный список под заголовком «Как мы выбираем слова».",
              },
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  label: "Текст пункта",
                },
              ],
            },
            {
              name: "principlesFooter",
              type: "textarea",
              label: "Текст после списка принципов",
              defaultValue:
                "Из двух равнозначных слов и в спорных случаях транслитерации мы выбираем более распространённый вариант. Распространённость проверяем по словарям и, если это не помогло, по цитируемости в интернете. Например, мы пишем «Лендинг», а не «Лэндинг», потому что так пишут на порядок чаще.",
            },
            {
              name: "termsSectionHeading",
              type: "text",
              label: "Заголовок таблицы терминов",
              defaultValue: "Словарь",
              admin: {
                description: "Заголовок над таблицей терминов из коллекции.",
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "shareTitle",
              type: "text",
              label: "og:title",
              defaultValue: "Глоссарий",
            },
            {
              name: "shareDescription",
              type: "textarea",
              label: "og:description",
              defaultValue:
                "Слова для интерфейса и коммуникации с пользователями: что использовать и чего избегать.",
            },
          ],
        },
      ],
    },
  ],
};
