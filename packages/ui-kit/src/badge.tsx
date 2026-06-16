import { Badge as RadixBadge } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

export type BadgeVariant = "neutral" | "success" | "warning";

const variantMap: Record<
  BadgeVariant,
  { color: ComponentProps<typeof RadixBadge>["color"]; variant?: ComponentProps<typeof RadixBadge>["variant"] }
> = {
  neutral: { color: "gray", variant: "soft" },
  success: { color: "green", variant: "soft" },
  warning: { color: "amber", variant: "soft" },
};

type BadgeRadixProps = WithoutRadixLayout<Omit<ComponentProps<typeof RadixBadge>, "color" | "variant">>;

export interface BadgeProps extends Pick<BadgeRadixProps, "asChild" | "className" | "highContrast" | "radius" | "title"> {
  /** Семантика бейджа: neutral, success, warning. */
  badgeVariant?: BadgeVariant;
  /** Рендерит дочерний элемент вместо корня. */
  asChild?: BadgeRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: BadgeRadixProps["className"];
  /** Повышенная контрастность. */
  highContrast?: BadgeRadixProps["highContrast"];
  /** Скругление углов. */
  radius?: BadgeRadixProps["radius"];
  /** Всплывающая подсказка (HTML title). */
  title?: BadgeRadixProps["title"];
  /** Текст бейджа. */
  children?: ReactNode;
}

export function Badge({ badgeVariant = "neutral", ...rest }: BadgeProps) {
  const mapped = variantMap[badgeVariant];
  return <RadixBadge color={mapped.color} variant={mapped.variant} {...rest} />;
}
