"use client";

import { ScrollArea, Text } from "@radix-ui/themes";
import NextLink from "next/link";

import { PortalAppearanceToggle } from "@/components/providers/portal-theme-provider";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type SidebarComponent = { slug: string; name: string };

type Props = {
  components: SidebarComponent[];
};

const navItemClass = (active: boolean) =>
  [
    "block rounded-md px-2 py-1.5 text-sm leading-snug no-underline transition-colors",
    active
      ? "bg-zinc-200/80 font-medium text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
      : "font-normal text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
  ].join(" ");

export function PortalSidebar({ components }: Props) {
  const pathname = usePathname();
  const [hash, setHash] = useState("#overview");

  useEffect(() => {
    const sync = () => {
      setHash(window.location.hash || "#overview");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const onHome = pathname === "/";
  const activeComponentSlug = pathname.startsWith("/components/")
    ? (pathname.slice("/components/".length).split("/")[0] ?? "")
    : "";

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-zinc-200/80 bg-zinc-50/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <NextLink
          href="/"
          className="text-base font-semibold tracking-tight text-zinc-900 no-underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200"
        >
          Design System
        </NextLink>
        <Text size="1" color="gray" mt="1" as="p">
          Документация
        </Text>
      </div>
      <ScrollArea type="auto" scrollbars="vertical" className="flex-1">
        <nav className="flex flex-col gap-0.5 p-3">
          <SidebarSectionLabel>Главная</SidebarSectionLabel>
          <SidebarHashLink
            href="/#overview"
            active={onHome && (hash === "#overview" || hash === "")}
          >
            Обзор
          </SidebarHashLink>
          <SidebarHashLink href="/#sources" active={onHome && hash === "#sources"}>
            Источники
          </SidebarHashLink>

          <SidebarSectionLabel className="mt-4">Компоненты</SidebarSectionLabel>
          {components.map((c) => (
            <NextLink
              key={c.slug}
              href={`/components/${c.slug}`}
              className={navItemClass(activeComponentSlug === c.slug)}
            >
              {c.name}
            </NextLink>
          ))}

          <SidebarSectionLabel className="mt-4">Основы</SidebarSectionLabel>
          <SidebarHashLink href="/#colors" active={onHome && hash === "#colors"}>
            Цвета
          </SidebarHashLink>
          <SidebarHashLink href="/#icons" active={onHome && hash === "#icons"}>
            Иконки
          </SidebarHashLink>
        </nav>
      </ScrollArea>
      <div className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
        <PortalAppearanceToggle />
        <NextLink href="/admin" className={`${navItemClass(false)} min-w-0 flex-1`}>
          Payload Admin →
        </NextLink>
      </div>
    </aside>
  );
}

function SidebarSectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400 ${className}`}
    >
      {children}
    </p>
  );
}

function SidebarHashLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={navItemClass(active)}>
      {children}
    </a>
  );
}
