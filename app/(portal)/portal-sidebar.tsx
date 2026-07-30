"use client";

import { Box, Flex } from "@radix-ui/themes";
import type { PortalComponentNavGroup } from "@/lib/portal/components/load-nav-groups";
import NextLink from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { PortalAppearanceToggle } from "@/components/providers/portal-theme-provider";
import { PortalComponentStatusBadge } from "@/components/portal/catalog/portal-component-status-badge";
import { PortalSidebarFrameworkFilter } from "@/components/portal/navigation/portal-sidebar-framework-filter";
import { PortalSidebarLink } from "@/components/portal/navigation/portal-nav-item";
import { portalClass } from "@/lib/portal/core/classes";
import {
  portalAreaFromPathname,
  PORTAL_BRAND_PATH,
  PORTAL_TEXT_GLOSSARY_PATH,
  PORTAL_TEXT_PATH,
} from "@/lib/portal/core/portal-base-path";
import type { BrandNavItem } from "@/lib/portal/brand/nav";
import type { DsPageNavItem } from "@/lib/portal/ds-pages/load-pages";
import {
  componentSlugFromWebPathname,
  componentWebPagePath,
  PORTAL_COMPONENTS_WEB_PATH,
  PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
  PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH,
} from "@/lib/portal/components/routes";

export type SidebarComponent = {
  slug: string;
  name: string;
  status?: PortalComponentNavGroup["items"][number]["status"] | null;
};

type Props = {
  componentGroups: PortalComponentNavGroup[];
  brandNavItems: BrandNavItem[];
  dsPageNavItems: DsPageNavItem[];
};

const SIDEBAR_SCROLLBAR_HIDE_MS = 700;

export function PortalSidebar({ componentGroups, brandNavItems, dsPageNavItems }: Props) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const onComponentsWeb = pathname === PORTAL_COMPONENTS_WEB_PATH;
  const activeComponentSlug = componentSlugFromWebPathname(pathname) ?? "";
  const area = portalAreaFromPathname(pathname);
  const onTextHome = pathname === PORTAL_TEXT_PATH;
  const onBrandHome = pathname === PORTAL_BRAND_PATH;

  return (
    <Flex direction="column" className="portal-sidebar">
      {area === "ds" ? (
        <Box px="4" pt="3" pb="2">
          <PortalSidebarFrameworkFilter />
        </Box>
      ) : (
        <Box pt="3" />
      )}

      <div ref={scrollRef} className={portalClass.sidebarScroll}>
        <nav className={portalClass.sidebarNav}>
          {area === "ds" ? (
            <>
              {dsPageNavItems.length > 0 ? (
                <>
                  <SidebarSectionLabel>Обзор</SidebarSectionLabel>
                  {dsPageNavItems.map((item) => (
                    <Box key={item.id} pl={`${3 + item.depth * 2}`}>
                      <PortalSidebarLink href={item.href} active={pathname === item.href}>
                        {item.title}
                      </PortalSidebarLink>
                    </Box>
                  ))}
                </>
              ) : null}

              <SidebarSectionLabel>Компоненты</SidebarSectionLabel>
              <PortalSidebarLink href={PORTAL_COMPONENTS_WEB_PATH} active={onComponentsWeb}>
                Все компоненты
              </PortalSidebarLink>
              {componentGroups.map((group) => (
                <Box key={group.id}>
                  <SidebarSectionLabel>{group.name}</SidebarSectionLabel>
                  {group.items.map((c) => (
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
                </Box>
              ))}

              <SidebarSectionLabel>Справочник</SidebarSectionLabel>
              <PortalSidebarLink
                href={PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH}
                active={pathname === PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH}
              >
                Блоки документации
              </PortalSidebarLink>
              <PortalSidebarLink
                href={PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH}
                active={pathname === PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH}
              >
                Figma-to-Code
              </PortalSidebarLink>
            </>
          ) : null}

          {area === "text" ? (
            <>
              <PortalSidebarLink href={PORTAL_TEXT_PATH} active={onTextHome}>
                Обзор
              </PortalSidebarLink>
              <PortalSidebarLink
                href={PORTAL_TEXT_GLOSSARY_PATH}
                active={pathname === PORTAL_TEXT_GLOSSARY_PATH}
              >
                Глоссарий
              </PortalSidebarLink>
            </>
          ) : null}

          {area === "brand" ? (
            <>
              <PortalSidebarLink href={PORTAL_BRAND_PATH} active={onBrandHome}>
                Обзор
              </PortalSidebarLink>
              {brandNavItems.map((item) => (
                <PortalSidebarLink
                  key={item.href}
                  href={item.href}
                  active={pathname === item.href}
                >
                  {item.label}
                </PortalSidebarLink>
              ))}
            </>
          ) : null}
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
