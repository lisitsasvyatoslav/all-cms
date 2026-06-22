import { HoverCard as RadixHoverCard, Link, Text } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type HoverCardProps = ComponentProps<typeof RadixHoverCard.Root>;

export function HoverCard(_props: HoverCardProps) {
  return (
    <RadixHoverCard.Root>
      <RadixHoverCard.Trigger>
        <Link href="#">@finam</Link>
      </RadixHoverCard.Trigger>
      <RadixHoverCard.Content maxWidth="300px">
        <Text as="div" size="2">Hover card content</Text>
      </RadixHoverCard.Content>
    </RadixHoverCard.Root>
  );
}
