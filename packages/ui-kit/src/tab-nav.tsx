import { TabNav as RadixTabNav, Link } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type TabNavProps = ComponentProps<typeof RadixTabNav.Root>;

export function TabNav(_props: TabNavProps) {
  return (
    <RadixTabNav.Root>
      <RadixTabNav.Link href="#" active>Active</RadixTabNav.Link>
      <RadixTabNav.Link href="#">Link</RadixTabNav.Link>
    </RadixTabNav.Root>
  );
}
