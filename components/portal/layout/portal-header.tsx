import { Flex, IconButton } from "@radix-ui/themes";
import NextLink from "next/link";

import { PortalHeaderNav } from "@/components/portal/layout/portal-header-nav";
import { SourceLinkIcon } from "@/components/portal/sources/source-link-icons";
import { portalClass } from "@/lib/portal/core/classes";
import type { SourceLinkIconKind } from "@/lib/portal/core/source-link-icon";
import type { PortalSourcesLinks } from "@/lib/portal/core/load-portal-sources";
import { PORTAL_HOME_PATH } from "@/lib/portal/components/routes";

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

      <PortalHeaderNav />

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
