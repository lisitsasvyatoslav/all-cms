import { Box, Heading, Text } from "@radix-ui/themes";

import { ComponentsCatalog } from "@/components/portal/catalog/components-catalog";
import { ComponentsCatalogFrameworkTabs } from "@/components/portal/catalog/components-catalog-framework-tabs";
import { PortalBreadcrumbs } from "@/components/portal/layout/portal-breadcrumbs";
import {
  PortalPageContainer,
  PortalPageWithToc,
} from "@/components/portal/layout/portal-shell";
import { TableOfContents } from "@/components/portal/layout/table-of-contents";
import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/components/routes";
import { portalClass } from "@/lib/portal/core/classes";
import { loadComponentsCatalogGroups } from "@/lib/portal/components/group-by-folder";
import type { TocItem } from "@/lib/toc/get-toc";

export async function ComponentsCatalogPageBody() {
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
        <PortalPageWithToc main={main} toc={<TableOfContents items={tocItems} />} />
      ) : (
        main
      )}
    </PortalPageContainer>
  );
}
