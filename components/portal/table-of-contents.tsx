"use client";

import { Link, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

import { portalClass } from "@/lib/portal/classes";
import type { TocItem } from "@/lib/toc/get-toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el != null);

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -75% 0px", threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="На этой странице" className="portal-toc-nav">
      <Text size="2" weight="medium" mb="3" as="p">
        На этой странице
      </Text>
      <ul className={portalClass.tocList}>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              size="2"
              color={activeId === item.id ? undefined : "gray"}
              weight={activeId === item.id ? "medium" : "regular"}
              underline={activeId === item.id ? "always" : "hover"}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
