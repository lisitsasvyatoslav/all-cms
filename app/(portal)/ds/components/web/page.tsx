import { Box, Heading, Text } from "@radix-ui/themes";
import type { Metadata } from "next";

import { ComponentsCatalog } from "@/components/portal/components-catalog";
import { ComponentsCatalogFrameworkTabs } from "@/components/portal/components-catalog-framework-tabs";
import { PortalBreadcrumbs } from "@/components/portal/portal-breadcrumbs";
import {
  PortalPageContainer,
  PortalPageWithToc,
} from "@/components/portal/portal-shell";
import { TableOfContents } from "@/components/portal/table-of-contents";
import { buildComponentsCatalogOpenGraphMetadata } from "@/lib/portal/component-open-graph";
import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/component-routes";
import { portalClass } from "@/lib/portal/classes";
import { loadComponentsCatalogGroups } from "@/lib/portal/group-components-by-folder";
import type { TocItem } from "@/lib/toc/get-toc";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildComponentsCatalogOpenGraphMetadata();
}

export default async function ComponentsWebPage() {
  const groups = await loadComponentsCatalogGroups();
  const tocItems: TocItem[] = groups.map((group) => ({
    id: group.id,
    label: group.name,
  }));

  const main = (
    <>
      <PortalBreadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Components", href: PORTAL_COMPONENTS_WEB_PATH },
          { label: "Web" },
        ]}
      />

      <Box className={portalClass.componentsCatalogHeader}>
        <Heading size="8" weight="bold">
          Components
        </Heading>
        <Text as="p" size="3" color="gray" mt="2" className={portalClass.lead}>
          Все компоненты дизайн-системы, сгруппированные по разделам CMS.
        </Text>
        <ComponentsCatalogFrameworkTabs activeFrameworkId="web" />
      </Box>

      <ComponentsCatalog groups={groups} />
    </>
  );

  return (
    <PortalPageContainer wide>
      {tocItems.length > 1 ? (
        <PortalPageWithToc
          main={main}
          toc={<TableOfContents items={tocItems} />}
        />
      ) : (
        main
      )}
    </PortalPageContainer>
  );
}
