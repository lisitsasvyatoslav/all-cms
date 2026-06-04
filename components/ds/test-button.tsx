import type { ButtonHTMLAttributes } from "react";

export type ButtonType = {
  variant?: ButtonVariant; /* Это комментарий ButtonVariant */
  size?: ButtonSize; /* Это комментарий ButtonSize */
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`text-[var(--accent-11)]`}
      {...rest}
    />
  );
}
