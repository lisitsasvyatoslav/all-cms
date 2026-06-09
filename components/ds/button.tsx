import { Button as RadixButton } from "@radix-ui/themes";
import type { ComponentProps } from "react";

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

export type ButtonProps = Omit<ComponentProps<typeof RadixButton>, "variant" | "color" | "size"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

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
