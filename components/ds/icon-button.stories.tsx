import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";

import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { relatedPreviewDecorator, relatedPreviewStoryParameters } from "@/lib/storybook/related-preview-story";

import { IconButton } from "@next-app/ui-kit";

export const portalPreviewCatalog = portalPreviewCatalogBySlug["icon-button"];

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

const meta = {
  title: "Design System/Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    label: "Добавить",
    variant: "soft",
    children: <PlusIcon aria-hidden />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RelatedPreview: Story = {
  args: {
    label: "Добавить",
    variant: "soft",
    children: <PlusIcon aria-hidden />,
  },
  parameters: relatedPreviewStoryParameters,
  decorators: [relatedPreviewDecorator],
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="2" align="center">
      <IconButton size="sm" label="Small" variant="soft">
        <PlusIcon aria-hidden />
      </IconButton>
      <IconButton size="md" label="Medium" variant="soft">
        <PlusIcon aria-hidden />
      </IconButton>
      <IconButton size="lg" label="Large" variant="soft">
        <PlusIcon aria-hidden />
      </IconButton>
    </Flex>
  ),
  parameters: { controls: { disable: true } },
};
