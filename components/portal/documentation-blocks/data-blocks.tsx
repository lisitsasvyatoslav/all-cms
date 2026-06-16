import { Box, Heading } from "@radix-ui/themes";

import { PortalCollapsibleCodeBlock } from "@/components/portal/portal-collapsible-code-block";
import { PortalPropsTable } from "@/components/portal/portal-props-table";
import { PortalSourcePill } from "@/components/portal/portal-source-pill";

import { portalClass } from "@/lib/portal/classes";

import { DocSectionHeading } from "./shared";
import type { DocumentationBlock } from "./types";

type BlockProps<B extends DocumentationBlock = DocumentationBlock> = {
  block: B;
  tocId?: string;
};

export function PropsTableBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "propsTable" }>>) {
  const rows = block.rows?.filter(Boolean) ?? [];
  if (!rows.length && !block.title && !block.subtitle) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId} size="5">
        {block.title?.trim() || "API Reference"}
      </DocSectionHeading>
      {block.subtitle ? (
        <Heading as="h3" size="3" mb="4" weight="medium">
          {block.subtitle}
        </Heading>
      ) : null}
      {rows.length ? (
        <PortalPropsTable
          rows={rows.map((row) => ({
            name: row.name,
            type: row.type,
            defaultValue: row.defaultValue,
            description: row.description,
          }))}
        />
      ) : null}
    </Box>
  );
}

export function ResourceLinksBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "resourceLinks" }>>) {
  const links = block.links?.filter((l) => l?.url && l?.label) ?? [];
  if (!links.length) return null;
  return (
    <Box>
      {tocId ? (
        <Heading
          as="h2"
          size="4"
          id={tocId}
          className={`portal-sr-only ${portalClass.scrollTarget}`}
        >
          Other source links
        </Heading>
      ) : null}
      <nav className={portalClass.linkRow} aria-label="Other source links">
        {links.map((link, i) => (
          <PortalSourcePill key={i} href={link.url}>
            {link.label}
          </PortalSourcePill>
        ))}
      </nav>
    </Box>
  );
}

export function CodeExampleBlock({
  block,
}: BlockProps<Extract<DocumentationBlock, { blockType: "codeExample" }>>) {
  if (!block.code?.trim()) return null;
  return (
    <PortalCollapsibleCodeBlock
      title={block.title}
      code={block.code}
      previewStorybookUrl={block.previewStorybookUrl}
      previewHeight={block.previewHeight}
      defaultCollapsed={block.defaultCollapsed}
    />
  );
}
