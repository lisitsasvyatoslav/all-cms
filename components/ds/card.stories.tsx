import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Card } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug.card;

const meta = {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "Заголовок",
    description: "Краткое описание карточки.",
    children: <Button size="2">Действие</Button>,
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  render: () => (
    <Card title="Card" description="Контейнер с заголовком и телом." />
  ),
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};
