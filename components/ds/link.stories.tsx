import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Link } from "@next-app/ui-kit";

const meta = {
  title: "Design System/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    children: "Документация",
    href: "#",
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    children: "Перейти",
    href: "#",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Variants: Story = {
  render: () => (
    <Flex gap="4" wrap="wrap">
      <Link href="#">Внутренняя ссылка</Link>
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
        Внешняя ссылка ↗
      </Link>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
