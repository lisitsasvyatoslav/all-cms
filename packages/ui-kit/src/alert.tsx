import { Callout } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

export type AlertVariant = "info" | "success" | "warning" | "error";

const colorMap: Record<AlertVariant, ComponentProps<typeof Callout.Root>["color"]> = {
  info: "blue",
  success: "green",
  warning: "amber",
  error: "red",
};

type AlertRadixProps = WithoutRadixLayout<Omit<ComponentProps<typeof Callout.Root>, "color">>;

export interface AlertProps extends Pick<AlertRadixProps, "asChild" | "className" | "highContrast" | "variant"> {
  /** Семантика: info, success, warning, error. */
  alertVariant?: AlertVariant;
  /** Заголовок — выделяется жирным перед текстом. */
  title?: ReactNode;
  /** Основной текст уведомления. */
  children: ReactNode;
  /** Рендерит дочерний элемент вместо корня (Radix Slot). */
  asChild?: AlertRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: AlertRadixProps["className"];
  /** Повышенная контрастность. */
  highContrast?: AlertRadixProps["highContrast"];
  /** Вариант поверхности Radix Callout. */
  variant?: AlertRadixProps["variant"];
}

export function Alert({ alertVariant = "info", title, children, ...rest }: AlertProps) {
  return (
    <Callout.Root color={colorMap[alertVariant]} {...rest}>
      <Callout.Text>
        {title ? (
          <>
            <strong>{title}</strong>{" "}
          </>
        ) : null}
        {children}
      </Callout.Text>
    </Callout.Root>
  );
}
