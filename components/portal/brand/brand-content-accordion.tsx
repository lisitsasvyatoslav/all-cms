"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, Heading } from "@radix-ui/themes";

import { BrandContentBlocksBody } from "@/components/portal/brand/brand-content-blocks-body";
import { portalClass } from "@/lib/portal/core/classes";
import type { BrandContentBlock } from "@/lib/portal/brand/content";

export type BrandContentAccordionItem = {
  id: string;
  heading: string;
  blocks: BrandContentBlock[];
};

type Props = {
  items: BrandContentAccordionItem[];
};

export function BrandContentAccordion({ items }: Props) {
  if (!items.length) return null;

  return (
    <Accordion.Root
      type="multiple"
      className={`${portalClass.glossaryAccordion} ${portalClass.brandContentAccordion}`}
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          id={item.id}
          className={portalClass.glossaryAccordionItem}
        >
          <Accordion.Header className={portalClass.glossaryAccordionHeader}>
            <Accordion.Trigger className={portalClass.glossaryAccordionTrigger}>
              <Heading as="h2" size="6" weight="medium">
                {item.heading}
              </Heading>
              <ChevronDownIcon className={portalClass.glossaryAccordionChevron} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={portalClass.glossaryAccordionContent}>
            <div className={portalClass.glossaryAccordionContentInner}>
              <BrandContentBlocksBody blocks={item.blocks} />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
