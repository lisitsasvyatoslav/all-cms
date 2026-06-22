import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";

import { BrandColorChartPalette } from "@/components/portal/brand/brand-color-chart-palette";
import { BrandColorGradients } from "@/components/portal/brand/brand-color-gradients";
import { BrandColorSystem } from "@/components/portal/brand/brand-color-system";
import type { BrandColorData } from "@/lib/portal/brand/color-data";
import { BrandFontSetup } from "@/components/portal/brand/brand-font-setup";
import { BrandTypographyScale } from "@/components/portal/brand/brand-typography-scale";
import { BrandContentAccordion } from "@/components/portal/brand/brand-content-accordion";
import { BrandContentBlocksBody } from "@/components/portal/brand/brand-content-blocks-body";
import {
  BrandLogoBackgroundGrid,
  BrandLogoClearspaceSection,
  BrandLogoMisuseGrid,
} from "@/components/portal/brand/brand-logos-documentation";
import { BrandOverviewCard } from "@/components/portal/brand/brand-overview-card";

import {
  BrandAccentSwatch,
  BrandConsiderationsTable,
  BrandExclusionZone,
  BrandFontStack,
  BrandGuidanceGroup,
  BrandLogoColorRow,
  BrandLogoLockup,
  BrandMinimumSizeTable,
  BrandSubheading,
  BrandWhenApplies,
  BrandYesNoCard,
} from "@/components/portal/brand/brand-spotify-blocks";
import { PortalBreadcrumbs } from "@/components/portal/layout/portal-breadcrumbs";
import {
  PortalHeaderDivider,
  PortalPageContainer,
  PortalPageWithToc,
  PortalSection,
} from "@/components/portal/layout/portal-shell";
import { TableOfContents } from "@/components/portal/layout/table-of-contents";
import { portalClass } from "@/lib/portal/core/classes";
import type {
  BrandPageContent,
  BrandSection,
} from "@/lib/portal/brand/content";
import { getBrandPageToc } from "@/lib/portal/brand/content";
import type { BrandNavItem } from "@/lib/portal/brand/nav";
import { PORTAL_BRAND_PATH } from "@/lib/portal/core/portal-base-path";

type Props = {
  page: BrandPageContent;
  colorData?: BrandColorData | null;
};

export function BrandFoundationPageView({ page, colorData }: Props) {
  const tocItems = getBrandPageToc(page.sections);

  const main = (
    <>
      <PortalBreadcrumbs
        items={[
          { label: "Brand", href: PORTAL_BRAND_PATH },
          { label: page.title },
        ]}
      />

      <header>
        <Heading size="8" weight="medium" mb="3">
          {page.title}
        </Heading>
        <Text as="p" size="4" color="gray" className={portalClass.lead}>
          {page.intro}
        </Text>
        <PortalHeaderDivider />
      </header>

      <Flex direction="column" gap="2">
        {page.sections.map((section) => (
          <BrandSectionView key={section.id} section={section} colorData={colorData} />
        ))}
      </Flex>
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

function BrandSectionView({
  section,
  colorData,
}: {
  section: BrandSection;
  colorData?: BrandColorData | null;
}) {
  switch (section.type) {
    case "prose":
      return (
        <PortalSection id={section.id}>
          {section.heading ? (
            <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          ) : null}
          <Text as="p" size="3" color="gray" className={portalClass.textPreWrapRelaxed}>
            {section.body}
          </Text>
        </PortalSection>
      );

    case "logo-lockup":
      return (
        <PortalSection id={section.id}>
          <BrandLogoLockup
            intro={section.intro}
            fullLogoSrc={section.fullLogoSrc}
            iconSrc={section.iconSrc}
            downloads={section.downloads}
          />
        </PortalSection>
      );

    case "subsection":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          {section.whenApplies ? (
            <BrandWhenApplies>{section.whenApplies}</BrandWhenApplies>
          ) : null}
          {section.body ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.body}
            </Text>
          ) : null}
          {section.guidanceGroups?.map((group) => (
            <BrandGuidanceGroup key={group.title} title={group.title} items={group.items} />
          ))}
          {section.items?.length ? (
            <ul className={portalClass.brandGuidanceList}>
              {section.items.map((item, i) => (
                <li key={i}>
                  <Text size="2">{item}</Text>
                </li>
              ))}
            </ul>
          ) : null}
          {section.considerations?.length ? (
            <>
              <Text size="2" weight="bold" as="p" mt="4" mb="2">
                Ограничения по длине
              </Text>
              <BrandConsiderationsTable rows={section.considerations} />
            </>
          ) : null}
        </PortalSection>
      );

    case "yes-no-grid":
      return (
        <PortalSection id={section.id}>
          {section.heading ? (
            <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          ) : null}
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <Grid
            columns={{
              initial: "1",
              sm: "2",
              md: String(section.columns ?? 2),
            }}
            gap="4"
          >
            {section.items.map((item, i) => (
              <BrandYesNoCard key={i} variant={item.variant} text={item.text} demo={item.demo} />
            ))}
          </Grid>
        </PortalSection>
      );

    case "logo-color-guide":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <BrandLogoColorRow rules={section.rules} />
        </PortalSection>
      );

    case "logo-background-grid":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <Box mt="4">
            <BrandLogoBackgroundGrid rules={section.rules} />
          </Box>
        </PortalSection>
      );

    case "logo-clearspace":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <Box mt="4">
            <BrandLogoClearspaceSection items={section.items} />
          </Box>
        </PortalSection>
      );

    case "logo-misuse-grid":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <Box mt="4">
            <BrandLogoMisuseGrid intro={section.intro} items={section.items} />
          </Box>
        </PortalSection>
      );

    case "exclusion-zone":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <BrandExclusionZone />
        </PortalSection>
      );

    case "minimum-size":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <BrandMinimumSizeTable items={section.items} />
        </PortalSection>
      );

    case "font-recommendation":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          {section.subheading ? (
            <Text size="2" color="gray" mb="2" as="p">
              {section.subheading}
            </Text>
          ) : null}
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <BrandFontStack fonts={section.fonts} />
        </PortalSection>
      );

    case "accent-color":
      return (
        <PortalSection id={section.id}>
          <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
            {section.intro}
          </Text>
          <BrandAccentSwatch hex={section.hex} name={section.name} />
        </PortalSection>
      );

    case "guidance":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <ul className={portalClass.brandGuidanceList}>
            {section.items.map((item, i) => (
              <li key={i}>
                <Text size="2">{item}</Text>
              </li>
            ))}
          </ul>
        </PortalSection>
      );

    case "content-blocks":
      return (
        <PortalSection id={section.id}>
          {section.heading ? (
            <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          ) : null}
          <BrandContentBlocksBody blocks={section.blocks} />
        </PortalSection>
      );

    case "content-accordion":
      return (
        <PortalSection id={section.id}>
          <BrandContentAccordion items={section.items} />
        </PortalSection>
      );

    case "typography-scale":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <BrandTypographyScale groups={section.groups} />
        </PortalSection>
      );

    case "font-setup":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <BrandFontSetup
            desktopLabel={section.desktopLabel}
            downloadHref={section.downloadHref}
            downloadLabel={section.downloadLabel}
            cssLabel={section.cssLabel}
            cssCode={section.cssCode}
          />
        </PortalSection>
      );

    case "color-system":
      return colorData ? (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <BrandColorSystem colorData={colorData} />
        </PortalSection>
      ) : null;

    case "color-gradients":
      return colorData?.gradients.length ? (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <BrandColorGradients gradients={colorData.gradients} />
        </PortalSection>
      ) : null;

    case "color-chart-palette":
      return colorData?.chartPalette ? (
        <PortalSection id={section.id}>
          <BrandSubheading as="h2">{section.heading}</BrandSubheading>
          <BrandColorChartPalette chartPalette={colorData.chartPalette} />
        </PortalSection>
      ) : null;

    case "principles":
      return (
        <PortalSection id={section.id}>
          <BrandSubheading as="h3">{section.heading}</BrandSubheading>
          {section.intro ? (
            <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
              {section.intro}
            </Text>
          ) : null}
          <Grid columns={{ initial: "1", md: "2" }} gap="4">
            {section.principles.map((principle) => (
              <Card key={principle.title} className={portalClass.brandPrincipleCard}>
                <Box p="4">
                  <Text size="3" weight="medium" as="div" mb="2">
                    {principle.title}
                  </Text>
                  <Text size="2" color="gray">
                    {principle.body}
                  </Text>
                </Box>
              </Card>
            ))}
          </Grid>
        </PortalSection>
      );

    default:
      return null;
  }
}

export function BrandOverviewPageView({
  overview,
  navItems,
}: {
  overview: { title: string; intro: string };
  navItems: BrandNavItem[];
}) {
  return (
    <PortalPageContainer wide>
      <PortalBreadcrumbs items={[{ label: "Brand" }]} />

      <header>
        <Heading size="8" weight="medium" mb="3">
          {overview.title}
        </Heading>
        <Text as="p" size="4" color="gray" className={portalClass.lead}>
          {overview.intro}
        </Text>
        <PortalHeaderDivider />
      </header>

      <section aria-label="Разделы бренда" className={portalClass.brandOverviewGrid}>
        {navItems.map((item) => (
          <BrandOverviewCard key={item.href} item={item} />
        ))}
      </section>
    </PortalPageContainer>
  );
}
