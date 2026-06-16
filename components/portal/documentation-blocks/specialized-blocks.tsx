import NextLink from "next/link";
import {
  Badge,
  Box,
  Card,
  Code,
  DataList,
  Flex,
  Grid,
  Heading,
  Inset,
  Kbd,
  Link,
  Separator,
  Table,
  Text,
} from "@radix-ui/themes";

import { ChecklistItemIcon } from "@/components/portal/checklist-item-icon";
import { RelatedComponentCard } from "@/components/portal/related-component-card";
import { portalClass } from "@/lib/portal/classes";
import { resolveRelatedComponentPreview } from "@/lib/portal/resolve-related-component-preview";
import { resolveRelatedComponentStorybookUrl } from "@/lib/portal/resolve-related-component-storybook-url";
import { portalSwatchBg } from "@/lib/portal/css-vars";
import type { Component } from "@/payload-types";

import { DocSectionHeading, mediaPublicUrl } from "./shared";
import type { DocumentationBlock } from "./types";

type BlockProps<B extends DocumentationBlock = DocumentationBlock> = {
  block: B;
  tocId?: string;
};

export function AccessibilityBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "accessibility" }>>) {
  const keyboardRows = block.keyboardRows?.filter((r) => r?.keys && r?.description) ?? [];
  const hasIntro =
    block.intro?.trim() || (block.patternLinkUrl?.trim() && block.patternLinkLabel?.trim());

  if (!hasIntro && !keyboardRows.length) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>Accessibility</DocSectionHeading>
      {block.intro ? (
        <Text as="p" size="2" color="gray" mb="3" className={portalClass.textPreWrapRelaxed}>
          {block.intro}
          {block.patternLinkUrl?.trim() && block.patternLinkLabel?.trim() ? (
            <>
              {" "}
              <Link href={block.patternLinkUrl} target="_blank" rel="noopener noreferrer" size="2">
                {block.patternLinkLabel} ↗
              </Link>
            </>
          ) : null}
        </Text>
      ) : null}
      {keyboardRows.length ? (
        <Box mt="4">
          <Heading as="h3" size="3" mb="3">
            Keyboard Interactions
          </Heading>
          <Table.Root variant="surface" size="2">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Key</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {keyboardRows.map((row, i) => (
                <Table.Row key={i}>
                  <Table.RowHeaderCell>
                    <Flex gap="1" wrap="wrap">
                      {row.keys.split("+").map((part, j) => (
                        <Kbd key={j}>{part.trim()}</Kbd>
                      ))}
                    </Flex>
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="2">{row.description}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      ) : null}
    </Box>
  );
}

function resolveRelatedComponent(
  rel: number | Component,
): {
  slug: string;
  name: string;
  storybookUrl: string | null;
  previewLightUrl: string | null;
  previewDarkUrl: string | null;
  previewAlt: string;
} | null {
  if (!rel || typeof rel !== "object") return null;
  if (typeof rel.slug !== "string" || typeof rel.name !== "string") return null;
  const preview = resolveRelatedComponentPreview(rel);
  return {
    slug: rel.slug,
    name: rel.name,
    storybookUrl: preview.hasStaticPreview ? null : resolveRelatedComponentStorybookUrl(rel),
    previewLightUrl: preview.lightUrl,
    previewDarkUrl: preview.darkUrl,
    previewAlt: preview.alt,
  };
}

export function RelComponentsBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "relComponents" }>>) {
  const related =
    block.components
      ?.map(resolveRelatedComponent)
      .filter((c): c is NonNullable<typeof c> => c != null) ?? [];
  if (!related.length) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>
        {block.title?.trim() || "Related Components"}
      </DocSectionHeading>
      <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="5">
        {related.map((c) => (
          <RelatedComponentCard key={c.slug} {...c} />
        ))}
      </Grid>
    </Box>
  );
}

export function DesignTokensBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "designTokens" }>>) {
  const groups = block.groups?.filter((g) => g?.groupTitle) ?? [];
  if (!groups.length) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>{block.title?.trim() || "Design Token"}</DocSectionHeading>
      <Flex direction="column" gap="6">
        {groups.map((group, gi) => {
          const rows = group.rows?.filter((r) => r?.name) ?? [];
          return (
            <Box key={gi}>
              <Flex align="center" gap="2" mb="3">
                <Text size="2" weight="bold">
                  {group.groupTitle}
                </Text>
                {group.helpUrl?.trim() ? (
                  <Link href={group.helpUrl} size="1" target="_blank" rel="noopener noreferrer">
                    How to use? ↗
                  </Link>
                ) : null}
              </Flex>
              {rows.length ? (
                <Table.Root variant="surface" size="2">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Token</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Default</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {rows.map((row, ri) => (
                      <Table.Row key={ri}>
                        <Table.RowHeaderCell>
                          <Code size="1" variant="ghost">
                            {row.name}
                          </Code>
                        </Table.RowHeaderCell>
                        <Table.Cell>
                          <Text size="2">{row.description ?? "—"}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant="soft" color="gray" size="1">
                            {row.valueType ?? "string"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex align="center" gap="2">
                            {row.valueType === "color" && row.swatchColor?.trim() ? (
                              <Box
                                width="14px"
                                height="14px"
                                className={portalClass.swatch}
                                style={portalSwatchBg(row.swatchColor)}
                              />
                            ) : null}
                            <Code size="1" variant="ghost">
                              {row.defaultValue?.trim() ? row.defaultValue : "—"}
                            </Code>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              ) : null}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

const CHANGELOG_KIND_LABEL: Record<string, string> = {
  patch: "Patch Changes",
  minor: "Minor Changes",
  major: "Major Changes",
};

export function ChangelogBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "changelog" }>>) {
  const entries = block.entries?.filter((e) => e?.version) ?? [];
  if (!entries.length) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>Changelog</DocSectionHeading>
      <Flex direction="column" gap="6">
        {entries.map((entry, i) => {
          const changes = entry.changes?.map((c) => c?.text).filter(Boolean) ?? [];
          return (
            <Box key={i}>
              <Heading as="h3" size="5" mb="2">
                {entry.version}
              </Heading>
              <Text size="2" weight="medium" mb="2">
                {CHANGELOG_KIND_LABEL[entry.kind ?? "patch"] ?? "Changes"}
              </Text>
              {changes.length ? (
                <Box pl="4" asChild>
                  <ul className={portalClass.changelogList}>
                    {changes.map((text, j) => (
                      <li key={j}>
                        <Text size="2">{text}</Text>
                      </li>
                    ))}
                  </ul>
                </Box>
              ) : null}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

export function AnatomyBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "anatomy" }>>) {
  const src = mediaPublicUrl(block.image);
  const parts = block.parts?.filter((p) => p?.label) ?? [];
  if (!src) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>{block.title?.trim() || "Anatomy"}</DocSectionHeading>
      <Separator size="4" mb="4" />
      <Card size="2" variant="surface">
        <Inset clip="padding-box" p="current" side="all" className="portal-anatomy-inset">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={block.title ?? "Anatomy"} className={portalClass.imgFull} />
        </Inset>
      </Card>
      {parts.length ? (
        <Flex gap="2" wrap="wrap" mt="4">
          {parts.map((part, i) => (
            <Badge key={i} variant="soft" color="blue" size="2">
              {part.label}
            </Badge>
          ))}
        </Flex>
      ) : null}
    </Box>
  );
}

export function ChecklistBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "checklist" }>>) {
  const items = block.items?.filter((i) => i?.title) ?? [];
  if (!items.length) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>
        {block.title?.trim() || "Design checklist"}
      </DocSectionHeading>
      <Separator size="4" mb="5" className={portalClass.checklistDivider} />
      <Grid columns={{ initial: "1", md: "2" }} gap="5" className={portalClass.checklist}>
        {items.map((item, i) => (
          <Flex key={i} gap="3" align="start" className={portalClass.checklistItem}>
            <ChecklistItemIcon done={item.done} />
            <Box minWidth="0">
              <Text as="div" size="2" weight="bold" highContrast>
                {item.title}
              </Text>
              {item.description ? (
                <Text as="p" size="2" color="gray" mt="1" className={portalClass.checklistDescription}>
                  {item.description}
                </Text>
              ) : null}
            </Box>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
}

export function MotionBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "motion" }>>) {
  const tokens = block.tokens?.filter((t) => t?.name && t?.value) ?? [];
  if (!tokens.length && !block.intro) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>{block.title?.trim() || "Motion"}</DocSectionHeading>
      {block.intro ? (
        <Text as="p" size="2" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
          {block.intro}
        </Text>
      ) : null}
      {tokens.length ? (
        <DataList.Root size="2">
          {tokens.map((token, i) => (
            <DataList.Item key={i} align="center">
              <DataList.Label minWidth="8rem">
                <Code size="1" variant="ghost">
                  {token.name}
                </Code>
              </DataList.Label>
              <DataList.Value>
                <Flex direction="column" gap="1">
                  {token.description ? (
                    <Text size="2" color="gray">
                      {token.description}
                    </Text>
                  ) : null}
                  <Flex align="center" gap="2" wrap="wrap">
                    <Code size="1" variant="soft">
                      {token.value}
                    </Code>
                    {token.durationMs != null ? (
                      <Badge variant="outline" color="gray" size="1">
                        {token.durationMs}ms
                      </Badge>
                    ) : null}
                  </Flex>
                </Flex>
              </DataList.Value>
            </DataList.Item>
          ))}
        </DataList.Root>
      ) : null}
    </Box>
  );
}
