import { Badge } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

type LegacyChipRadixProps = WithoutRadixLayout<ComponentProps<typeof Badge>>;

export interface LegacyChipProps extends Pick<
  LegacyChipRadixProps,
  "asChild" | "className" | "highContrast" | "radius" | "title" | "variant"
> {
  /** Рендерит дочерний элемент вместо корня. */
  asChild?: LegacyChipRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: LegacyChipRadixProps["className"];
  /** Повышенная контрастность. */
  highContrast?: LegacyChipRadixProps["highContrast"];
  /** Скругление углов. */
  radius?: LegacyChipRadixProps["radius"];
  /** Всплывающая подсказка (HTML title). */
  title?: LegacyChipRadixProps["title"];
  /** Вариант Radix Badge (компонент устарел). */
  variant?: LegacyChipRadixProps["variant"];
  /** Текст чипа. */
  children?: ReactNode;
}

/** Устаревший чип — только для демо deprecated-компонента в Storybook. */
export function LegacyChip({ children, ...rest }: LegacyChipProps) {
  return (
    <Badge variant="outline" color="gray" radius="full" {...rest}>
      {children}
    </Badge>
  );
}
