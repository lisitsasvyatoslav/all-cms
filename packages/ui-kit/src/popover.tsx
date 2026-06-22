import { Popover as RadixPopover, Button, Text } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type PopoverProps = ComponentProps<typeof RadixPopover.Root>;

export function Popover(_props: PopoverProps) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger>
        <Button variant="soft">Open popover</Button>
      </RadixPopover.Trigger>
      <RadixPopover.Content width="260px">
        <Text as="div" size="2">Popover content</Text>
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
}
