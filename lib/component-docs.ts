/** Статичные таблицы пропсов и сниппеты для демо-страниц (как в Radix). */
export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type ComponentDoc = {
  label: string;
  props: PropRow[];
  importSnippet: string;
  basicSnippet: string;
  variantSnippets: { label: string; code: string }[];
};

export const componentDocsBySlug: Record<string, ComponentDoc> = {
  button: {
    label: "Button",
    importSnippet: `import { Button } from "@/components/ds/button";`,
    basicSnippet: `<Button>Нажми</Button>`,
    variantSnippets: [
      {
        label: "Варианты",
        code: `<div className="flex flex-wrap gap-2">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
</div>`,
      },
      {
        label: "Размеры",
        code: `<div className="flex flex-wrap items-end gap-2">
  <Button size="sm">Маленькая</Button>
  <Button size="md">Средняя</Button>
  <Button size="lg">Большая</Button>
</div>`,
      },
      {
        label: "Состояние",
        code: `<Button disabled>Disabled</Button>`,
      },
    ],
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
        default: '"primary"',
        description: "Визуальный стиль кнопки.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Высота и отступы.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "—",
        description: "Отключает взаимодействие.",
      },
      {
        name: "type",
        type: '"button" | "submit" | "reset"',
        default: '"button"',
        description: "Семантика для форм.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description: "Дополнительные Tailwind-классы.",
      },
      {
        name: "...rest",
        type: "ButtonHTMLAttributes",
        default: "—",
        description: "Стандартные атрибуты элемента button.",
      },
    ],
  },
  input: {
    label: "Input",
    importSnippet: `import { Input } from "@/components/ds/input";`,
    basicSnippet: `<Input placeholder="Введите текст" />`,
    variantSnippets: [
      {
        label: "Размеры",
        code: `<div className="flex max-w-md flex-col gap-3">
  <Input inputSize="sm" placeholder="small" />
  <Input inputSize="md" placeholder="medium" />
  <Input inputSize="lg" placeholder="large" />
</div>`,
      },
      {
        label: "Ошибка",
        code: `<Input invalid placeholder="Некорректное значение" aria-describedby="err" />`,
      },
      {
        label: "Disabled",
        code: `<Input disabled placeholder="Недоступно" />`,
      },
    ],
    props: [
      {
        name: "inputSize",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Высота поля.",
      },
      {
        name: "invalid",
        type: "boolean",
        default: "false",
        description: "Стиль ошибки (border + aria-invalid).",
      },
      {
        name: "placeholder",
        type: "string",
        default: "—",
        description: "Текст-подсказка.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "—",
        description: "Блокировка ввода.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description: "Дополнительные классы.",
      },
      {
        name: "...rest",
        type: "InputHTMLAttributes",
        default: "—",
        description: "Атрибуты нативного поля input.",
      },
    ],
  },
  "text-field": {
    label: "Text Field",
    importSnippet: `import { Input } from "@/components/ds/input";`,
    basicSnippet: `<Input placeholder="Введите текст" />`,
    variantSnippets: [
      {
        label: "Размеры",
        code: `<div className="flex max-w-md flex-col gap-3">
  <Input inputSize="sm" placeholder="small" />
  <Input inputSize="md" placeholder="medium" />
  <Input inputSize="lg" placeholder="large" />
</div>`,
      },
      {
        label: "Ошибка",
        code: `<Input invalid placeholder="Некорректное значение" />`,
      },
    ],
    props: [
      {
        name: "inputSize",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Высота поля.",
      },
      {
        name: "invalid",
        type: "boolean",
        default: "false",
        description: "Стиль ошибки.",
      },
      {
        name: "placeholder",
        type: "string",
        default: "—",
        description: "Текст-подсказка.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "—",
        description: "Блокировка ввода.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description: "Дополнительные классы.",
      },
    ],
  },
  card: {
    label: "Card",
    importSnippet: `import { Card } from "@/components/ds/card";`,
    basicSnippet: `<Card title="Заголовок">Содержимое карточки</Card>`,
    variantSnippets: [
      {
        label: "С отступами",
        code: `<Card padding="md" title="Счёт">Баланс и детали</Card>`,
      },
      {
        label: "Интерактив",
        code: `<Card asChild><a href="/details">Перейти</a></Card>`,
      },
    ],
    props: [
      {
        name: "title",
        type: "ReactNode",
        default: "—",
        description: "Заголовок (опционально).",
      },
      {
        name: "padding",
        type: '"none" | "sm" | "md" | "lg"',
        default: '"md"',
        description: "Внутренние отступы.",
      },
      {
        name: "elevation",
        type: '"flat" | "sm" | "md"',
        default: '"sm"',
        description: "Тень/граница.",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "—",
        description: "Основной контент.",
      },
    ],
  },
  dialog: {
    label: "Dialog",
    importSnippet: `import { Dialog } from "@/components/ds/dialog";`,
    basicSnippet: `<Dialog title="Подтверждение" open onOpenChange={...}>…</Dialog>`,
    variantSnippets: [
      {
        label: "Форма внутри",
        code: `<Dialog title="Создать">…поля…</Dialog>`,
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        default: "—",
        description: "Контролируемое открытие.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "—",
        description: "Событие смены открытости.",
      },
      {
        name: "title",
        type: "ReactNode",
        default: "—",
        description: "Заголовок (aria-labelledby).",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "—",
        description: "Тело диалога.",
      },
    ],
  },
  badge: {
    label: "Badge",
    importSnippet: `import { Badge } from "@/components/ds/badge";`,
    basicSnippet: `<Badge tone="neutral">Новое</Badge>`,
    variantSnippets: [
      {
        label: "Тональности",
        code: `<div className="flex flex-wrap gap-2">
  <Badge tone="success">Active</Badge>
  <Badge tone="warning">Pending</Badge>
  <Badge tone="danger">Failed</Badge>
</div>`,
      },
    ],
    props: [
      {
        name: "tone",
        type: '"neutral" | "info" | "success" | "warning" | "danger"',
        default: '"neutral"',
        description: "Семантический цвет.",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "—",
        description: "Текст или число.",
      },
    ],
  },
  select: {
    label: "Select",
    importSnippet: `import { Select } from "@/components/ds/select";`,
    basicSnippet: `<Select items={[…]} value={v} onChange={…} />`,
    variantSnippets: [
      {
        label: "Группы опций",
        code: `<Select groups={[{ label: "Регион", options: […] }]} />`,
      },
    ],
    props: [
      {
        name: "items",
        type: "{ label: string; value: string }[]",
        default: "—",
        description: "Плоский список опций.",
      },
      {
        name: "value",
        type: "string",
        default: "—",
        description: "Выбранное значение.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        default: "—",
        description: "Смена значения.",
      },
      {
        name: "placeholder",
        type: "string",
        default: "—",
        description: "Плейсхолдер в закрытом состоянии.",
      },
    ],
  },
  switch: {
    label: "Switch",
    importSnippet: `import { Switch } from "@/components/ds/switch";`,
    basicSnippet: `<Switch checked={on} onCheckedChange={setOn} label="Уведомления" />`,
    variantSnippets: [
      {
        label: "С подписью",
        code: `<Switch label="Включить 2FA" description="По SMS" />`,
      },
    ],
    props: [
      {
        name: "checked",
        type: "boolean",
        default: "—",
        description: "Состояние включено.",
      },
      {
        name: "onCheckedChange",
        type: "(v: boolean) => void",
        default: "—",
        description: "Переключение.",
      },
      {
        name: "label",
        type: "string",
        default: "—",
        description: "Видимая подпись рядом.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "—",
        description: "Недоступен для ввода.",
      },
    ],
  },
};

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return componentDocsBySlug[slug];
}
