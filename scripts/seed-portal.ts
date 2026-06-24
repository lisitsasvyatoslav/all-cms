/**
 * Заполняет демо-данные: 2 компонента, 8 цветов, 4 иконки (+ SVG в Media), глобальные ссылки, справочник field-showcase.
 * Запуск: `npm run seed:portal` (нужен `PAYLOAD_SECRET` в `.env` или `.env.local`, см. `.env.example`).
 */
import "./load-env.js";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";
import type { Component } from "../payload-types";
import {
  buildRadixComponentSeeds,
  codeSnippetDocumentationBlocks,
  componentFolderNameForSlug,
  propsTableRowsForSlug,
  RADIX_THEMES_CATALOG,
} from "../lib/portal/bootstrap";
import { COMPONENT_FOLDER_ORDER } from "../lib/portal/components/folders";
import { syncBrandPages } from "../lib/payload/sync-brand-pages";
import { syncDesignChecklistOnAllComponents } from "../lib/payload/sync-component-design-checklist";
import { syncDsOverview } from "../lib/payload/sync-ds-overview";
import { syncStorybookUrls } from "../lib/payload/sync-storybook-urls";
import { syncTextGlossary } from "../lib/payload/sync-text-glossary";
import { storybookStoryUrl } from "../lib/storybook/portal-preview-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const iconAssetsDir = path.join(projectRoot, "public", "icons", "ui");

const storybookBase =
  process.env.NEXT_PUBLIC_STORYBOOK_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:6006";

const demoSources = {
  figmaLibraryUrl: "https://www.figma.com/community/file/1199125538294350451",
  storybookUrl: storybookBase,
  documentationUrl: "https://payloadcms.com/docs",
  repositoryUrl: "https://github.com/payloadcms/payload",
};

const demoPortalSeo = {
  siteName: "Design System",
  titleDefault: "Design System · Portal",
  titleTemplate: "%s · Design System",
  defaultDescription: "Портал дизайн-системы: компоненты, документация, Storybook.",
  locale: "ru_RU",
  homeShareTitle: "Дизайн-система",
  homeShareDescription:
    "Портал дизайн-системы: компоненты, документация, Storybook и ссылки на источники.",
  catalogWebShareTitle: "Components",
  catalogWebShareDescription: "Каталог компонентов дизайн-системы для Web.",
  showcaseShareTitle: "Блоки документации",
  showcaseShareDescription:
    "Демо 13 блоков вкладки «Документация» коллекции components — как на реальной странице компонента.",
};

/** Общие пункты design checklist (коллекция design-checklist-items). */
const designChecklistItemSeeds = [
  {
    title: "Interactive states",
    description: "Hover, focus, active и disabled покрыты для всех variants.",
    category: "states" as const,
    sortOrder: 10,
  },
  {
    title: "Accessibility",
    description: "Контраст текста и focus ring соответствуют WCAG AA.",
    category: "accessibility" as const,
    sortOrder: 20,
  },
  {
    title: "Loading state",
    description: "Спиннер и aria-busy для асинхронных действий.",
    category: "states" as const,
    sortOrder: 30,
  },
  {
    title: "Icon + text",
    description: "Отступы и выравнивание при иконке слева или справа.",
    category: "layout" as const,
    sortOrder: 40,
  },
  {
    title: "Dark mode",
    description: "Токены и контраст проверены в тёмной теме портала.",
    category: "layout" as const,
    sortOrder: 50,
  },
  {
    title: "Keyboard navigation",
    description: "Фокус, Tab-порядок и горячие клавиши задокументированы.",
    category: "accessibility" as const,
    sortOrder: 60,
  },
];

/** Статусы checklist: slug компонента → title пункта → выполнено. */
const componentDesignChecklistByTitle: Record<string, Record<string, boolean>> = {
  button: {
    "Interactive states": true,
    Accessibility: true,
    "Loading state": false,
    "Icon + text": false,
  },
  input: {
    "Interactive states": true,
    Accessibility: true,
    "Keyboard navigation": true,
    "Dark mode": false,
  },
  link: {
    "Interactive states": true,
    Accessibility: true,
  },
  badge: {
    Accessibility: true,
    "Dark mode": true,
  },
};

function codeExamplePreviewSeed(
  componentSlug: string,
  storyId: string,
  title: string,
  previewHeight: number,
  code: string,
  args?: string,
) {
  return {
    blockType: "codeExample" as const,
    showLLM: false,
    title,
    previewStorybookUrl: storybookStoryUrl(storybookBase, componentSlug, storyId, args),
    previewHeight,
    defaultCollapsed: true,
    code,
  };
}

const buttonSizesCode = `import { Button } from "@next-app/ui-kit";

export function Sizes() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`;

/** Live preview + code — секция «Превью» на портале. */
const buttonLivePreviewSeed = [
  codeExamplePreviewSeed(
    "button",
    "Default",
    "По умолчанию",
    200,
    `import { Button } from "@next-app/ui-kit";

export function Default() {
  return <Button>Из Storybook ✓</Button>;
}`,
  ),
  codeExamplePreviewSeed(
    "button",
    "PortalSync",
    "Синхронизация",
    130,
    `import { Callout } from "@radix-ui/themes";

export function PortalSync() {
  return (
    <Callout.Root color="green">
      <Callout.Text>Портал синхронизирован со Storybook</Callout.Text>
    </Callout.Root>
  );
}`,
  ),
  codeExamplePreviewSeed(
    "button",
    "Variants",
    "Варианты",
    180,
    `import { Button } from "@next-app/ui-kit";

export function Variants() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}`,
  ),
  codeExamplePreviewSeed("button", "Sizes", "Размеры", 180, buttonSizesCode),
  codeExamplePreviewSeed(
    "button",
    "Disabled",
    "Disabled",
    160,
    `import { Button } from "@next-app/ui-kit";

export function Disabled() {
  return <Button disabled>Недоступна</Button>;
}`,
  ),
];

const inputLivePreviewSeed = [
  codeExamplePreviewSeed(
    "input",
    "Default",
    "По умолчанию",
    200,
    `import { Input } from "@next-app/ui-kit";

export function Default() {
  return <Input placeholder="Placeholder из Storybook ✓" />;
}`,
  ),
  codeExamplePreviewSeed(
    "input",
    "WithLabel",
    "С label",
    200,
    `import { Flex, Text, TextField } from "@radix-ui/themes";

export function WithLabel() {
  return (
    <Flex direction="column" gap="1">
      <Text as="label" size="2" weight="medium">Email</Text>
      <TextField.Root type="email" placeholder="name@company.com" size="2" />
    </Flex>
  );
}`,
  ),
  codeExamplePreviewSeed(
    "input",
    "Sizes",
    "Размеры",
    220,
    `import { Input } from "@next-app/ui-kit";

export function Sizes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  );
}`,
  ),
  codeExamplePreviewSeed(
    "input",
    "Invalid",
    "Ошибка",
    200,
    `import { Input } from "@next-app/ui-kit";

export function Invalid() {
  return <Input invalid placeholder="Некорректные данные" defaultValue="???" />;
}`,
  ),
  codeExamplePreviewSeed(
    "input",
    "Disabled",
    "Disabled",
    160,
    `import { Input } from "@next-app/ui-kit";

export function Disabled() {
  return <Input disabled placeholder="Только чтение" />;
}`,
  ),
];

function defaultStorybookUrl(componentSlug: string) {
  return storybookStoryUrl(storybookBase, componentSlug, "Default");
}

const linkLivePreviewSeed = [
  codeExamplePreviewSeed(
    "link",
    "Default",
    "По умолчанию",
    120,
    `import { Link } from "@next-app/ui-kit";

export function Default() {
  return <Link href="#">Документация</Link>;
}`,
  ),
  codeExamplePreviewSeed(
    "link",
    "Variants",
    "Варианты",
    120,
    `import { Link } from "@next-app/ui-kit";

export function Variants() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Link href="#">Внутренняя</Link>
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">Внешняя ↗</Link>
    </div>
  );
}`,
  ),
];

const badgeLivePreviewSeed = [
  codeExamplePreviewSeed(
    "badge",
    "Default",
    "По умолчанию",
    120,
    `import { Badge } from "@next-app/ui-kit";

export function Default() {
  return <Badge>Stable</Badge>;
}`,
  ),
  codeExamplePreviewSeed(
    "badge",
    "Variants",
    "Варианты",
    140,
    `import { Badge } from "@next-app/ui-kit";

export function Variants() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge badgeVariant="neutral">Neutral</Badge>
      <Badge badgeVariant="success">Success</Badge>
      <Badge badgeVariant="warning">Warning</Badge>
    </div>
  );
}`,
  ),
];

const cardLivePreviewSeed = [
  codeExamplePreviewSeed(
    "card",
    "Default",
    "По умолчанию",
    220,
    `import { Button } from "@next-app/ui-kit";
import { Card } from "@next-app/ui-kit";

export function Default() {
  return (
    <Card title="Заголовок" description="Краткое описание карточки.">
      <Button size="2">Действие</Button>
    </Card>
  );
}`,
  ),
];

const legacyChipLivePreviewSeed = [
  codeExamplePreviewSeed(
    "legacy-chip",
    "Default",
    "По умолчанию",
    120,
    `import { LegacyChip } from "@next-app/ui-kit";

export function Default() {
  return <LegacyChip>Legacy</LegacyChip>;
}`,
  ),
  codeExamplePreviewSeed(
    "legacy-chip",
    "Group",
    "Группа",
    140,
    `import { LegacyChip } from "@next-app/ui-kit";

export function Group() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <LegacyChip>Alpha</LegacyChip>
      <LegacyChip>Beta</LegacyChip>
    </div>
  );
}`,
  ),
];

/** Все 13 blockType для Button (слот Markdown export — на уровне страницы). */
function buildButtonDocumentation(options: {
  anatomyImageId: number;
  relatedComponentIds: number[];
}) {
  const { anatomyImageId, relatedComponentIds } = options;

  return [
    ...buttonLivePreviewSeed,
    {
      blockType: "section" as const,
      showLLM: true,
      heading: "When to use",
      body: "Button — для явного действия в интерфейсе: отправка формы, подтверждение в модалке, запуск процесса. Текст кнопки должен отвечать на вопрос «что произойдёт?»",
      items: [
        {
          label: "primary",
          description: "Основное действие на экране.",
          accentColor: "#1677ff",
          labelAsBadge: true,
        },
        {
          label: "secondary",
          description: "Вторичное действие рядом с primary.",
          accentColor: "#f0f0f0",
          labelAsBadge: true,
        },
        {
          label: "outline",
          description: "Действие с меньшим визуальным весом.",
          accentColor: "#ffffff",
          labelAsBadge: true,
        },
        {
          label: "danger",
          description: "Деструктивное действие (удаление, отмена без сохранения).",
          accentColor: "#ff4d4f",
          labelAsBadge: true,
        },
      ],
    },
    {
      blockType: "doDont" as const,
      showLLM: true,
      heading: "Use specific labels",
      intro: "Начинайте с глагола и указывайте, над чем выполняется действие.",
      dos: [
        { text: "Один основной (primary) акцент на логический экран или модалку." },
        { text: "Используйте глагол: «Сохранить», «Отправить», а не «OK»." },
        { text: "Для destructive-действий используйте variant danger и явный текст." },
      ],
      donts: [
        { text: "Не ставьте две primary-кнопки рядом без приоритета." },
        { text: "Не маскируйте навигацию между страницами как button, если достаточно ссылки." },
      ],
    },
    {
      blockType: "propsTable" as const,
      showLLM: true,
      title: "API Reference",
      subtitle: "Button Props",
      rows: propsTableRowsForSlug("button"),
    },
    {
      blockType: "accessibility" as const,
      showLLM: true,
      intro: "Кнопка рендерится как нативный <button> с корректными ролями и состояниями disabled.",
      patternLinkLabel: "Button pattern (WAI-ARIA)",
      patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
      keyboardRows: [
        { keys: "Enter", description: "Активирует кнопку, когда фокус на элементе." },
        { keys: "Space", description: "Активирует кнопку (для нативного button)." },
        { keys: "Tab", description: "Перемещает фокус к следующему интерактивному элементу." },
      ],
    },
    {
      blockType: "relComponents" as const,
      showLLM: true,
      title: "Related Components",
      components: relatedComponentIds,
    },
    {
      blockType: "designTokens" as const,
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
              valueType: "number" as const,
              defaultValue: "14",
            },
            {
              name: "contentLineHeight",
              description: "Межстрочный интервал подписи",
              valueType: "number" as const,
              defaultValue: "1.5",
            },
            {
              name: "primaryColor",
              description: "Фон primary-кнопки",
              valueType: "color" as const,
              defaultValue: "#1677ff",
              swatchColor: "#1677ff",
            },
            {
              name: "dangerColor",
              description: "Фон danger-кнопки",
              valueType: "color" as const,
              defaultValue: "#ff4d4f",
              swatchColor: "#ff4d4f",
            },
          ],
        },
        {
          groupTitle: "Global Token",
          rows: [
            {
              name: "borderRadius",
              description: "Скругление контейнера",
              valueType: "number" as const,
              defaultValue: "6",
            },
            {
              name: "motionDurationFast",
              description: "Длительность hover/focus",
              valueType: "string" as const,
              defaultValue: "150ms",
            },
          ],
        },
      ],
    },
    {
      blockType: "changelog" as const,
      showLLM: true,
      entries: [
        {
          version: "1.2.0",
          kind: "minor" as const,
          changes: [
            { text: "Добавлен variant ghost." },
            { text: "Уточнены токены focus ring в dark mode." },
          ],
        },
        {
          version: "1.1.0",
          kind: "minor" as const,
          changes: [{ text: "Размеры sm / md / lg выровнены с формами." }],
        },
        {
          version: "1.0.1",
          kind: "patch" as const,
          changes: [{ text: "Исправлен disabled state для type=submit." }],
        },
      ],
    },
    {
      blockType: "anatomy" as const,
      showLLM: true,
      title: "Anatomy",
      image: anatomyImageId,
      parts: [
        { label: "Label" },
        { label: "Container" },
        { label: "Focus ring" },
        { label: "Icon slot (optional)" },
      ],
    },
    {
      blockType: "resourceLinks" as const,
      showLLM: true,
      links: [
        { label: "Figma", url: "https://www.figma.com/design/" },
        { label: "Storybook", url: "https://storybook.js.org/docs" },
        { label: "React Aria", url: "https://react-aria.adobe.com/Button" },
        { label: "Source", url: "https://github.com/" },
        { label: "Styles source", url: "https://github.com/" },
      ],
    },
    {
      blockType: "motion" as const,
      showLLM: true,
      title: "Motion",
      intro: "Пресеты длительности и кривых для hover/focus состояний кнопки.",
      tokens: [
        {
          name: "motionDurationFast",
          description: "Быстрые микро-взаимодействия.",
          value: "150ms",
          durationMs: 150,
        },
        {
          name: "motionEaseInOut",
          description: "Стандартная кривая для фона и рамки.",
          value: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        },
      ],
    },
    ...codeSnippetDocumentationBlocks("button"),
  ];
}

const checkboxLivePreviewSeed = [
  codeExamplePreviewSeed(
    "checkbox",
    "Default",
    "По умолчанию",
    160,
    `import { Checkbox } from "@next-app/ui-kit";

export function Default() {
  return <Checkbox label="Согласен с условиями" defaultChecked />;
}`,
  ),
  codeExamplePreviewSeed(
    "checkbox",
    "Group",
    "Группа",
    220,
    `import { Checkbox } from "@next-app/ui-kit";
import { Flex } from "@radix-ui/themes";

export function Group() {
  return (
    <Flex direction="column" gap="2">
      <Checkbox label="Email-уведомления" defaultChecked />
      <Checkbox label="Push-уведомления" />
      <Checkbox label="SMS" disabled />
    </Flex>
  );
}`,
  ),
];

const modalLivePreviewSeed = [
  codeExamplePreviewSeed(
    "modal",
    "Default",
    "С триггером",
    240,
    `import { Button } from "@radix-ui/themes";
import { Modal } from "@next-app/ui-kit";

export function Default() {
  return (
    <Modal
      title="Удалить файл?"
      description="Действие нельзя отменить."
      trigger={<Button>Открыть modal</Button>}
    />
  );
}`,
  ),
  codeExamplePreviewSeed(
    "modal",
    "RelatedPreview",
    "Открытый кадр",
    320,
    `import { Modal } from "@next-app/ui-kit";

export function OpenPreview() {
  return (
    <Modal
      open
      title="Modal"
      description="Подтверждение действия без ухода со страницы."
    />
  );
}`,
  ),
];

const alertLivePreviewSeed = [
  codeExamplePreviewSeed(
    "alert",
    "Default",
    "По умолчанию",
    180,
    `import { Alert } from "@next-app/ui-kit";

export function Default() {
  return (
    <Alert alertVariant="info" title="Информация">
      Изменения сохранены и появятся после обновления страницы.
    </Alert>
  );
}`,
  ),
  codeExamplePreviewSeed(
    "alert",
    "Variants",
    "Варианты",
    360,
    `import { Alert } from "@next-app/ui-kit";
import { Flex } from "@radix-ui/themes";

export function Variants() {
  return (
    <Flex direction="column" gap="3" width="360px">
      <Alert alertVariant="info" title="Info">Справочное сообщение.</Alert>
      <Alert alertVariant="success" title="Success">Операция выполнена.</Alert>
      <Alert alertVariant="warning" title="Warning">Проверьте данные.</Alert>
      <Alert alertVariant="error" title="Error">Не удалось сохранить.</Alert>
    </Flex>
  );
}`,
  ),
];

function relComponentsDocumentationBlock(relatedComponentIds: number[]) {
  return {
    blockType: "relComponents" as const,
    showLLM: true,
    title: "Related Components",
    components: relatedComponentIds,
  };
}

function buildInputDocumentation(relatedComponentIds: number[]) {
  return [
    ...inputLivePreviewSeed,
    {
      blockType: "section" as const,
      showLLM: true,
      heading: "Когда использовать",
      body: "Input — для ввода короткого текста: имя, email, поиск, число в одной строке. Всегда сопровождайте понятным label и при необходимости подсказкой или сообщением об ошибке.",
    },
    {
      blockType: "doDont" as const,
      showLLM: true,
      heading: "Подписи и ошибки",
      dos: [
        { text: "Связывайте label с полем (for / aria-labelledby)." },
        { text: "Показывайте ошибку под полем и не полагайтесь только на цвет рамки." },
        { text: "Используйте placeholder как подсказку, а не как замену label." },
      ],
      donts: [
        { text: "Не используйте Input для длинного текста — для этого textarea." },
        { text: "Не прячьте обязательность поля: отметьте required в UI." },
      ],
    },
    {
      blockType: "propsTable" as const,
      showLLM: true,
      title: "API Reference",
      subtitle: "Input Props",
      rows: propsTableRowsForSlug("input"),
    },
    {
      blockType: "accessibility" as const,
      showLLM: true,
      intro: "Поле рендерится как нативный <input> с aria-invalid при ошибке и корректной связью с label.",
      patternLinkLabel: "Textbox pattern (WAI-ARIA)",
      patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/textbox/",
      keyboardRows: [
        { keys: "Tab", description: "Перемещает фокус к полю и дальше по форме." },
        { keys: "Shift + Tab", description: "Возвращает фокус к предыдущему элементу." },
      ],
    },
    relComponentsDocumentationBlock(relatedComponentIds),
    ...codeSnippetDocumentationBlocks("input"),
  ];
}

function buildCheckboxDocumentation(relatedComponentIds: number[]) {
  return [
    ...checkboxLivePreviewSeed,
    {
      blockType: "section" as const,
      showLLM: true,
      heading: "Когда использовать",
      body: "Checkbox — для булева выбора или группы независимых опций: согласия, фильтры, настройки уведомлений.",
    },
    {
      blockType: "doDont" as const,
      showLLM: true,
      heading: "Подписи и группировка",
      dos: [
        { text: "Используйте понятный label справа от флажка." },
        { text: "Группируйте связанные опции вертикально с равными отступами." },
        { text: "Для взаимоисключающего выбора используйте Radio Group, не Checkbox." },
      ],
      donts: [
        { text: "Не используйте Checkbox для включения/выключения всей страницы — для этого Switch." },
        { text: "Не меняйте состояние без явного действия пользователя." },
      ],
    },
    {
      blockType: "propsTable" as const,
      showLLM: true,
      title: "API Reference",
      subtitle: "Checkbox Props",
      rows: [
        {
          name: "label",
          type: "string",
          defaultValue: "—",
          description: "Подпись рядом с флажком.",
        },
        {
          name: "defaultChecked",
          type: "boolean",
          defaultValue: "—",
          description: "Начальное состояние (uncontrolled).",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "—",
          description: "Блокирует взаимодействие.",
        },
        {
          name: "...rest",
          type: "Radix Checkbox props",
          defaultValue: "—",
          description: "checked, onCheckedChange и прочие атрибуты Radix.",
        },
      ],
    },
    {
      blockType: "accessibility" as const,
      showLLM: true,
      intro: "Флажок — нативный input type=checkbox с видимым label и состоянием checked.",
      patternLinkLabel: "Checkbox pattern (WAI-ARIA)",
      patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
      keyboardRows: [
        { keys: "Space", description: "Переключает состояние, когда фокус на чекбоксе." },
        { keys: "Tab", description: "Переход к следующему элементу формы." },
      ],
    },
    relComponentsDocumentationBlock(relatedComponentIds),
  ];
}

function buildModalDocumentation(relatedComponentIds: number[]) {
  return [
    ...modalLivePreviewSeed,
    {
      blockType: "section" as const,
      showLLM: true,
      heading: "Когда использовать",
      body: "Modal — для подтверждения, коротких форм и деталей без ухода со страницы. Блокирует фон и возвращает фокус после закрытия.",
    },
    {
      blockType: "doDont" as const,
      showLLM: true,
      heading: "Фокус и действия",
      dos: [
        { text: "Дайте заголовок, отражающий решение («Удалить файл?»)." },
        { text: "Primary-действие справа, отмена — слева или soft-кнопка." },
        { text: "Закрытие по Esc и явная кнопка «Отмена»." },
      ],
      donts: [
        { text: "Не вкладывайте modal в modal." },
        { text: "Не используйте modal для длинного контента без прокрутки." },
      ],
    },
    {
      blockType: "propsTable" as const,
      showLLM: true,
      title: "API Reference",
      subtitle: "Modal Props",
      rows: [
        {
          name: "open",
          type: "boolean",
          defaultValue: "—",
          description: "Принудительно открытый диалог (превью, демо).",
        },
        {
          name: "title",
          type: "ReactNode",
          defaultValue: "—",
          description: "Заголовок в Dialog.Title.",
        },
        {
          name: "description",
          type: "ReactNode",
          defaultValue: "—",
          description: "Подзаголовок / пояснение.",
        },
        {
          name: "trigger",
          type: "ReactNode",
          defaultValue: "—",
          description: "Элемент, открывающий диалог (Dialog.Trigger).",
        },
        {
          name: "children",
          type: "ReactNode",
          defaultValue: "—",
          description: "Дополнительное содержимое между описанием и футером.",
        },
      ],
    },
    {
      blockType: "accessibility" as const,
      showLLM: true,
      intro: "Диалог на Radix Dialog: фокус-ловушка, aria-modal, возврат фокуса на trigger.",
      patternLinkLabel: "Dialog pattern (WAI-ARIA)",
      patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
      keyboardRows: [
        { keys: "Esc", description: "Закрывает диалог." },
        { keys: "Tab", description: "Циклически перемещает фокус внутри модалки." },
      ],
    },
    relComponentsDocumentationBlock(relatedComponentIds),
  ];
}

function buildAlertDocumentation(relatedComponentIds: number[]) {
  return [
    ...alertLivePreviewSeed,
    {
      blockType: "section" as const,
      showLLM: true,
      heading: "Когда использовать",
      body: "Alert — инлайн-сообщение о статусе операции: info, success, warning, error. Не перекрывает интерфейс, в отличие от toast или modal.",
    },
    {
      blockType: "doDont" as const,
      showLLM: true,
      heading: "Содержание и variant",
      dos: [
        { text: "Краткий заголовок + одно предложение сути." },
        { text: "Выбирайте variant по серьёзности: error только для блокирующих проблем." },
        { text: "Размещайте рядом с контекстом (форма, таблица, шаг мастера)." },
      ],
      donts: [
        { text: "Не дублируйте одно и то же alert на всей странице." },
        { text: "Не используйте alert для маркетинговых баннеров." },
      ],
    },
    {
      blockType: "propsTable" as const,
      showLLM: true,
      title: "API Reference",
      subtitle: "Alert Props",
      rows: [
        {
          name: "alertVariant",
          type: '"info" | "success" | "warning" | "error"',
          defaultValue: '"info"',
          description: "Цвет и семантика сообщения.",
        },
        {
          name: "title",
          type: "ReactNode",
          defaultValue: "—",
          description: "Жирный заголовок в начале текста.",
        },
        {
          name: "children",
          type: "ReactNode",
          defaultValue: "—",
          description: "Основной текст сообщения.",
        },
      ],
    },
    relComponentsDocumentationBlock(relatedComponentIds),
  ];
}

const linkDocumentationSeed = [
  ...linkLivePreviewSeed,
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "Когда использовать",
    body: "Link — для навигации без побочного действия: переход на другую страницу, якорь, внешний URL. Не дублируйте кнопку, если не нужен акцент действия.",
  },
  {
    blockType: "doDont" as const,
    showLLM: true,
    heading: "Текст и семантика",
    dos: [
      { text: "Текст ссылки должен описывать цель («Документация», не «Подробнее» без контекста)." },
      { text: "Внешние ссылки помечайте визуально или через aria." },
    ],
    donts: [
      { text: "Не используйте Link для submit формы — для этого Button." },
    ],
  },
];

const badgeDocumentationSeed = [
  ...badgeLivePreviewSeed,
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "Когда использовать",
    body: "Badge — компактная метка статуса, счётчика или категории. Не интерактивен; для действия используйте Button или Link.",
  },
  {
    blockType: "section" as const,
    showLLM: true,
    heading: "Content guidelines",
    body: "Не заменяет Tag/Chip с удалением — Badge только отображает информацию.",
  },
];

const componentDocumentationBySlug: Record<string, NonNullable<Component["documentation"]>> = {
  link: linkDocumentationSeed,
  badge: badgeDocumentationSeed,
  card: [
    ...cardLivePreviewSeed,
    {
      blockType: "section" as const,
      heading: "Preview",
      body: "Компонент в стадии preview: можно смотреть документацию, но контракт не зафиксирован.",
    },
    {
      blockType: "section" as const,
      heading: "When not to use",
      body: "Обратная совместимость не гарантируется до перевода в stable.",
    },
  ],
  "legacy-chip": [
    ...legacyChipLivePreviewSeed,
    {
      blockType: "section" as const,
      heading: "Deprecated",
      body: "Не используйте в новых интерфейсах. Мигрируйте на Badge.",
    },
    {
      blockType: "section" as const,
      heading: "Migration",
      body: "Компонент будет удалён в следующем мажорном релизе. Используйте Badge.",
    },
  ],
  select: [
    {
      blockType: "section" as const,
      heading: "Когда использовать",
      body: "5+ вариантов или длинные подписи — вместо Radio Group.",
    },
  ],
};

const components = buildRadixComponentSeeds(defaultStorybookUrl, componentDocumentationBySlug);

/** Связи по slug (применяются после создания всех записей). */
const componentRelationsBySlug: Record<
  string,
  {
    parentSlug?: string;
    subcomponentSlugs?: string[];
    relatedSlugs?: string[];
    replacedBySlug?: string;
  }
> = {
  button: {
    subcomponentSlugs: ["link"],
    relatedSlugs: ["input", "badge"],
  },
  input: {
    relatedSlugs: ["button", "checkbox", "select"],
  },
  checkbox: {
    relatedSlugs: ["input", "select"],
  },
  modal: {
    relatedSlugs: ["button"],
  },
  link: {
    parentSlug: "button",
    relatedSlugs: ["button", "input"],
  },
  badge: {
    relatedSlugs: ["button", "link", "legacy-chip"],
  },
  card: {
    relatedSlugs: ["button", "badge"],
  },
  "legacy-chip": {
    replacedBySlug: "badge",
    relatedSlugs: ["badge"],
  },
};

const colors = [
  { name: "Neutral 50", tokenKey: "color.neutral.50", hex: "#fafafa", sortOrder: 0 },
  { name: "Neutral 500", tokenKey: "color.neutral.500", hex: "#71717a", sortOrder: 1 },
  { name: "Neutral 900", tokenKey: "color.neutral.900", hex: "#18181b", sortOrder: 2 },
  { name: "Brand primary", tokenKey: "color.brand.primary", hex: "#2563eb", sortOrder: 3 },
  { name: "Accent", tokenKey: "color.accent", hex: "#f97316", sortOrder: 4 },
  { name: "Success", tokenKey: "color.semantic.success", hex: "#22c55e", sortOrder: 5 },
  { name: "Warning", tokenKey: "color.semantic.warning", hex: "#eab308", sortOrder: 6 },
  { name: "Danger", tokenKey: "color.semantic.danger", hex: "#ef4444", sortOrder: 7 },
];

const iconFileBySlug: Record<string, string> = {
  search: "search.svg",
  close: "close.svg",
  "chevron-right": "chevron-right.svg",
  user: "user.svg",
};

const icons = [
  {
    name: "Search",
    slug: "search",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Иконка поиска, 16–24px",
  },
  {
    name: "Close",
    slug: "close",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Закрытие модалок и тегов",
  },
  {
    name: "Chevron right",
    slug: "chevron-right",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Навигация, аккордеоны",
  },
  {
    name: "User",
    slug: "user",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Профиль, аватар-плейсхолдер",
  },
];

async function ensureMediaFromPublic(
  payload: Awaited<ReturnType<typeof getPayload>>,
  publicRelativePath: string,
  alt: string,
) {
  const found = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
    overrideAccess: true,
  });
  if (found.docs[0]) {
    return Number(found.docs[0].id);
  }
  const filePath = path.join(projectRoot, "public", publicRelativePath);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    overrideAccess: true,
  });
  return Number(doc.id);
}

async function ensureIconMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  filename: string,
) {
  return ensureMediaFromPublic(payload, path.join("icons", "ui", filename), `Icon asset: ${slug}`);
}

async function relatedComponentIdsForSlugs(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slugs: string[],
): Promise<number[]> {
  return (
    await Promise.all(slugs.map((slug) => getComponentIdBySlug(payload, slug)))
  ).filter((id): id is number => id != null);
}

async function seedFormAndFeedbackDocumentation(payload: Awaited<ReturnType<typeof getPayload>>) {
  const specs: {
    slug: string;
    relatedSlugs: string[];
    build: (relatedIds: number[]) => ReturnType<typeof buildInputDocumentation>;
  }[] = [
    {
      slug: "input",
      relatedSlugs: componentRelationsBySlug.input?.relatedSlugs ?? [],
      build: buildInputDocumentation,
    },
    {
      slug: "checkbox",
      relatedSlugs: componentRelationsBySlug.checkbox?.relatedSlugs ?? [],
      build: buildCheckboxDocumentation,
    },
    {
      slug: "modal",
      relatedSlugs: componentRelationsBySlug.modal?.relatedSlugs ?? [],
      build: buildModalDocumentation,
    },
  ];

  for (const { slug, relatedSlugs, build } of specs) {
    const id = await getComponentIdBySlug(payload, slug);
    if (!id) continue;

    const relatedComponentIds = await relatedComponentIdsForSlugs(payload, relatedSlugs);
    await updateComponentDocumentation(payload, id, build(relatedComponentIds));
  }
}

async function seedButtonDocumentation(payload: Awaited<ReturnType<typeof getPayload>>) {
  const buttonId = await getComponentIdBySlug(payload, "button");
  if (!buttonId) return;

  const anatomyImageId = await ensureMediaFromPublic(
    payload,
    "icons/brands/figma.svg",
    "Button anatomy diagram (seed)",
  );

  const relatedComponentIds = (
    await Promise.all(
      (componentRelationsBySlug.button?.relatedSlugs ?? []).map((slug) =>
        getComponentIdBySlug(payload, slug),
      ),
    )
  ).filter((id): id is number => id != null);

  await updateComponentDocumentation(
    payload,
    buttonId,
    buildButtonDocumentation({ anatomyImageId, relatedComponentIds }),
  );
}

async function updateComponentDocumentation(
  payload: Awaited<ReturnType<typeof getPayload>>,
  id: number,
  documentation: NonNullable<Component["documentation"]>,
) {
  await payload.update({
    collection: "components",
    id,
    data: { documentation: [] },
    overrideAccess: true,
  });
  await payload.update({
    collection: "components",
    id,
    data: { documentation },
    overrideAccess: true,
  });
}

const PORTAL_COMPONENT_SLUGS = new Set(RADIX_THEMES_CATALOG.map((entry) => entry.slug));

async function deleteRemovedPortalComponents(
  payload: Awaited<ReturnType<typeof getPayload>>,
) {
  const { docs } = await payload.find({
    collection: "components",
    limit: 200,
    overrideAccess: true,
  });

  for (const doc of docs) {
    const slug = String(doc.slug);
    if (PORTAL_COMPONENT_SLUGS.has(slug)) continue;
    await payload.delete({
      collection: "components",
      id: doc.id,
      overrideAccess: true,
    });
    console.log(`  removed from portal: ${slug}`);
  }
}

async function deleteUnusedComponentFolders(
  payload: Awaited<ReturnType<typeof getPayload>>,
) {
  const allowed = new Set<string>(COMPONENT_FOLDER_ORDER);
  const { docs } = await payload.find({
    collection: "payload-folders",
    limit: 100,
    overrideAccess: true,
  });

  for (const doc of docs) {
    const name = String(doc.name ?? "");
    if (!name || allowed.has(name)) continue;
    if (!Array.isArray(doc.folderType) || !doc.folderType.includes("components")) continue;
    if (doc.folder) continue;

    await payload.delete({
      collection: "payload-folders",
      id: doc.id,
      overrideAccess: true,
    });
    console.log(`  removed folder: ${name}`);
  }
}

async function upsertComponent(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof components)[number],
  folderId?: number,
): Promise<number> {
  const found = await payload.find({
    collection: "components",
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  const { documentation, ...scalarData } = data;
  const dataWithFolder = {
    ...scalarData,
    ...(folderId ? { folder: folderId } : {}),
  };
  if (doc) {
    await payload.update({
      collection: "components",
      id: doc.id,
      data: dataWithFolder,
      overrideAccess: true,
    });
    return Number(doc.id);
  }
  const created = await payload.create({
    collection: "components",
    data: {
      ...dataWithFolder,
      ...(documentation ? { documentation } : {}),
    },
    overrideAccess: true,
  });
  return Number(created.id);
}

async function seedInlineDocumentation(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const [slug, documentation] of Object.entries(componentDocumentationBySlug)) {
    const id = await getComponentIdBySlug(payload, slug);
    if (!id) continue;
    await updateComponentDocumentation(payload, id, documentation);
  }
}

async function upsertDesignChecklistItem(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof designChecklistItemSeeds)[number],
): Promise<number> {
  const found = await payload.find({
    collection: "design-checklist-items",
    where: { title: { equals: data.title } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "design-checklist-items",
      id: doc.id,
      data,
      overrideAccess: true,
    });
    return Number(doc.id);
  }
  const created = await payload.create({
    collection: "design-checklist-items",
    data,
    overrideAccess: true,
  });
  return Number(created.id);
}

async function seedDesignChecklist(payload: Awaited<ReturnType<typeof getPayload>>) {
  const itemIdByTitle: Record<string, number> = {};
  for (const row of designChecklistItemSeeds) {
    itemIdByTitle[row.title] = await upsertDesignChecklistItem(payload, row);
  }

  await syncDesignChecklistOnAllComponents(payload);

  const { docs: catalogItems } = await payload.find({
    collection: "design-checklist-items",
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });
  const titleByItemId = new Map(
    catalogItems.map((item) => [item.id, item.title] as const),
  );

  for (const [componentSlug, statuses] of Object.entries(componentDesignChecklistByTitle)) {
    const componentId = await getComponentIdBySlug(payload, componentSlug);
    if (!componentId) continue;

    const found = await payload.findByID({
      collection: "components",
      id: componentId,
      depth: 0,
      overrideAccess: true,
    });

    const designChecklist =
      found.designChecklist?.map((row) => {
        const itemId = typeof row.item === "object" ? row.item?.id : row.item;
        const title = itemId != null ? titleByItemId.get(itemId) : undefined;
        if (!title || statuses[title] === undefined) return row;
        return { ...row, done: statuses[title] };
      }) ?? [];

    await payload.update({
      collection: "components",
      id: componentId,
      data: { designChecklist },
      overrideAccess: true,
    });
  }
}

async function getComponentIdBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
): Promise<number | null> {
  const found = await payload.find({
    collection: "components",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  return doc ? Number(doc.id) : null;
}

async function applyComponentRelations(
  payload: Awaited<ReturnType<typeof getPayload>>,
) {
  for (const [slug, rel] of Object.entries(componentRelationsBySlug)) {
    const id = await getComponentIdBySlug(payload, slug);
    if (!id) continue;

    const parentId = rel.parentSlug
      ? await getComponentIdBySlug(payload, rel.parentSlug)
      : null;
    const subIds = rel.subcomponentSlugs
      ? (
          await Promise.all(
            rel.subcomponentSlugs.map((s) => getComponentIdBySlug(payload, s)),
          )
        ).filter((n): n is number => n != null)
      : [];
    const relatedIds = rel.relatedSlugs
      ? (
          await Promise.all(
            rel.relatedSlugs.map((s) => getComponentIdBySlug(payload, s)),
          )
        ).filter((n): n is number => n != null)
      : [];
    const replacedById = rel.replacedBySlug
      ? await getComponentIdBySlug(payload, rel.replacedBySlug)
      : null;

    await payload.update({
      collection: "components",
      id,
      data: {
        parentComponent: parentId,
        subcomponents: subIds,
        relatedComponents: relatedIds,
        replacedBy: replacedById,
      },
      overrideAccess: true,
    });
  }
}

async function ensureComponentFolder(
  payload: Awaited<ReturnType<typeof getPayload>>,
  name: string,
): Promise<number> {
  const existing = await payload.find({
    collection: "payload-folders",
    limit: 100,
    overrideAccess: true,
  });

  const found = existing.docs.find(
    (doc: any) =>
      doc.name === name &&
      Array.isArray(doc.folderType) &&
      doc.folderType.includes("components") &&
      !doc.folder,
  );

  if (found) return Number(found.id);

  const created = await payload.create({
    collection: "payload-folders",
    data: {
      name,
      folderType: ["components"],
    },
    overrideAccess: true,
  });

  return Number(created.id);
}

type IconDoc = (typeof icons)[number] & { preview: number };

async function upsertIcon(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: IconDoc,
) {
  const found = await payload.find({
    collection: "icons",
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "icons",
      id: doc.id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "icons",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertFieldShowcaseDoc(payload: Awaited<ReturnType<typeof getPayload>>) {
  const title = "Все типы полей Payload (Data Fields)";
  const found = await payload.find({
    collection: "field-showcase",
    where: { title: { equals: title } },
    limit: 1,
    overrideAccess: true,
  });
  const firstColor = await payload.find({
    collection: "colors",
    limit: 1,
    sort: "sortOrder",
    overrideAccess: true,
  });
  const colorId = firstColor.docs[0] ? Number(firstColor.docs[0].id) : undefined;

  const data = {
    title,
    demoText: "Пример Text",
    demoTextarea: "Пример Textarea — несколько строк.",
    demoNumber: 42,
    demoCheckbox: true,
    demoEmail: "design-system@example.com",
    demoRadio: "b" as const,
    demoSelect: ["red", "blue"] as ("red" | "green" | "blue")[],
    demoCode: "const ok = true;",
    demoJson: { seeded: true, purpose: "поле type: json" },
    demoPoint: [37.6173, 55.7558] as [number, number],
    demoArray: [
      { label: "Первый элемент array", count: 1 },
      { label: "Второй", count: 2 },
    ],
    demoGroup: {
      groupTitle: "Заголовок group",
      groupNote: "Поля group лежат в объекте demoGroup.",
    },
    demoBlocks: [
      { blockType: "line" as const, key: "role", value: "demo" },
      { blockType: "tag" as const, label: "blocks-field" },
    ],
    tabMeta: { metaSlug: "field-showcase-demo" },
    tabMetrics: { score: 100 },
    ...(colorId ? { demoRelationship: colorId } : {}),
  };

  if (found.docs[0]) {
    await payload.update({
      collection: "field-showcase",
      id: found.docs[0].id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "field-showcase",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertColor(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof colors)[number],
) {
  const found = await payload.find({
    collection: "colors",
    where: { tokenKey: { equals: data.tokenKey } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "colors",
      id: doc.id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "colors",
      data,
      overrideAccess: true,
    });
  }
}

async function main() {
  if (!process.env.PAYLOAD_SECRET?.trim()) {
    console.error(`
Не задан PAYLOAD_SECRET — Payload не инициализируется.

Добавьте в корень проекта в файл .env или .env.local (см. .env.example):
  PAYLOAD_SECRET=<случайная строка не короче 32 символов>

Затем снова: npm run seed:portal
`);
    process.exit(1);
  }

  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "portal-sources",
    data: demoSources,
    overrideAccess: true,
  });

  await syncDsOverview(payload, demoSources);

  await payload.updateGlobal({
    slug: "portal-seo",
    data: demoPortalSeo,
    overrideAccess: true,
  });

  const folderIdByName: Record<string, number> = {};
  console.log(`Creating ${COMPONENT_FOLDER_ORDER.length} component folders (HeroUI groups)…`);
  for (const folderName of COMPONENT_FOLDER_ORDER) {
    folderIdByName[folderName] = await ensureComponentFolder(payload, folderName);
    console.log(`  folder: ${folderName}`);
  }

  console.log(`Upserting ${components.length} components…`);
  for (let i = 0; i < components.length; i++) {
    const row = components[i]!;
    const folderName = componentFolderNameForSlug(row.slug);
    const folderId = folderName ? folderIdByName[folderName] : undefined;
    await upsertComponent(payload, row, folderId);
    console.log(`  [${i + 1}/${components.length}] ${row.slug} → ${folderName ?? "—"}`);
  }

  console.log("Removing components excluded from portal catalog…");
  await deleteRemovedPortalComponents(payload);

  console.log("Removing unused component folders…");
  await deleteUnusedComponentFolders(payload);

  await applyComponentRelations(payload);
  console.log("Applied component relations.");

  await seedDesignChecklist(payload);
  console.log("Seeded design checklist.");

  await seedInlineDocumentation(payload);
  await seedButtonDocumentation(payload);
  await seedFormAndFeedbackDocumentation(payload);
  console.log("Seeded component documentation.");

  for (const row of colors) {
    await upsertColor(payload, row);
  }

  await upsertFieldShowcaseDoc(payload);

  for (const row of icons) {
    const file = iconFileBySlug[row.slug];
    if (!file) {
      throw new Error(`No icon file mapped for slug: ${row.slug}`);
    }
    const preview = await ensureIconMedia(payload, row.slug, file);
    await upsertIcon(payload, { ...row, preview });
  }

  const [{ termsCreated }, { pagesUpserted }] = await Promise.all([
    syncTextGlossary(payload),
    syncBrandPages(payload),
  ]);

  const storybookSync = await syncStorybookUrls(payload, storybookBase);
  console.log(
    `Storybook URLs: portal-sources ${storybookSync.portalSourcesUpdated ? "updated" : "ok"}, ` +
      `components ${storybookSync.componentsUpdated}, colors ${storybookSync.colorsUpdated}, icons ${storybookSync.iconsUpdated}.`,
  );

  console.log(
    `Seed OK: portal-sources, portal-seo, design-checklist-items, components×${components.length}, colors×8, icons×4, field-showcase×1, glossary-terms×${termsCreated}, brand-pages×${pagesUpserted} + SVG в Media.`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
