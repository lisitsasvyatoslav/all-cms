import { Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import type { ReactNode } from "react";

import { portalClass } from "@/lib/portal/classes";

type Crumb = { label: ReactNode; href?: string; mono?: boolean };

export function PortalBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className={portalClass.breadcrumbs}>
      <ol className={`portal-list-unstyled ${portalClass.breadcrumbsList}`}>
        {items.map((item, i) => (
          <li key={i} className={portalClass.breadcrumbsItem}>
            {i > 0 ? (
              <Text size="2" color="gray" as="span">
                /
              </Text>
            ) : null}
            {item.href ? (
              <Link asChild size="2" color="gray">
                <NextLink
                  href={item.href}
                  className={
                    item.mono
                      ? `${portalClass.linkPlain} ${portalClass.codeFont}`
                      : portalClass.linkPlain
                  }
                >
                  {item.label}
                </NextLink>
              </Link>
            ) : (
              <Text
                size="2"
                color="gray"
                highContrast
                as="span"
                className={item.mono ? portalClass.codeFont : undefined}
              >
                {item.label}
              </Text>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
