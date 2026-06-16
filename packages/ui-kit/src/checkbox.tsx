import { Checkbox as RadixCheckbox, Flex, Text } from "@radix-ui/themes";
import type { ComponentProps } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

type CheckboxRadixProps = WithoutRadixLayout<ComponentProps<typeof RadixCheckbox>>;

export interface CheckboxProps extends Pick<
  CheckboxRadixProps,
  | "checked"
  | "className"
  | "defaultChecked"
  | "disabled"
  | "highContrast"
  | "required"
  | "title"
  | "type"
  | "value"
  | "variant"
> {
  /** Подпись рядом с чекбоксом. */
  label?: string;
  /** Контролируемое состояние. */
  checked?: CheckboxRadixProps["checked"];
  /** Дополнительные CSS-классы. */
  className?: CheckboxRadixProps["className"];
  /** Начальное состояние (неконтролируемый). */
  defaultChecked?: CheckboxRadixProps["defaultChecked"];
  /** Отключает взаимодействие. */
  disabled?: CheckboxRadixProps["disabled"];
  /** Повышенная контрастность. */
  highContrast?: CheckboxRadixProps["highContrast"];
  /** Обязателен для формы. */
  required?: CheckboxRadixProps["required"];
  /** Всплывающая подсказка (HTML title). */
  title?: CheckboxRadixProps["title"];
  /** Тип кнопки при использовании как button. */
  type?: CheckboxRadixProps["type"];
  /** Значение для отправки с формой. */
  value?: CheckboxRadixProps["value"];
  /** Визуальный вариант Radix Checkbox. */
  variant?: CheckboxRadixProps["variant"];
}

export function Checkbox({ label, ...rest }: CheckboxProps) {
  const control = <RadixCheckbox {...rest} />;

  if (!label) return control;

  return (
    <Text as="label" size="2">
      <Flex gap="2" align="center">
        {control}
        {label}
      </Flex>
    </Text>
  );
}
