import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Modal } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug.modal;

const meta = {
  title: "Design System/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    title: "Удалить файл?",
    description: "Действие нельзя отменить. Файл будет удалён безвозвратно.",
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Modal {...args} trigger={<Button>Открыть modal</Button>} />
  ),
};

export const RelatedPreview: Story = {
  args: {
    preview: true,
    title: "Modal",
    description: "Подтверждение действия без ухода со страницы.",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};
