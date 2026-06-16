import type { Meta, StoryObj } from "@storybook/react";
import { Callout, Flex } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { Button } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug.button;

const meta = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Из Storybook ✓",
    variant: "primary",
    size: "md",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Variants: Story = {
  render: () => (
    <Flex gap="2" wrap="wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="2" wrap="wrap" align="end">
      <Button size="sm">Маленькая</Button>
      <Button size="md">Средняя</Button>
      <Button size="lg">Большая</Button>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};

export const Disabled: Story = {
  args: {
    children: "Недоступна",
    disabled: true,
  },
};

export const PortalSync: Story = {
  render: () => (
    <Callout.Root color="green">
      <Callout.Text>
        Портал синхронизирован со Storybook — {new Date().toLocaleString("ru-RU")}
      </Callout.Text>
    </Callout.Root>
  ),
  parameters: { controls: { disable: true } },
};
