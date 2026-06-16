import type { Meta, StoryObj } from "@storybook/react";
import { Box, Flex, Text, TextField } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/classes";
import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Input } from "@next-app/ui-kit";

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
      <Box className={portalClass.storybookMax}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    placeholder: "Input",
    inputSize: "md",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const WithLabel: Story = {
  render: () => (
    <Flex direction="column" gap="1">
      <Text as="label" size="2" weight="medium">
        Email
      </Text>
      <TextField.Root type="email" placeholder="name@company.com" size="2" />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="3">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </Flex>
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
