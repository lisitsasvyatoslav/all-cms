import { Flex, Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import type { ReactNode } from "react";

type Crumb = { label: ReactNode; href?: string; mono?: boolean };

export function PortalBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" style={{ marginBottom: "var(--space-4)" }}>
      <Flex as="div" gap="1" align="center" wrap="wrap">
        <ol className="flex flex-wrap items-center gap-1 list-none p-0 m-0">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 ? (
                <Text size="2" color="gray" as="span">
                  /
                </Text>
              ) : null}
              {item.href ? (
                <Link asChild size="2" color="gray" highContrast={false}>
                  <NextLink
                    href={item.href}
                    className={item.mono ? "font-mono" : undefined}
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
                  className={item.mono ? "font-mono" : undefined}
                >
                  {item.label}
                </Text>
              )}
            </li>
          ))}
        </ol>
      </Flex>
    </nav>
  );
}
