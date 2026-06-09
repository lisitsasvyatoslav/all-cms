import { TextField } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type InputSize = "sm" | "md" | "lg";

const sizeMap: Record<InputSize, "1" | "2" | "3"> = {
  sm: "1",
  md: "2",
  lg: "3",
};

export type InputProps = ComponentProps<typeof TextField.Root> & {
  inputSize?: InputSize;
  invalid?: boolean;
};

export function Input({ inputSize = "md", invalid = false, ...rest }: InputProps) {
  return (
    <TextField.Root
      size={sizeMap[inputSize]}
      color={invalid ? "red" : undefined}
      aria-invalid={invalid}
      {...rest}
    />
  );
}
