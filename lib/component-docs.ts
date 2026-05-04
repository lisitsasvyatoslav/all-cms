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
};

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return componentDocsBySlug[slug];
}
