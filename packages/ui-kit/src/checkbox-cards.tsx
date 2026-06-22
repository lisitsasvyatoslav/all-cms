import { CheckboxCards as RadixCheckboxCards } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type CheckboxCardsProps = ComponentProps<typeof RadixCheckboxCards.Root>;

export function CheckboxCards(_props: CheckboxCardsProps) {
  return (
    <RadixCheckboxCards.Root defaultValue={["a"]} columns={{ initial: "1", sm: "2" }}>
      <RadixCheckboxCards.Item value="a">Option A</RadixCheckboxCards.Item>
      <RadixCheckboxCards.Item value="b">Option B</RadixCheckboxCards.Item>
    </RadixCheckboxCards.Root>
  );
}
