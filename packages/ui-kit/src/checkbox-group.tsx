import { CheckboxGroup as RadixCheckboxGroup } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type CheckboxGroupProps = ComponentProps<typeof RadixCheckboxGroup.Root>;

export function CheckboxGroup(_props: CheckboxGroupProps) {
  return (
    <RadixCheckboxGroup.Root defaultValue={["a"]}>
      <RadixCheckboxGroup.Item value="a">Option A</RadixCheckboxGroup.Item>
      <RadixCheckboxGroup.Item value="b">Option B</RadixCheckboxGroup.Item>
    </RadixCheckboxGroup.Root>
  );
}
