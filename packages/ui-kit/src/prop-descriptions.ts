/** Общие описания пропсов (наследуемые от Radix / HTML). */
export const COMMON_PROP_DESCRIPTIONS: Record<string, string> = {
  asChild:
    "Рендерит дочерний элемент вместо собственного DOM-узла (паттерн Radix Slot).",
  checked: "Контролируемое состояние: отмечен, не отмечен или indeterminate.",
  className: "Дополнительные CSS-классы для корневого элемента.",
  defaultChecked: "Начальное состояние для неконтролируемого checkbox.",
  defaultValue: "Начальное значение для неконтролируемого поля или вкладки.",
  disabled: "Отключает взаимодействие с элементом.",
  highContrast: "Повышенная контрастность для a11y и тёмной темы.",
  href: "URL перехода для ссылки.",
  loading: "Показывает индикатор загрузки и блокирует повторные нажатия.",
  placeholder: "Текст-подсказка, когда значение не выбрано или поле пустое.",
  radius: 'Скругление углов: "none" | "small" | "medium" | "large" | "full".',
  readOnly: "Только для чтения — значение видно, но изменить нельзя.",
  required: "Поле обязательно для заполнения (HTML required).",
  target: 'Куда открыть ссылку, например "_blank".',
  title: "Краткая подсказка при наведении (HTML title).",
  type: "Семантический тип HTML-элемента (button, submit, text и т.д.).",
  value: "Текущее значение для контролируемого компонента.",
  variant: "Визуальный вариант Radix Themes (surface, soft, outline…).",
  children: "Содержимое компонента.",
};

/** Описания пропсов по slug компонента (кастомные и уточнённые). */
export const COMPONENT_PROP_DESCRIPTIONS: Record<string, Record<string, string>> = {
  alert: {
    alertVariant: 'Семантика сообщения: "info" | "success" | "warning" | "error".',
    title: "Заголовок alert — выделяется жирным перед основным текстом.",
    children: "Основной текст уведомления.",
  },
  badge: {
    badgeVariant: 'Семантика бейджа: "neutral" | "success" | "warning".',
    children: "Текст или содержимое бейджа.",
  },
  button: {
    variant: 'Визуальный стиль: "primary" | "secondary" | "outline" | "ghost" | "danger".',
    size: 'Высота и отступы: "sm" | "md" | "lg".',
    type: 'Семантика для форм: "button" | "submit" | "reset".',
    value: "Значение, отправляемое с формой при нажатии submit.",
    children: "Текст или содержимое кнопки.",
  },
  card: {
    title: "Заголовок карточки.",
    description: "Краткое описание под заголовком.",
    variant: 'Стиль поверхности: "surface" | "classic" | "ghost".',
    children: "Основное содержимое карточки (действия, формы и т.д.).",
  },
  checkbox: {
    label: "Подпись рядом с чекбоксом; оборачивает control в label.",
    value: "Значение, отправляемое с формой при отмеченном checkbox.",
  },
  "icon-button": {
    label: "Текст для aria-label — обязателен для скринридеров.",
    size: 'Размер кнопки: "sm" | "md" | "lg".',
    children: "Иконка или содержимое кнопки.",
  },
  input: {
    inputSize: 'Высота поля: "sm" | "md" | "lg".',
    invalid: "Стиль ошибки: красная обводка и aria-invalid.",
    placeholder: "Подсказка в пустом поле.",
    type: "Тип HTML-input: text, password, email и др.",
    value: "Контролируемое значение поля.",
    defaultValue: "Начальное значение неконтролируемого поля.",
  },
  "legacy-chip": {
    children: "Текст чипа.",
    variant: "Вариант Radix Badge (компонент устарел).",
  },
  link: {
    href: "Адрес перехода.",
    children: "Текст ссылки.",
  },
  modal: {
    open: "Открыть диалог без триггера — для превью и Storybook.",
    title: "Заголовок модального окна.",
    description: "Поясняющий текст под заголовком.",
    trigger: "Элемент, по клику открывающий modal (обычно кнопка).",
    children: "Дополнительное содержимое между описанием и кнопками.",
  },
  select: {
    options: "Список пунктов { value, label } для выпадающего списка.",
    placeholder: "Текст, когда значение не выбрано.",
    defaultValue: "value выбранного пункта по умолчанию.",
    selectSize: 'Высота триггера: "sm" | "md" | "lg".',
  },
  tabs: {
    defaultValue: "value вкладки по умолчанию (неконтролируемый режим).",
    value: "value активной вкладки (контролируемый режим).",
  },
};

export function resolvePropDescription(
  componentSlug: string,
  propName: string,
  docgenDescription?: string,
): string {
  const fromDocgen = docgenDescription?.trim();
  if (fromDocgen) return fromDocgen;

  return (
    COMPONENT_PROP_DESCRIPTIONS[componentSlug]?.[propName] ??
    COMMON_PROP_DESCRIPTIONS[propName] ??
    ""
  );
}
