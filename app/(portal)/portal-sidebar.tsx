"use client";

import { Box, Flex, Link, Text } from "@radix-ui/themes";
import type { Component } from "@/payload-types";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { PortalAppearanceToggle } from "@/components/providers/portal-theme-provider";
import { PortalComponentStatusBadge } from "@/components/portal/portal-component-status-badge";
import { PortalSidebarFrameworkFilter } from "@/components/portal/portal-sidebar-framework-filter";
import { PortalSidebarLink } from "@/components/portal/portal-nav-item";
import { portalClass } from "@/lib/portal/classes";
import { componentSlugFromWebPathname, componentWebPagePath, PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/component-routes";

export type SidebarComponent = {
  slug: string;
  name: string;
  status?: Component["status"] | null;
};

type Props = {
  components: SidebarComponent[];
};

const SIDEBAR_SCROLLBAR_HIDE_MS = 700;

export function PortalSidebar({ components }: Props) {
  const pathname = usePathname();
  const [hash, setHash] = useState("#overview");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      setHash(window.location.hash || "#overview");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      node.dataset.scrolling = "true";
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        delete node.dataset.scrolling;
      }, SIDEBAR_SCROLLBAR_HIDE_MS);
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      node.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const onHome = pathname === "/";
  const onComponentsWeb = pathname === PORTAL_COMPONENTS_WEB_PATH;
  const activeComponentSlug = componentSlugFromWebPathname(pathname) ?? "";

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
        <Box mt="3">
          <PortalSidebarFrameworkFilter />
        </Box>
      </Box>

      <div ref={scrollRef} className={portalClass.sidebarScroll}>
        <nav className={portalClass.sidebarNav}>
          <SidebarSectionLabel>Главная</SidebarSectionLabel>
          <PortalSidebarLink
            href="/#overview"
            active={onHome && (hash === "#overview" || hash === "")}
          >
            Обзор
          </PortalSidebarLink>
          <PortalSidebarLink href="/#sources" active={onHome && hash === "#sources"}>
            Источники
          </PortalSidebarLink>

          <SidebarSectionLabel>Компоненты</SidebarSectionLabel>
          <PortalSidebarLink href={PORTAL_COMPONENTS_WEB_PATH} active={onComponentsWeb}>
            Все компоненты
          </PortalSidebarLink>
          {components.map((c) => (
            <PortalSidebarLink
              key={c.slug}
              href={componentWebPagePath(c.slug)}
              active={activeComponentSlug === c.slug}
              badge={
                <PortalComponentStatusBadge status={c.status} variant="sidebar" />
              }
            >
              {c.name}
            </PortalSidebarLink>
          ))}

          <SidebarSectionLabel>Основы</SidebarSectionLabel>
          <PortalSidebarLink href="/#colors" active={onHome && hash === "#colors"}>
            Цвета
          </PortalSidebarLink>
          <PortalSidebarLink href="/#icons" active={onHome && hash === "#icons"}>
            Иконки
          </PortalSidebarLink>

          <SidebarSectionLabel>Справочник</SidebarSectionLabel>
          <PortalSidebarLink
            href="/showcase/documentation-blocks"
            active={pathname === "/showcase/documentation-blocks"}
          >
            Блоки документации
          </PortalSidebarLink>
        </nav>
      </div>

      <Flex
        align="center"
        gap="2"
        p="3"
        className={portalClass.sidebarFooter}
      >
        <PortalAppearanceToggle />
        <Box flexGrow="1" minWidth="0">
          <PortalSidebarLink href="/admin" active={false}>
            Payload Admin →
          </PortalSidebarLink>
        </Box>
      </Flex>
    </Flex>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return <p className={portalClass.sidebarSectionLabel}>{children}</p>;
}
