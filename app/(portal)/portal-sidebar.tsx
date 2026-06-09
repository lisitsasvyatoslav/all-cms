"use client";

import { Box, Flex, Link, ScrollArea, Text } from "@radix-ui/themes";
import type { Component } from "@/payload-types";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { PortalAppearanceToggle } from "@/components/providers/portal-theme-provider";
import { PortalComponentStatusBadge } from "@/components/portal/portal-component-status-badge";
import { PortalNavItem } from "@/components/portal/portal-nav-item";
import { portalClass } from "@/lib/portal/classes";

export type SidebarComponent = {
  slug: string;
  name: string;
  status?: Component["status"] | null;
};

type Props = {
  components: SidebarComponent[];
};

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
    <Flex direction="column" className="portal-sidebar">
      <Box px="4" py="4">
        <Link asChild size="3" weight="bold">
          <NextLink href="/" className={portalClass.linkPlain}>
            Design System
          </NextLink>
        </Link>
        <Text size="1" color="gray" mt="1" as="p">
          Документация
        </Text>
      </Box>

      <ScrollArea type="auto" scrollbars="vertical" className={portalClass.sidebarScroll}>
        <nav className={portalClass.sidebarNav}>
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

            <Box mt="4">
              <SidebarSectionLabel>Компоненты</SidebarSectionLabel>
            </Box>
            {components.map((c) => (
              <PortalNavItem key={c.slug} active={activeComponentSlug === c.slug}>
                <Flex align="center" gap="2" wrap="wrap" className={portalClass.navItemRow}>
                  <Link asChild size="2" color="gray" highContrast={activeComponentSlug === c.slug}>
                    <NextLink
                      href={`/components/${c.slug}`}
                      className={portalClass.linkBlock}
                    >
                      {c.name}
                    </NextLink>
                  </Link>
                  <PortalComponentStatusBadge status={c.status} />
                </Flex>
              </PortalNavItem>
            ))}

            <Box mt="4">
              <SidebarSectionLabel>Основы</SidebarSectionLabel>
            </Box>
            <SidebarHashLink href="/#colors" active={onHome && hash === "#colors"}>
              Цвета
            </SidebarHashLink>
            <SidebarHashLink href="/#icons" active={onHome && hash === "#icons"}>
              Иконки
            </SidebarHashLink>

            <Box mt="4">
              <SidebarSectionLabel>Справочник</SidebarSectionLabel>
            </Box>
            <PortalNavItem active={pathname === "/showcase/documentation-blocks"}>
              <Link asChild size="2" color="gray" highContrast={pathname === "/showcase/documentation-blocks"}>
                <NextLink href="/showcase/documentation-blocks" className={portalClass.linkBlock}>
                  Блоки документации
                </NextLink>
              </Link>
            </PortalNavItem>
        </nav>
      </ScrollArea>

      <Flex
        align="center"
        gap="2"
        p="3"
        className={portalClass.sidebarFooter}
      >
        <PortalAppearanceToggle />
        <Box flexGrow="1" minWidth="0">
          <PortalNavItem active={false}>
            <Link asChild size="2" color="gray">
              <NextLink href="/admin" className={portalClass.linkBlock}>
                Payload Admin →
              </NextLink>
            </Link>
          </PortalNavItem>
        </Box>
      </Flex>
    </Flex>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      size="1"
      color="gray"
      weight="medium"
      mb="1"
      as="p"
      className={portalClass.labelCapsWide}
    >
      {children}
    </Text>
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
    <PortalNavItem active={active}>
      <Link href={href} size="2" color="gray" highContrast={active}>
        {children}
      </Link>
    </PortalNavItem>
  );
}
