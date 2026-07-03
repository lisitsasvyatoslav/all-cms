import { Badge, Box, Card, Flex, Heading, Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";

import { SourceLinkIcon } from "@/components/portal/sources/source-link-icons";
import { PortalCodeBlock } from "@/components/portal/documentation/portal-code-block";
import { PortalPageContainer } from "@/components/portal/layout/portal-shell";
import { PortalMarkdown } from "@/components/portal/documentation/portal-markdown";
import type { NormalizedDsOverviewPage } from "@/lib/portal/components/load-ds-overview";
import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  page: NormalizedDsOverviewPage;
};

export function DsHomePageView({ page }: Props) {
  return (
    <PortalPageContainer>
      <Flex direction="column" gap="8">
        <Box id="overview" className={portalClass.scrollTarget}>
          <Text size="2" color="gray" weight="medium">
            {page.eyebrow}
          </Text>
          <Heading size="8" weight="medium" mt="2">
            {page.title}
          </Heading>
          <Text as="p" size="4" color="gray" mt="3" className={portalClass.lead}>
            {page.lead}
          </Text>

          {page.installationHeading ? <Box id="getting-started" mt="7" className={portalClass.scrollTarget}>
            <Heading as="h2" size="5" mb="2">
              {page.installationHeading}
            </Heading>
            <Text as="p" size="2" color="gray" mb="4" className={portalClass.lead}>
              {page.installationIntro}
            </Text>
            <Flex direction="column" gap="3">
              {page.installCommands.length ? (
                <PortalCodeBlock title="Установка" code={page.installCommands.join("\n")} />
              ) : null}
              {page.setupCode ? (
                <PortalCodeBlock title="Стили и Theme provider" code={page.setupCode} />
              ) : null}
            </Flex>
          </Box> : null}

          {page.usageGuideMarkdown ? (
            <Box id="usage-guide" mt="7" className={portalClass.scrollTarget}>
              <PortalMarkdown markdown={page.usageGuideMarkdown} />
            </Box>
          ) : null}

          {page.capabilities.length ? (
            <Box mt="6">
              <Heading as="h3" size="3" mb="3">
                {page.capabilitiesHeading}
              </Heading>
              <ul className={portalClass.dsOverviewList}>
                {page.capabilities.map((item) => (
                  <li key={item}>
                    <Text as="span" size="2" color="gray">
                      {item}
                    </Text>
                  </li>
                ))}
              </ul>
            </Box>
          ) : null}

          {page.stackItems.length ? (
            <Box mt="5">
              <Heading as="h3" size="3" mb="3">
                {page.stackHeading}
              </Heading>
              <Flex wrap="wrap" gap="2">
                {page.stackItems.map((item) => (
                  <Badge key={item} size="2" variant="soft" color="gray" radius="large">
                    {item}
                  </Badge>
                ))}
              </Flex>
            </Box>
          ) : null}

          {page.navigationNote ? (
            <Text as="p" size="2" color="gray" mt="5" className={portalClass.textPreWrap}>
              {page.navigationNote}
            </Text>
          ) : null}

          {page.roadmap.length ? (
            <Box mt="6">
              <Heading as="h3" size="3" mb="3">
                {page.roadmapHeading}
              </Heading>
              <ul className={portalClass.dsOverviewList}>
                {page.roadmap.map((item) => (
                  <li key={item}>
                    <Text as="span" size="2" color="gray">
                      {item}
                    </Text>
                  </li>
                ))}
              </ul>
            </Box>
          ) : null}

          <Box mt="6" className={portalClass.borderBottom} pb="6" />
        </Box>

        <Box id="sources" className={portalClass.scrollTarget} pb="6">
          <Heading as="h2" size="4" mb="2">
            {page.sourcesHeading}
          </Heading>
          {page.sourcesIntro ? (
            <Text as="p" size="2" color="gray" mb="5" className={portalClass.textPreWrap}>
              {page.sourcesIntro}
            </Text>
          ) : null}

          {page.sourceItems.length ? (
            <div className={portalClass.dsSourceGrid}>
              {page.sourceItems.map((item) => (
                <DsSourceCard key={`${item.label}-${item.href}`} item={item} />
              ))}
            </div>
          ) : (
            <Text size="2" color="gray">
              Добавьте карточки в Globals → «DS · Главная» → вкладка «Источники».
            </Text>
          )}
        </Box>
      </Flex>
    </PortalPageContainer>
  );
}

function DsSourceCard({
  item,
}: {
  item: NormalizedDsOverviewPage["sourceItems"][number];
}) {
  const content = (
    <>
      <span className={portalClass.dsSourceCardIcon} aria-hidden>
        <SourceLinkIcon kind={item.icon} />
      </span>
      <span className={portalClass.dsSourceCardBody}>
        <span className={portalClass.dsSourceCardTitle}>{item.label}</span>
        {item.description ? (
          <span className={portalClass.dsSourceCardDescription}>{item.description}</span>
        ) : null}
      </span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        className={portalClass.dsSourceCardLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Card size="2" variant="surface" className={portalClass.dsSourceCard}>
          {content}
        </Card>
      </a>
    );
  }

  return (
    <Link asChild className={portalClass.dsSourceCardLink}>
      <NextLink href={item.href}>
        <Card size="2" variant="surface" className={portalClass.dsSourceCard}>
          {content}
        </Card>
      </NextLink>
    </Link>
  );
}
