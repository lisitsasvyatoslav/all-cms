import { Box, Heading, Separator, Text } from "@radix-ui/themes";

import { GlossaryPrinciplesAccordion } from "@/components/portal/glossary-principles-accordion";
import { GlossaryTermsList } from "@/components/portal/glossary-terms-list";
import { PortalBreadcrumbs } from "@/components/portal/portal-breadcrumbs";
import { PortalHeaderDivider, PortalPageContainer } from "@/components/portal/portal-shell";
import type { NormalizedTextGlossaryPage } from "@/lib/portal/load-text-glossary";
import type { GlossaryTermRow } from "@/lib/portal/group-glossary-terms";
import { groupGlossaryTermsByLetter } from "@/lib/portal/group-glossary-terms";
import { portalClass } from "@/lib/portal/classes";
import { PORTAL_TEXT_PATH } from "@/lib/portal/portal-base-path";

type Props = {
  page: NormalizedTextGlossaryPage;
  terms: GlossaryTermRow[];
};

export function TextGlossaryPageView({ page, terms }: Props) {
  const letterGroups = groupGlossaryTermsByLetter(terms);

  return (
    <PortalPageContainer>
      <PortalBreadcrumbs
        items={[
          { label: "Text", href: PORTAL_TEXT_PATH },
          { label: page.title },
        ]}
      />

      <header>
        <Heading size="8" weight="medium" mb="3">
          {page.title}
        </Heading>
        {page.intro ? (
          <Text as="p" size="4" color="gray" className={portalClass.lead}>
            {page.intro}
          </Text>
        ) : null}
        <PortalHeaderDivider />
      </header>

      <section className={portalClass.glossarySection} aria-labelledby="glossary-principles-heading">
        <GlossaryPrinciplesAccordion
          heading={page.principlesHeading}
          principles={page.principles}
          footer={page.principlesFooter}
        />
      </section>

      <section className={portalClass.glossarySection} aria-labelledby="glossary-terms-heading">
        <Heading as="h2" size="6" weight="medium" mb="5" id="glossary-terms-heading">
          {page.termsSectionHeading}
        </Heading>

        {letterGroups.length ? (
          <Box className={portalClass.glossaryGroups}>
            {letterGroups.map((group) => (
              <Box key={group.letter} className={portalClass.glossaryGroup}>
                <div className={portalClass.glossaryLetter} aria-hidden="true">
                  {group.letter}
                </div>
                <GlossaryTermsList terms={group.terms} />
              </Box>
            ))}
          </Box>
        ) : (
          <>
            <Separator size="4" mb="4" />
            <GlossaryTermsList terms={[]} />
          </>
        )}
      </section>
    </PortalPageContainer>
  );
}
