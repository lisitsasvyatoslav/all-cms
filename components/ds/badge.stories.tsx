import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Badge } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug.badge;

const meta = {
  title: "Design System/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Stable",
    badgeVariant: "neutral",
  },
  argTypes: {
    badgeVariant: {
      control: "select",
      options: ["neutral", "success", "warning"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    children: "Badge",
    badgeVariant: "neutral",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Variants: Story = {
  render: () => (
    <Flex gap="2" wrap="wrap">
      <Badge badgeVariant="neutral">Neutral</Badge>
      <Badge badgeVariant="success">Success</Badge>
      <Badge badgeVariant="warning">Warning</Badge>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
