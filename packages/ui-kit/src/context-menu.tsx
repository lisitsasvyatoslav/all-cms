import { ContextMenu as RadixContextMenu, Box } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type ContextMenuProps = ComponentProps<typeof RadixContextMenu.Root>;

export function ContextMenu(_props: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger>
        <Box p="4" style={{ border: "1px dashed var(--gray-a6)" }}>Right click</Box>
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Content>
        <RadixContextMenu.Item shortcut="⌘ C">Copy</RadixContextMenu.Item>
        <RadixContextMenu.Item shortcut="⌘ V">Paste</RadixContextMenu.Item>
      </RadixContextMenu.Content>
    </RadixContextMenu.Root>
  );
}
