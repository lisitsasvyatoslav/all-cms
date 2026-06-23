import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Checkbox } from "@next-app/ui-kit";

const meta = {
  title: "Design System/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Согласен с условиями",
    defaultChecked: true,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    label: "Checkbox",
    defaultChecked: true,
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Group: Story = {
  render: () => (
    <Flex direction="column" gap="2">
      <Checkbox label="Email-уведомления" defaultChecked />
      <Checkbox label="Push-уведомления" />
      <Checkbox label="SMS" disabled />
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
