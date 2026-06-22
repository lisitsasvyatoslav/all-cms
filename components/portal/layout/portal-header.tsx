"use client";

import { Flex, IconButton } from "@radix-ui/themes";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { SourceLinkIcon } from "@/components/portal/sources/source-link-icons";
import { portalClass } from "@/lib/portal/core/classes";
import {
  PORTAL_BASE_PATH,
  PORTAL_BRAND_PATH,
  PORTAL_TEXT_PATH,
  portalAreaFromPathname,
  type PortalAreaId,
} from "@/lib/portal/core/portal-base-path";
import type { SourceLinkIconKind } from "@/lib/portal/core/source-link-icon";
import type { PortalSourcesLinks } from "@/lib/portal/core/load-portal-sources";
import { PORTAL_HOME_PATH } from "@/lib/portal/components/routes";

const PORTAL_AREAS: { id: PortalAreaId; label: string; href: string }[] = [
  { id: "ds", label: "DS", href: PORTAL_BASE_PATH },
  { id: "text", label: "Text", href: PORTAL_TEXT_PATH },
  { id: "brand", label: "Brand", href: PORTAL_BRAND_PATH },
];

const HEADER_SOURCE_LINKS: {
  icon: SourceLinkIconKind;
  label: string;
  urlKey: keyof PortalSourcesLinks;
}[] = [
  { icon: "figma", label: "Figma", urlKey: "figmaUrl" },
  { icon: "github", label: "GitHub", urlKey: "repositoryUrl" },
  { icon: "storybook", label: "Storybook", urlKey: "storybookUrl" },
];

type Props = {
  sources: PortalSourcesLinks;
};

export function PortalHeader({ sources }: Props) {
  const pathname = usePathname();
  const activeArea = portalAreaFromPathname(pathname);
  const visibleSourceLinks = HEADER_SOURCE_LINKS.filter((item) => sources[item.urlKey]);

  return (
    <header className={portalClass.header}>
      <div className={portalClass.headerBrand}>
        <NextLink href={PORTAL_HOME_PATH} className={portalClass.headerBrandTitle}>
          Design System
        </NextLink>
        <span className={portalClass.headerBrandSubtitle} aria-hidden>
          ·
        </span>
        <span className={portalClass.headerBrandSubtitle}>Документация</span>
      </div>

      <nav
        className={portalClass.headerNav}
        role="navigation"
        aria-label="Разделы портала"
      >
        {PORTAL_AREAS.map((area) => (
          <NextLink
            key={area.id}
            href={area.href}
            className={portalClass.headerNavLink}
            data-active={activeArea === area.id ? "true" : undefined}
            aria-current={activeArea === area.id ? "page" : undefined}
          >
            {area.label}
          </NextLink>
        ))}
      </nav>

      {visibleSourceLinks.length ? (
        <Flex
          align="center"
          justify="end"
          gap="1"
          className={portalClass.headerSources}
          aria-label="Источники"
        >
          {visibleSourceLinks.map((item) => {
            const href = sources[item.urlKey];
            if (!href) return null;

            return (
              <IconButton
                key={item.icon}
                asChild
                variant="soft"
                color="gray"
                size="2"
                radius="large"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                >
                  <SourceLinkIcon kind={item.icon} />
                </a>
              </IconButton>
            );
          })}
        </Flex>
      ) : (
        <div className={portalClass.headerSources} aria-hidden />
      )}
    </header>
  );
}
