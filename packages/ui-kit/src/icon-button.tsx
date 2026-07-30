import { IconButton as RadixIconButton } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

export type IconButtonSize = "sm" | "md" | "lg";

const sizeMap: Record<IconButtonSize, ComponentProps<typeof RadixIconButton>["size"]> = {
  sm: "1",
  md: "2",
  lg: "3",
};

type IconButtonRadixProps = WithoutRadixLayout<
  Omit<ComponentProps<typeof RadixIconButton>, "size" | "aria-label">
>;

export interface IconButtonProps extends Pick<
  IconButtonRadixProps,
  "asChild" | "className" | "disabled" | "highContrast" | "loading" | "onClick" | "radius" | "title" | "type" | "value" | "variant"
> {
  /** Размер: sm, md, lg. */
  size?: IconButtonSize;
  /** Текст для aria-label — обязателен для скринридеров. */
  label: string;
  /** Иконка или содержимое кнопки. */
  children: ReactNode;
  /** Рендерит дочерний элемент вместо корня. */
  asChild?: IconButtonRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: IconButtonRadixProps["className"];
  /** Отключает взаимодействие. */
  disabled?: IconButtonRadixProps["disabled"];
  /** Повышенная контрастность. */
  highContrast?: IconButtonRadixProps["highContrast"];
  /** Индикатор загрузки. */
  loading?: IconButtonRadixProps["loading"];
  /** Скругление углов. */
  radius?: IconButtonRadixProps["radius"];
  /** Всплывающая подсказка (HTML title). */
  title?: IconButtonRadixProps["title"];
  /** Семантика для форм. */
  type?: IconButtonRadixProps["type"];
  /** Значение для формы. */
  value?: IconButtonRadixProps["value"];
  /** Визуальный вариант Radix IconButton. */
  variant?: IconButtonRadixProps["variant"];
}

export function IconButton({ size = "md", label, children, ...rest }: IconButtonProps) {
  return (
    <RadixIconButton size={sizeMap[size]} aria-label={label} {...rest}>
      {children}
    </RadixIconButton>
  );
}
