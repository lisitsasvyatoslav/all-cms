import { PortalCollapsibleCodeBlock } from "@/components/portal/portal-collapsible-code-block";

import { DoDontBlock, SectionBlock } from "./content-blocks";
import { CodeExampleBlock, PropsTableBlock, ResourceLinksBlock } from "./data-blocks";
import {
  AccessibilityBlock,
  AnatomyBlock,
  ChangelogBlock,
  ChecklistBlock,
  DesignTokensBlock,
  MotionBlock,
  RelComponentsBlock,
} from "./specialized-blocks";
import { DocUnknownBlock } from "./shared";
import type { DocumentationBlock } from "./types";

/** Устаревшие blockType из БД — показываем предупреждение. */
const LEGACY_BLOCK_TYPES = new Set([
  "callout",
  "codeMonaco",
  "richTextSection",
  "mediaFigure",
  "relColor",
  "relIcon",
  "geoPoint",
  "calendarDate",
  "emailLine",
  "numberStat",
  "radioPick",
  "multiSelect",
  "flagBox",
  "jsonBlock",
  "groupStrip",
  "nestedStack",
  "namedTabsStrip",
  "divider",
  "quote",
]);

export function DocumentationBlockRenderer({
  block,
  tocId,
}: {
  block: DocumentationBlock;
  tocId?: string;
}) {
  switch (block.blockType) {
    case "section":
      return <SectionBlock block={block} tocId={tocId} />;
    case "propsTable":
      return <PropsTableBlock block={block} tocId={tocId} />;
    case "storybookEmbed":
      if (!block.storybookUrl?.trim()) return null;
      return (
        <PortalCollapsibleCodeBlock
          title={block.title ?? "Превью"}
          previewStorybookUrl={block.storybookUrl}
          previewHeight={block.frameHeight}
          defaultCollapsed
          code={`// Добавьте парный блок codeExample с previewStorybookUrl для «${block.title ?? "Превью"}»`}
        />
      );
    case "codeExample":
      return <CodeExampleBlock block={block} />;
    case "doDont":
      return <DoDontBlock block={block} tocId={tocId} />;
    case "accessibility":
      return <AccessibilityBlock block={block} tocId={tocId} />;
    case "relComponents":
      return <RelComponentsBlock block={block} />;
    case "designTokens":
      return <DesignTokensBlock block={block} tocId={tocId} />;
    case "changelog":
      return <ChangelogBlock block={block} tocId={tocId} />;
    case "anatomy":
      return <AnatomyBlock block={block} tocId={tocId} />;
    case "checklist":
      return <ChecklistBlock block={block} tocId={tocId} />;
    case "resourceLinks":
      return <ResourceLinksBlock block={block} />;
    case "motion":
      return <MotionBlock block={block} tocId={tocId} />;
    default:
      if (LEGACY_BLOCK_TYPES.has(String((block as { blockType?: string }).blockType))) {
        return (
          <DocUnknownBlock
            blockType={(block as { blockType?: string }).blockType}
            legacy
          />
        );
      }
      return (
        <DocUnknownBlock blockType={(block as { blockType?: string }).blockType} />
      );
  }
}
