import type { Meta, StoryObj } from "@storybook/react";
import { Flex, Text } from "@radix-ui/themes";

import { RadixDsButton } from "./radix-button";

const meta = {
  title: "Radix Themes/Button",
  component: RadixDsButton,
  tags: ["autodocs"],
  args: {
    children: "Radix Themes",
  },
} satisfies Meta<typeof RadixDsButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Flex gap="3" wrap="wrap" align="center">
      <RadixDsButton variant="solid">Solid</RadixDsButton>
      <RadixDsButton variant="soft">Soft</RadixDsButton>
      <RadixDsButton variant="outline">Outline</RadixDsButton>
      <RadixDsButton variant="ghost">Ghost</RadixDsButton>
    </Flex>
  ),
};

export const WithText: Story = {
  render: () => (
    <Flex direction="column" gap="2">
      <Text size="2" color="gray">
        Токены темы: lib/radix/portal-theme-config.ts и app/radix-themes.css
      </Text>
      <RadixDsButton>Настроить под DS</RadixDsButton>
    </Flex>
  ),
};
