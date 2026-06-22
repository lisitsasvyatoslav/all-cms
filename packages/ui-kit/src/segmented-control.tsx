import { SegmentedControl as RadixSegmentedControl } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type SegmentedControlProps = ComponentProps<typeof RadixSegmentedControl.Root>;

export function SegmentedControl(_props: SegmentedControlProps) {
  return (
    <RadixSegmentedControl.Root defaultValue="a">
      <RadixSegmentedControl.Item value="a">One</RadixSegmentedControl.Item>
      <RadixSegmentedControl.Item value="b">Two</RadixSegmentedControl.Item>
    </RadixSegmentedControl.Root>
  );
}
