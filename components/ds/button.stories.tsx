import type { Meta, StoryObj } from "@storybook/react";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";

import { Button } from "./button";

/** Порядок блоков «Превью» на портале — из `portal-preview-catalog.ts`. */
export const portalPreviewCatalog = portalPreviewCatalogBySlug.button;

const meta = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Из Storybook ✓",
    variant: "primary",
    size: "md",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-2">
      <Button size="sm">Маленькая</Button>
      <Button size="md">Средняя</Button>
      <Button size="lg">Большая</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Disabled: Story = {
  args: {
    children: "Недоступна",
    disabled: true,
  },
};

/** Маркер синхронизации портала — виден только если превью тянется из stories. */
export const PortalSync: Story = {
  render: () => (
    <p className="rounded-lg border border-dashed border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
      Портал синхронизирован со Storybook — {new Date().toLocaleString("ru-RU")}
    </p>
  ),
  parameters: { controls: { disable: true } },
};
