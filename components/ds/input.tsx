import type { InputHTMLAttributes } from "react";

export type InputSize = "sm" | "md" | "lg";

const sizeClass: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputSize?: InputSize;
  invalid?: boolean;
};

export function Input({
  inputSize = "md",
  invalid = false,
  className = "",
  ...rest
}: InputProps) {
  const ring = invalid
    ? "border-red-500 focus-visible:ring-red-500/30"
    : "border-zinc-300 focus-visible:ring-zinc-400/40 dark:border-zinc-600";
  return (
    <input
      className={`w-full min-w-0 rounded-lg border bg-white text-zinc-900 shadow-sm transition-shadow placeholder:text-zinc-400 focus-visible:outline focus-visible:ring-2 dark:bg-zinc-950 dark:text-zinc-50 ${ring} ${sizeClass[inputSize]} ${className}`.trim()}
      aria-invalid={invalid}
      {...rest}
    />
  );
}
