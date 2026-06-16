import Link from "next/link";
import type { ReactNode } from "react";

import { SourceLinkIcon } from "@/components/portal/source-link-icons";
import { portalClass } from "@/lib/portal/classes";
import {
  resolveSourceLinkIcon,
  type SourceLinkIconKind,
} from "@/lib/portal/source-link-icon";

type Props = {
  href: string;
  children: ReactNode;
  /** Внешняя ссылка: target _blank */
  external?: boolean;
  /** Явная иконка; иначе определяется по тексту и URL */
  icon?: SourceLinkIconKind;
};

export function PortalSourcePill({ href, children, external = true, icon }: Props) {
  const label = typeof children === "string" ? children : "";
  const iconKind = icon ?? resolveSourceLinkIcon(label, href);

  const content = (
    <>
      <span className="portal-source-pill__icon">
        <SourceLinkIcon kind={iconKind} />
      </span>
      <span className="portal-source-pill__label">{children}</span>
    </>
  );

  if (!external) {
    return (
      <Link href={href} className={portalClass.sourcePill}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={portalClass.sourcePill}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}
