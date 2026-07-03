export type ComposeUsagePrinciple = {
  title: string;
  description: string;
  agentRule: string;
};

/** Initial CMS content. Runtime consumers must read ds-overview from Payload. */
export const COMPOSE_USAGE_PRINCIPLES_SEED: readonly ComposeUsagePrinciple[] = [
  {
    title: "Сначала готовый компонент",
    description:
      "Используйте компонент из реестра дизайн-системы вместо собственного HTML, CSS или повторной реализации существующего паттерна.",
    agentRule:
      "Prefer an existing registry component; never recreate an available pattern with raw HTML, CSS, Tailwind, or a generic React component.",
  },
  {
    title: "Только разрешённые API",
    description:
      "Передавайте только props и значения, описанные в реестре. Не придумывайте варианты, размеры и составные части компонентов.",
    agentRule:
      "Use only component ids, compound parts, props, and enum values present in getComponentRegistry; validate before rendering.",
  },
  {
    title: "Семантика важнее визуального сходства",
    description:
      "Выбирайте компонент по назначению: Button для действия, Link для перехода, Heading для заголовка, Callout для сообщения.",
    agentRule:
      "Choose components by semantic purpose, not only visual similarity; preserve headings, actions, navigation, labels, and messages.",
  },
  {
    title: "Сохраняйте системную композицию",
    description:
      "Соблюдайте структуру compound-компонентов: Tabs, Select, Dialog и другие составляются только из совместимых частей.",
    agentRule:
      "Respect documented compound-component structure and parent-child relationships; do not flatten or invent nesting.",
  },
  {
    title: "Доступность по умолчанию",
    description:
      "Сохраняйте подписи полей, понятные тексты действий, порядок заголовков и клавиатурно доступные интерактивные элементы.",
    agentRule:
      "Preserve accessible labels, meaningful action text, heading hierarchy, keyboard behavior, and required descriptions.",
  },
  {
    title: "Токены вместо произвольных значений",
    description:
      "Используйте системные размеры, цвета, интервалы и варианты. Произвольные стили допустимы только когда реестр не предоставляет решения.",
    agentRule:
      "Prefer design-system tokens and component props over arbitrary colors, spacing, dimensions, className, or inline styles.",
  },
  {
    title: "Минимум отклонений от макета",
    description:
      "Сохраняйте иерархию, контент и сценарий макета, но нормализуйте его под доступные компоненты и ограничения дизайн-системы.",
    agentRule:
      "Preserve the mockup hierarchy, content, and user flow while normalizing unsupported details to the closest valid system pattern.",
  },
  {
    title: "Явно сообщайте о пробелах",
    description:
      "Если подходящего компонента нет, не маскируйте проблему самописной заменой — укажите ограничение и ближайший допустимый вариант.",
    agentRule:
      "If no suitable registry component exists, report the gap and closest valid alternative instead of silently hand-coding a substitute.",
  },
];
