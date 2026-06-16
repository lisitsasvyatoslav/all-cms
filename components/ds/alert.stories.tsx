import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Alert } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug.alert;

const meta = {
  title: "Design System/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    alertVariant: "info",
    title: "Информация",
    children: "Изменения сохранены и появятся после обновления страницы.",
  },
  argTypes: {
    alertVariant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    alertVariant: "info",
    title: "Alert",
    children: "Инлайн-сообщение о статусе операции.",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap="3" width="360px">
      <Alert alertVariant="info" title="Info">
        Справочное сообщение для пользователя.
      </Alert>
      <Alert alertVariant="success" title="Success">
        Операция выполнена успешно.
      </Alert>
      <Alert alertVariant="warning" title="Warning">
        Проверьте введённые данные.
      </Alert>
      <Alert alertVariant="error" title="Error">
        Не удалось сохранить изменения.
      </Alert>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
