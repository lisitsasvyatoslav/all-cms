import { Button as RadixButton } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantMap: Record<
  ButtonVariant,
  { variant: ComponentProps<typeof RadixButton>["variant"]; color?: ComponentProps<typeof RadixButton>["color"] }
> = {
  primary: { variant: "solid" },
  secondary: { variant: "soft", color: "gray" },
  outline: { variant: "outline", color: "gray" },
  ghost: { variant: "ghost", color: "gray" },
  danger: { variant: "solid", color: "red" },
};

const sizeMap: Record<ButtonSize, ComponentProps<typeof RadixButton>["size"]> = {
  sm: "1",
  md: "2",
  lg: "3",
};

type ButtonRadixProps = WithoutRadixLayout<
  Omit<ComponentProps<typeof RadixButton>, "variant" | "color" | "size">
>;

export interface ButtonProps extends Pick<
  ButtonRadixProps,
  | "asChild"
  | "className"
  | "disabled"
  | "highContrast"
  | "loading"
  | "onClick"
  | "radius"
  | "type"
  | "value"
  | "title"
> {
  /** Визуальный стиль: primary, secondary, outline, ghost, danger. */
  variant?: ButtonVariant;
  /** Высота и отступы: sm, md, lg. */
  size?: ButtonSize;
  /** Рендерит дочерний элемент вместо собственного DOM-узла (Radix Slot). */
  asChild?: ButtonRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: ButtonRadixProps["className"];
  /** Отключает взаимодействие с кнопкой. */
  disabled?: ButtonRadixProps["disabled"];
  /** Повышенная контрастность для a11y. */
  highContrast?: ButtonRadixProps["highContrast"];
  /** Показывает индикатор загрузки. */
  loading?: ButtonRadixProps["loading"];
  /** Обработчик клика. */
  onClick?: ButtonRadixProps["onClick"];
  /** Скругление углов Radix Themes. */
  radius?: ButtonRadixProps["radius"];
  /** Семантика для форм: button, submit, reset. */
  type?: ButtonRadixProps["type"];
  /** Значение, отправляемое с формой. */
  value?: ButtonRadixProps["value"];
  /** Всплывающая подсказка (HTML title). */
  title?: ButtonRadixProps["title"];
  /** Текст или содержимое кнопки. */
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  ...rest
}: ButtonProps) {
  const mapped = variantMap[variant];
  return (
    <RadixButton
      type={type}
      variant={mapped.variant}
      color={mapped.color}
      size={sizeMap[size]}
      {...rest}
    />
  );
}
