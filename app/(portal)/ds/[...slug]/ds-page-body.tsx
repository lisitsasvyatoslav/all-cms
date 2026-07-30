import { notFound } from "next/navigation";
import { Box, Heading, Text } from "@radix-ui/themes";

import { PortalBreadcrumbs } from "@/components/portal/layout/portal-breadcrumbs";
import {
  PortalHeaderDivider,
  PortalPageContainer,
  PortalSection,
} from "@/components/portal/layout/portal-shell";
import type { NormalizedDsPage } from "@/lib/portal/ds-pages/load-pages";
import { loadDsPageBySegments } from "@/lib/portal/ds-pages/load-pages";
import { portalClass } from "@/lib/portal/core/classes";

import { ComponentDocumentation } from "../components/web/[slug]/documentation";

type Props =
  | { page: NormalizedDsPage; segments?: never }
  | { segments: string[]; page?: never };

export async function DsPageBody(props: Props) {
  const page =
    "page" in props && props.page
      ? props.page
      : await loadDsPageBySegments(props.segments ?? []);

  if (!page) notFound();

  return (
    <PortalPageContainer>
      <PortalSection>
        <PortalBreadcrumbs items={page.breadcrumbs} />
        <PortalHeaderDivider />
        <Box className={portalClass.pageHeader}>
          <Heading size="8" mb="2">
            {page.title}
          </Heading>
          {page.description ? (
            <Text size="3" color="gray" as="p">
              {page.description}
            </Text>
          ) : null}
        </Box>
        <ComponentDocumentation blocks={page.documentation} omitPropsTable omitChecklist />
      </PortalSection>
    </PortalPageContainer>
  );
}
