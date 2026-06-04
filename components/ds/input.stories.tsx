import type { Meta, StoryObj } from "@storybook/react";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";

import { Input } from "./input";

export const portalPreviewCatalog = portalPreviewCatalogBySlug.input;

const meta = {
  title: "Design System/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Placeholder из Storybook ✓",
    inputSize: "md",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
      Email
      <Input {...args} type="email" placeholder="name@company.com" />
    </label>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    placeholder: "Некорректные данные",
    defaultValue: "???",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Только чтение",
  },
};
