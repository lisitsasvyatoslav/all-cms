import { Flex } from "@radix-ui/themes";
import type { Decorator } from "@storybook/react";
import type { ReactNode } from "react";

import { isPortalStorybookEmbed } from "@/lib/storybook/portal-embed-mode";

/** Параметры стори для карточек Related Components на портале. */
export const relatedPreviewStoryParameters = {
  layout: "fullscreen" as const,
};

export const relatedPreviewDecorator: Decorator = (Story) => {
  if (isPortalStorybookEmbed()) {
    return (
      <Flex
        align="center"
        justify="center"
        className="portal-related-preview-capture"
      >
        <div className="portal-related-preview-capture__stage">
          <Story />
        </div>
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="center" minHeight="8rem" p="2">
      <Story />
    </Flex>
  );
};

export function relatedPreviewStory<TRender extends () => ReactNode>(render: TRender) {
  return {
    render,
    parameters: relatedPreviewStoryParameters,
    decorators: [relatedPreviewDecorator],
  };
}
