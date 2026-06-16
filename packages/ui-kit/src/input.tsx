import { TextField } from "@radix-ui/themes";
import type { ComponentProps } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

export type InputSize = "sm" | "md" | "lg";

const sizeMap: Record<InputSize, "1" | "2" | "3"> = {
  sm: "1",
  md: "2",
  lg: "3",
};

type InputRadixProps = WithoutRadixLayout<ComponentProps<typeof TextField.Root>>;

export interface InputProps extends Pick<
  InputRadixProps,
  | "className"
  | "defaultValue"
  | "disabled"
  | "placeholder"
  | "radius"
  | "readOnly"
  | "required"
  | "title"
  | "type"
  | "value"
  | "variant"
> {
  /** Высота поля: sm, md, lg. */
  inputSize?: InputSize;
  /** Стиль ошибки: красная обводка и aria-invalid. */
  invalid?: boolean;
  /** Дополнительные CSS-классы. */
  className?: InputRadixProps["className"];
  /** Начальное значение (неконтролируемый). */
  defaultValue?: InputRadixProps["defaultValue"];
  /** Отключает ввод. */
  disabled?: InputRadixProps["disabled"];
  /** Подсказка в пустом поле. */
  placeholder?: InputRadixProps["placeholder"];
  /** Скругление углов. */
  radius?: InputRadixProps["radius"];
  /** Только для чтения. */
  readOnly?: InputRadixProps["readOnly"];
  /** Обязательное поле. */
  required?: InputRadixProps["required"];
  /** Всплывающая подсказка (HTML title). */
  title?: InputRadixProps["title"];
  /** Тип HTML-input. */
  type?: InputRadixProps["type"];
  /** Контролируемое значение. */
  value?: InputRadixProps["value"];
  /** Вариант поверхности Radix TextField. */
  variant?: InputRadixProps["variant"];
}

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
