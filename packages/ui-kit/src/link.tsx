import { Link as RadixLink } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

type LinkRadixProps = WithoutRadixLayout<ComponentProps<typeof RadixLink>>;

export interface LinkProps extends Pick<
  LinkRadixProps,
  "asChild" | "className" | "highContrast" | "href" | "target" | "title" | "type"
> {
  /** Рендерит дочерний элемент вместо корня. */
  asChild?: LinkRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: LinkRadixProps["className"];
  /** Повышенная контрастность. */
  highContrast?: LinkRadixProps["highContrast"];
  /** URL перехода. */
  href?: LinkRadixProps["href"];
  /** Куда открыть ссылку (_blank и т.д.). */
  target?: LinkRadixProps["target"];
  /** Всплывающая подсказка (HTML title). */
  title?: LinkRadixProps["title"];
  /** MIME или тип ссылки (редко используется). */
  type?: LinkRadixProps["type"];
  /** Текст ссылки. */
  children?: ReactNode;
}

export function Link(props: LinkProps) {
  return <RadixLink {...props} />;
}
