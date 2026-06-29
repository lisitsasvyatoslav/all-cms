"use client";

import { TextField } from "@radix-ui/themes";
import { useState, type ComponentProps } from "react";

import { IconButton } from "./icon-button";
import type { InputSize } from "./input";
import { WithoutRadixLayout } from "./without-radix-layout";

const sizeMap: Record<InputSize, "1" | "2" | "3"> = {
  sm: "1",
  md: "2",
  lg: "3",
};

type TextFieldRootProps = WithoutRadixLayout<ComponentProps<typeof TextField.Root>>;

export interface PasswordInputProps extends Pick<
  TextFieldRootProps,
  | "className"
  | "defaultValue"
  | "disabled"
  | "placeholder"
  | "radius"
  | "readOnly"
  | "required"
  | "title"
  | "value"
  | "variant"
> {
  /** Высота поля: sm, md, lg. */
  inputSize?: InputSize;
  /** Стиль ошибки: красная обводка и aria-invalid. */
  invalid?: boolean;
  /** Дополнительные CSS-классы. */
  className?: TextFieldRootProps["className"];
  /** Начальное значение (неконтролируемый). */
  defaultValue?: TextFieldRootProps["defaultValue"];
  /** Отключает ввод. */
  disabled?: TextFieldRootProps["disabled"];
  /** Подсказка в пустом поле. */
  placeholder?: TextFieldRootProps["placeholder"];
  /** Скругление углов. */
  radius?: TextFieldRootProps["radius"];
  /** Только для чтения. */
  readOnly?: TextFieldRootProps["readOnly"];
  /** Обязательное поле. */
  required?: TextFieldRootProps["required"];
  /** Всплывающая подсказка (HTML title). */
  title?: TextFieldRootProps["title"];
  /** Контролируемое значение. */
  value?: TextFieldRootProps["value"];
  /** Вариант поверхности Radix TextField. */
  variant?: TextFieldRootProps["variant"];
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
        <path
          d="M7.5 11.5C10.5 11.5 13 9 13.5 7.5C13 6 10.5 3.5 7.5 3.5C4.5 3.5 2 6 1.5 7.5C2 9 4.5 11.5 7.5 11.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 2L13 13" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M7.5 11.5C10.5 11.5 13 9 13.5 7.5C13 6 10.5 3.5 7.5 3.5C4.5 3.5 2 6 1.5 7.5C2 9 4.5 11.5 7.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PasswordInput({
  inputSize = "md",
  invalid = false,
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField.Root
      size={sizeMap[inputSize]}
      color={invalid ? "red" : undefined}
      type={visible ? "text" : "password"}
      aria-invalid={invalid}
      {...rest}
    >
      <TextField.Slot side="right" pr="1">
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          label={visible ? "Скрыть пароль" : "Показать пароль"}
          onClick={() => setVisible((next) => !next)}
        >
          <EyeIcon hidden={!visible} />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
}
