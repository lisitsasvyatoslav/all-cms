import { RadioCards as RadixRadioCards } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type RadioCardsProps = ComponentProps<typeof RadixRadioCards.Root>;

export function RadioCards(_props: RadioCardsProps) {
  return (
    <RadixRadioCards.Root defaultValue="a" columns={{ initial: "1", sm: "2" }}>
      <RadixRadioCards.Item value="a">Option A</RadixRadioCards.Item>
      <RadixRadioCards.Item value="b">Option B</RadixRadioCards.Item>
    </RadixRadioCards.Root>
  );
}
