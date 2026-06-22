import { Flex, Heading, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";
import type { BrandContentBlock } from "@/lib/portal/brand/content";

export function BrandContentBlocksBody({ blocks }: { blocks: BrandContentBlock[] }) {
  return (
    <Flex direction="column" gap="4" className={portalClass.brandContentBlocks}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "subheading":
            return (
              <Heading
                key={i}
                as="h3"
                size="4"
                weight="medium"
                className={portalClass.brandContentSubheading}
              >
                {block.text}
              </Heading>
            );
          case "paragraph":
            return (
              <Text
                key={i}
                as="p"
                size="3"
                color="gray"
                className={portalClass.textPreWrapRelaxed}
              >
                {block.text}
              </Text>
            );
          case "list":
            return (
              <ul key={i} className={portalClass.brandGuidanceList}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Text size="3" color="gray">
                      {item}
                    </Text>
                  </li>
                ))}
              </ul>
            );
          case "figure":
            return (
              <figure key={i} className={portalClass.brandContentFigure}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt} className={portalClass.brandContentFigureImg} />
              </figure>
            );
          default:
            return null;
        }
      })}
    </Flex>
  );
}
