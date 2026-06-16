import type { Color, Component } from "@/payload-types";

import { defaultStorybookBaseUrl, storybookStoryUrl } from "@/lib/storybook/portal-preview-config";

export type ShowcaseContext = {
  color?: Color | null;
  mediaId?: number | null;
  relatedComponentIds?: number[];
};

/** Все 13 blockType для демо-страницы `/showcase/documentation-blocks`. */
export function buildDocumentationBlocksShowcase(
  ctx: ShowcaseContext = {},
): NonNullable<Component["documentation"]> {
  const storybookUrl = storybookStoryUrl(defaultStorybookBaseUrl(), "button", "Default");

  return [
    {
      blockType: "section",
      showLLM: true,
      heading: "When to use",
      body: "Пример секции с вводным текстом и списком вариантов.",
      items: [
        {
          label: "primary",
          description: "Главное действие.",
          accentColor: "#1677ff",
          labelAsBadge: true,
        },
        {
          label: "ghost",
          description: "Тихое действие.",
          accentColor: "#d9d9d9",
          labelAsBadge: true,
        },
      ],
    },
    {
      blockType: "propsTable",
      showLLM: true,
      title: "API Reference",
      subtitle: "Button Props",
      rows: [
        {
          name: "variant",
          type: '"primary" | "secondary"',
          defaultValue: '"primary"',
          description: "Визуальный стиль.",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Отключает взаимодействие.",
        },
      ],
    },
    {
      blockType: "codeExample",
      showLLM: true,
      title: "Default",
      previewStorybookUrl: storybookUrl,
      previewHeight: 220,
      defaultCollapsed: true,
      code: `import { Button } from "@next-app/ui-kit";

export function Default() {
  return <Button>Small</Button>;
}`,
    },
    {
      blockType: "doDont",
      showLLM: true,
      heading: "Use specific labels",
      intro: "Начинайте с глагола и указывайте, над чем выполняется действие.",
      dos: [{ text: "Используйте активные глаголы: «Удалить файл», «Сохранить»." }],
      donts: [{ text: "Не используйте «OK» / «Да» без контекста действия." }],
    },
    {
      blockType: "accessibility",
      showLLM: true,
      intro: "Соответствует паттерну кнопки WAI-ARIA.",
      patternLinkLabel: "Button pattern",
      patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
      keyboardRows: [
        { keys: "Enter", description: "Активирует кнопку." },
        { keys: "Space", description: "Активирует кнопку." },
      ],
    },
    {
      blockType: "relComponents",
      showLLM: true,
      title: "Related Components",
      components: ctx.relatedComponentIds ?? [],
    },
    {
      blockType: "designTokens",
      showLLM: true,
      title: "Design Token",
      groups: [
        {
          groupTitle: "Component Token",
          helpUrl: "https://payloadcms.com/docs",
          rows: [
            {
              name: "contentFontSize",
              description: "Размер текста кнопки",
              valueType: "number",
              defaultValue: "14",
            },
            {
              name: "dangerColor",
              description: "Текст danger-кнопки",
              valueType: "color",
              defaultValue: "#fff",
              swatchColor: "#ffffff",
            },
          ],
        },
      ],
    },
    {
      blockType: "changelog",
      showLLM: true,
      entries: [
        {
          version: "1.2.0",
          kind: "minor",
          changes: [{ text: "Добавлен variant ghost." }],
        },
        {
          version: "1.1.1",
          kind: "patch",
          changes: [{ text: "Исправлен focus ring в dark mode." }],
        },
      ],
    },
    {
      blockType: "anatomy",
      showLLM: true,
      title: "Anatomy",
      image: ctx.mediaId ?? 0,
      parts: [{ label: "Label" }, { label: "Container" }, { label: "Focus ring" }],
    },
    {
      blockType: "checklist",
      showLLM: true,
      title: "Design checklist",
      items: [
        {
          title: "Interactive states",
          description: "Hover, focus, disabled покрыты.",
          done: true,
        },
        {
          title: "Accessibility",
          description: "Контраст и keyboard.",
          done: false,
        },
      ],
    },
    {
      blockType: "resourceLinks",
      showLLM: true,
      links: [
        { label: "Figma", url: "https://www.figma.com/" },
        { label: "Storybook", url: "https://storybook.heroui.com/" },
        { label: "React Aria", url: "https://react-aria.adobe.com/Button" },
        { label: "Source", url: "https://github.com/heroui-inc/heroui" },
        { label: "Styles source", url: "https://github.com/heroui-inc/heroui" },
      ],
    },
    {
      blockType: "motion",
      showLLM: true,
      title: "Motion",
      intro: "Токены анимации компонента.",
      tokens: [
        {
          name: "motionEaseInOut",
          description: "Стандартная кривая.",
          value: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        },
        {
          name: "motionDurationFast",
          description: "Быстрые переходы.",
          value: "150ms",
          durationMs: 150,
        },
      ],
    },
  ];
}
