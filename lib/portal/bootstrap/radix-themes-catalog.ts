/**
 * Статический каталог Radix Themes для seed и codegen.
 * На портале nav/каталог/описания читаются из Payload CMS.
 */

const docs = (path: string) => `https://www.radix-ui.com/themes/docs/components/${path}`;

export type RadixThemesCatalogEntry = {
  slug: string;
  name: string;
  description: string;
  /** Уже есть кастомная обёртка в ui-kit — не перезаписывать файл. */
  customUiKit?: boolean;
  status?: "stable" | "beta" | "deprecated";
  statusNote?: string;
};

export const RADIX_THEMES_CATALOG: RadixThemesCatalogEntry[] = [
  {
    slug: "container",
    name: "Container",
    description: "Центрированный контейнер с ограничением максимальной ширины контента.",
  },
  {
    slug: "section",
    name: "Section",
    description: "Секция страницы с вертикальными отступами по шкале Themes.",
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description: "Область с кастомной полосой прокрутки поверх нативного скролла.",
  },
  {
    slug: "blockquote",
    name: "Blockquote",
    description: "Выделенная цитата с типографикой Themes.",
  },
  {
    slug: "em",
    name: "Em",
    description: "Семантическое выделение курсивом.",
  },
  {
    slug: "heading",
    name: "Heading",
    description: "Заголовки h1–h6 с размерами и весами Themes.",
  },
  {
    slug: "link",
    name: "Link",
    description: "Текстовая ссылка для навигации: внутренние маршруты и внешние URL.",
    customUiKit: true,
  },
  {
    slug: "strong",
    name: "Strong",
    description: "Семантическое полужирное выделение.",
  },
  {
    slug: "text",
    name: "Text",
    description: "Основной текст: размер, цвет, weight и truncate.",
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "Аватар пользователя: изображение, инициалы или fallback.",
  },
  {
    slug: "badge",
    name: "Badge",
    description: "Метка статуса или счётчика: варианты solid / soft / outline.",
    customUiKit: true,
  },
  {
    slug: "button",
    name: "Button",
    description: "Триггер действия: варианты solid / soft / outline / ghost, размеры 1–3.",
    customUiKit: true,
  },
  {
    slug: "card",
    name: "Card",
    description: "Контейнер с заголовком и телом для группировки контента.",
    customUiKit: true,
    status: "beta",
    statusNote: "API может измениться до релиза v1.",
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "Флажок для булева выбора или группы независимых опций.",
    customUiKit: true,
  },
  {
    slug: "legacy-chip",
    name: "Legacy Chip",
    description: "Устаревший чип. Используйте Badge.",
    customUiKit: true,
    status: "deprecated",
    statusNote: "Удалим в v2.0. Используйте Badge вместо Legacy Chip.",
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Индикатор выполнения задачи.",
  },
  {
    slug: "radio",
    name: "Radio",
    description: "Переключатель для выбора одного значения из группы.",
  },
  {
    slug: "select",
    name: "Select",
    description: "Выпадающий список для выбора одного значения из набора опций.",
    customUiKit: true,
  },
  {
    slug: "slider",
    name: "Slider",
    description: "Выбор числового значения на шкале.",
  },
  {
    slug: "spinner",
    name: "Spinner",
    description: "Индикатор загрузки.",
  },
  {
    slug: "switch",
    name: "Switch",
    description: "Переключатель вкл/выкл.",
  },
  {
    slug: "table",
    name: "Table",
    description: "Таблица данных с header, body и footer.",
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Вкладки с панелями контента.",
    customUiKit: true,
  },
  {
    slug: "input",
    name: "Text Field",
    description: "Однострочное поле ввода с label, ошибкой и подсказкой (Radix Text Field).",
    customUiKit: true,
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    description: "Контекстное меню по правому клику или long press.",
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description: "Меню действий по клику на триггер.",
  },
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    description: "Модальное подтверждение с фокусом на безопасном действии.",
  },
  {
    slug: "modal",
    name: "Dialog",
    description: "Модальное окно с заголовком, телом и действиями (Radix Dialog).",
    customUiKit: true,
  },
];

export function radixThemesDocsUrl(slug: string): string {
  const pathBySlug: Record<string, string> = {
    input: "text-field",
    modal: "dialog",
  };
  return docs(pathBySlug[slug] ?? slug);
}
