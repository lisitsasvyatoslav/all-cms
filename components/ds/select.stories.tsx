import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Select } from "@next-app/ui-kit";

const defaultOptions = [
  { value: "react", label: "React" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "flutter", label: "Flutter" },
];

const meta = {
  title: "Design System/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    placeholder: "Платформа",
    options: defaultOptions,
    defaultValue: "react",
    selectSize: "md",
  },
  argTypes: {
    selectSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    placeholder: "Select",
    options: defaultOptions,
    defaultValue: "react",
    selectSize: "md",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="3" width="240px">
      <Select placeholder="Small" options={defaultOptions} selectSize="sm" />
      <Select placeholder="Medium" options={defaultOptions} selectSize="md" defaultValue="kotlin" />
      <Select placeholder="Large" options={defaultOptions} selectSize="lg" />
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
