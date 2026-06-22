import { RadioGroup as RadixRadioGroup } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type RadioGroupProps = ComponentProps<typeof RadixRadioGroup.Root>;

export function RadioGroup(_props: RadioGroupProps) {
  return (
    <RadixRadioGroup.Root defaultValue="a">
      <RadixRadioGroup.Item value="a">Option A</RadixRadioGroup.Item>
      <RadixRadioGroup.Item value="b">Option B</RadixRadioGroup.Item>
    </RadixRadioGroup.Root>
  );
}
