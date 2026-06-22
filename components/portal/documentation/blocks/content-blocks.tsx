import {
  Badge,
  Box,
  Callout,
  Flex,
  Grid,
  Inset,
  Separator,
  Text,
} from "@radix-ui/themes";

import { DoDontHeaderIcon } from "@/components/portal/documentation/do-dont-header-icon";
import { PortalCalloutContent } from "@/components/portal/documentation/portal-callout-content";
import { portalClass } from "@/lib/portal/core/classes";
import type { Media } from "@/payload-types";
import { portalSwatchBg } from "@/lib/portal/core/css-vars";

import { DocSectionHeading, mediaPublicUrl } from "./shared";
import type { DocumentationBlock } from "./types";

type BlockProps<B extends DocumentationBlock = DocumentationBlock> = {
  block: B;
  tocId?: string;
};

export function SectionBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "section" }>>) {
  const items = block.items?.filter((i) => i?.label) ?? [];

  return (
    <Box>
      <DocSectionHeading id={tocId}>{block.heading}</DocSectionHeading>
      {block.body ? (
        <Text as="p" size="2" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
          {block.body}
        </Text>
      ) : null}
      {items.length ? (
        <Flex direction="column" gap="4">
          {items.map((item, i) => (
            <Flex key={i} gap="3" align="start">
              <Box
                width="20px"
                height="20px"
                mt="1"
                flexShrink="0"
                className={portalClass.swatch}
                style={portalSwatchBg(item.accentColor?.trim() || "#1677ff")}
              />
              <Box>
                {item.labelAsBadge ? (
                  <Badge variant="soft" color="gray" size="1" mb="1">
                    {item.label}
                  </Badge>
                ) : (
                  <Text size="2" weight="medium" as="div" mb="1">
                    {item.label}
                  </Text>
                )}
                {item.description ? (
                  <Text size="2" color="gray">
                    {item.description}
                  </Text>
                ) : null}
              </Box>
            </Flex>
          ))}
        </Flex>
      ) : null}
    </Box>
  );
}

function DoDontImageSection({
  image,
  separatorClassName,
}: {
  image?: number | Media | null;
  separatorClassName: string;
}) {
  const src = image ? mediaPublicUrl(image) : null;
  if (!src) return null;

  return (
    <>
      <Inset clip="padding-box" side="all">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className={portalClass.imgFull} />
      </Inset>
      <Separator size="4" className={separatorClassName} />
    </>
  );
}

export function DoDontBlock({
  block,
  tocId,
}: BlockProps<Extract<DocumentationBlock, { blockType: "doDont" }>>) {
  const dos = block.dos?.filter((d) => d?.text) ?? [];
  const donts = block.donts?.filter((d) => d?.text) ?? [];
  if (!dos.length && !donts.length && !block.heading && !block.intro) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>
        {block.heading?.trim() || "Do / Don't"}
      </DocSectionHeading>
      {block.intro ? (
        <Text as="p" size="2" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
          {block.intro}
        </Text>
      ) : null}
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        {dos.length ? (
          <CardColumn>
            <DoDontImageSection
              image={dos[0]?.image}
              separatorClassName="portal-do-dont-separator-green"
            />
            <Box p="3" className="portal-do-dont-panel-green">
              <Flex gap="2" align="center" mb="2">
                <DoDontHeaderIcon variant="do" />
                <Text size="2" weight="bold" as="div">
                  Do
                </Text>
              </Flex>
              <Flex direction="column" gap="2">
                {dos.map((row, i) => (
                  <Text key={i} size="2">
                    {row.text}
                  </Text>
                ))}
              </Flex>
            </Box>
          </CardColumn>
        ) : null}
        {donts.length ? (
          <CardColumn>
            <DoDontImageSection
              image={donts[0]?.image}
              separatorClassName="portal-do-dont-separator-red"
            />
            <Box p="3" className="portal-do-dont-panel-red">
              <Flex gap="2" align="center" mb="2">
                <DoDontHeaderIcon variant="dont" />
                <Text size="2" weight="bold" as="div">
                  Don&apos;t
                </Text>
              </Flex>
              <Flex direction="column" gap="2">
                {donts.map((row, i) => (
                  <Text key={i} size="2">
                    {row.text}
                  </Text>
                ))}
              </Flex>
            </Box>
          </CardColumn>
        ) : null}
      </Grid>
    </Box>
  );
}

function CardColumn({ children }: { children: React.ReactNode }) {
  return (
    <Box className={portalClass.doDontCard} overflow="hidden" height="100%">
      {children}
    </Box>
  );
}
