import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { LegacyChip } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug["legacy-chip"];

const meta = {
  title: "Design System/Legacy Chip",
  component: LegacyChip,
  tags: ["autodocs"],
  args: {
    children: "Legacy",
  },
} satisfies Meta<typeof LegacyChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    children: "Chip",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Group: Story = {
  render: () => (
    <Flex gap="2" wrap="wrap">
      <LegacyChip>Alpha</LegacyChip>
      <LegacyChip>Beta</LegacyChip>
      <LegacyChip>Deprecated</LegacyChip>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
