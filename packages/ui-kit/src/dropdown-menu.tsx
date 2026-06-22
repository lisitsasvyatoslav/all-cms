import { DropdownMenu as RadixDropdownMenu, Button } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type DropdownMenuProps = ComponentProps<typeof RadixDropdownMenu.Root>;

export function DropdownMenu(_props: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger>
        <Button variant="soft">Options</Button>
      </RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Content>
        <RadixDropdownMenu.Item shortcut="⌘ E">Edit</RadixDropdownMenu.Item>
        <RadixDropdownMenu.Item shortcut="⌘ D">Duplicate</RadixDropdownMenu.Item>
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Root>
  );
}
