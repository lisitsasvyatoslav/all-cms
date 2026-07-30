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
        <Box>
          <Heading size="8" weight="medium" mb="2">
            {page.title}
          </Heading>
          {page.description ? (
            <Text as="p" size="4" color="gray" className={portalClass.lead}>
              {page.description}
            </Text>
          ) : null}
        </Box>
        <ComponentDocumentation blocks={page.documentation} omitPropsTable omitChecklist />
      </PortalSection>
    </PortalPageContainer>
  );
}
