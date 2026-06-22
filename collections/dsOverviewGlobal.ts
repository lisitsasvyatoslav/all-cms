import type { GlobalConfig } from "payload";

import { accessHasRole } from "@/lib/payload/access";

const SOURCE_ICON_OPTIONS = [
  { label: "Figma", value: "figma" },
  { label: "GitHub", value: "github" },
  { label: "Storybook", value: "storybook" },
  { label: "Документация", value: "docs" },
  { label: "Markdown", value: "markdown" },
  { label: "Ссылка", value: "link" },
] as const;

/** Тексты главной страницы /ds (обзор и источники). */
export const DsOverviewGlobal: GlobalConfig = {
  slug: "ds-overview",
  label: "DS · Главная",
  admin: {
    group: "Design System",
    description: "Секции «Обзор» и «Источники» на странице /ds.",
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
          label: "Обзор",
          fields: [
            {
              name: "eyebrow",
              type: "text",
              label: "Надзаголовок",
              defaultValue: "Proof of Concept · внутренний прототип",
            },
            {
              name: "title",
              type: "text",
              label: "Заголовок",
              defaultValue: "Дизайн-система",
            },
            {
              name: "lead",
              type: "textarea",
              label: "Вводный текст",
              defaultValue:
                "Внутренний прототип портала документации дизайн-системы. Контент редактируется в Payload; компоненты и превью — на базе Radix Themes и Storybook. Данные на странице — демо для проверки архитектуры, не финальные продуктовые гайды.",
            },
            {
              name: "capabilitiesHeading",
              type: "text",
              label: "Заголовок «Что уже работает»",
              defaultValue: "Что уже работает",
            },
            {
              name: "capabilities",
              type: "array",
              label: "Что уже работает",
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  label: "Пункт",
                },
              ],
            },
            {
              name: "stackHeading",
              type: "text",
              label: "Заголовок стека",
              defaultValue: "Стек",
            },
            {
              name: "stackItems",
              type: "array",
              label: "Стек",
              fields: [
                {
                  name: "label",
                  type: "text",
                  required: true,
                  label: "Технология",
                },
              ],
            },
            {
              name: "navigationNote",
              type: "textarea",
              label: "Как пользоваться",
              defaultValue:
                "Навигация слева ведёт в каталог компонентов и справочник блоков документации. Для интерактивных превью запустите Storybook локально на порту 6006.",
            },
            {
              name: "roadmapHeading",
              type: "text",
              label: "Заголовок «Дальше»",
              defaultValue: "Дальше",
            },
            {
              name: "roadmap",
              type: "array",
              label: "Дальше",
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  label: "Пункт",
                },
              ],
            },
          ],
        },
        {
          label: "Источники",
          fields: [
            {
              name: "sourcesHeading",
              type: "text",
              label: "Заголовок",
              defaultValue: "Источники",
            },
            {
              name: "sourcesIntro",
              type: "textarea",
              label: "Вводный текст",
              defaultValue:
                "Ссылки на инструменты, с которыми работает команда. На этапе PoC часть URL — заглушки; замените их в Globals → «Ссылки на источники» или отредактируйте карточки ниже.",
            },
            {
              name: "sourceItems",
              type: "array",
              label: "Карточки источников",
              fields: [
                {
                  name: "label",
                  type: "text",
                  required: true,
                  label: "Название",
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Описание",
                },
                {
                  name: "href",
                  type: "text",
                  required: true,
                  label: "URL",
                },
                {
                  name: "icon",
                  type: "select",
                  label: "Иконка",
                  defaultValue: "link",
                  options: [...SOURCE_ICON_OPTIONS],
                },
                {
                  name: "external",
                  type: "checkbox",
                  label: "Открывать в новой вкладке",
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
