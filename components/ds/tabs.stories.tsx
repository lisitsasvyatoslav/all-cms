import type { Meta, StoryObj } from "@storybook/react";
import { Box, Text } from "@radix-ui/themes";

import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Tabs } from "@next-app/ui-kit";

const meta = {
  title: "Design System/Tabs",
  component: Tabs.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Trigger value="one">Обзор</Tabs.Trigger>
        <Tabs.Trigger value="two">API</Tabs.Trigger>
      </Tabs.List>
      <Box pt="3">
        <Tabs.Content value="one">
          <Text size="2">Краткое описание компонента.</Text>
        </Tabs.Content>
        <Tabs.Content value="two">
          <Text size="2">Таблица пропсов и примеры.</Text>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  ),
};

export const RelatedPreview: Story = {
  render: () => (
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Trigger value="one">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="two">Tab 2</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  ),
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};
