import { Badge } from "@radix-ui/themes";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  /** Внешняя ссылка: target _blank и ↗ */
  external?: boolean;
};

export function PortalSourcePill({ href, children, external = true }: Props) {
  return (
    <Badge variant="soft" size="2" asChild>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {external ? (
          <span aria-hidden style={{ marginLeft: "0.2em" }}>
            ↗
          </span>
        ) : null}
      </a>
    </Badge>
  );
}
