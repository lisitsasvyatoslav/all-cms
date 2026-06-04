import { Button as RadixButton } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type RadixDsButtonProps = ComponentProps<typeof RadixButton>;

/** Обёртка над Radix Themes Button — точка кастомизации DS поверх Themes. */
export function RadixDsButton(props: RadixDsButtonProps) {
  return <RadixButton size="2" variant="solid" {...props} />;
}
