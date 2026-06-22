"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Box, ChevronDownIcon, Flex, Grid, Heading, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

export type TypographyScaleRow = {
  name: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  weight?: 400 | 500 | 700;
};

export type TypographyScaleGroup = {
  id: string;
  title: string;
  rows: TypographyScaleRow[];
};

type Props = {
  groups: TypographyScaleGroup[];
};

const SAMPLE_TEXT = "Design System";

function BrandTypographyScaleRows({ rows }: { rows: TypographyScaleRow[] }) {
  return (
    <Flex direction="column" gap="3" className={portalClass.brandTypeScaleList}>
      {rows.map((row) => (
        <Box key={row.name} className={portalClass.brandTypeScaleRow}>
          <Grid
            columns={{ initial: "1", md: "minmax(0, 11rem) minmax(0, 1fr)" }}
            gap="4"
            align="center"
          >
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">
                {row.name}
              </Text>
              <Text size="1" color="gray" as="div">
                Font size: {row.fontSize}
              </Text>
              <Text size="1" color="gray" as="div">
                Line height: {row.lineHeight}
              </Text>
              <Text size="1" color="gray" as="div">
                Letter spacing: {row.letterSpacing}
              </Text>
            </Flex>
            <Text
              as="p"
              className={portalClass.brandTypeScaleSample}
              style={{
                fontFamily: "var(--font-inter, var(--default-font-family))",
                fontSize: `${row.fontSize}px`,
                lineHeight: `${row.lineHeight}px`,
                letterSpacing: `${row.letterSpacing}px`,
                fontWeight: row.weight ?? 400,
              }}
            >
              {SAMPLE_TEXT}
            </Text>
          </Grid>
        </Box>
      ))}
    </Flex>
  );
}

export function BrandTypographyScale({ groups }: Props) {
  if (!groups.length) return null;

  return (
    <Accordion.Root
      type="multiple"
      className={`${portalClass.glossaryAccordion} ${portalClass.brandTypeScaleAccordion}`}
    >
      {groups.map((group) => (
        <Accordion.Item
          key={group.id}
          value={group.id}
          id={group.id}
          className={portalClass.glossaryAccordionItem}
        >
          <Accordion.Header className={portalClass.glossaryAccordionHeader}>
            <Accordion.Trigger className={portalClass.glossaryAccordionTrigger}>
              <Heading as="h3" size="4" weight="medium">
                {group.title}
              </Heading>
              <ChevronDownIcon className={portalClass.glossaryAccordionChevron} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={portalClass.glossaryAccordionContent}>
            <div className={portalClass.glossaryAccordionContentInner}>
              <BrandTypographyScaleRows rows={group.rows} />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
