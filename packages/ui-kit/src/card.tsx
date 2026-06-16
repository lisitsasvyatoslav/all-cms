import { Card as RadixCard, Heading, Text } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

type CardRadixProps = WithoutRadixLayout<ComponentProps<typeof RadixCard>>;

export interface CardProps extends Pick<CardRadixProps, "asChild" | "className" | "variant"> {
  /** Заголовок карточки. */
  title?: ReactNode;
  /** Краткое описание под заголовком. */
  description?: ReactNode;
  /** Рендерит дочерний элемент вместо корня. */
  asChild?: CardRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: CardRadixProps["className"];
  /** Стиль поверхности: surface, classic, ghost. */
  variant?: CardRadixProps["variant"];
  /** Основное содержимое карточки. */
  children?: ReactNode;
}

export function Card({ title, description, children, ...rest }: CardProps) {
  return (
    <RadixCard size="2" {...rest}>
      {title ? (
        <Heading size="3" mb="1">
          {title}
        </Heading>
      ) : null}
      {description ? (
        <Text as="p" size="2" color="gray" mb="3">
          {description}
        </Text>
      ) : null}
      {children}
    </RadixCard>
  );
}
