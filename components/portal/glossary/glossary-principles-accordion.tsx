"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, Heading, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  heading: string;
  principles: string[];
  footer?: string | null;
};

export function GlossaryPrinciplesAccordion({ heading, principles, footer }: Props) {
  if (!principles.length && !footer) return null;

  return (
    <Accordion.Root
      type="single"
      collapsible
      className={portalClass.glossaryAccordion}
    >
      <Accordion.Item value="principles" className={portalClass.glossaryAccordionItem}>
        <Accordion.Header className={portalClass.glossaryAccordionHeader}>
          <Accordion.Trigger className={portalClass.glossaryAccordionTrigger}>
            <Heading as="h2" size="6" weight="medium" id="glossary-principles-heading">
              {heading}
            </Heading>
            <ChevronDownIcon className={portalClass.glossaryAccordionChevron} aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={portalClass.glossaryAccordionContent}>
          <div className={portalClass.glossaryAccordionContentInner}>
            {principles.length ? (
              <ol className={portalClass.glossaryPrinciples}>
                {principles.map((item, index) => (
                  <li key={index}>
                    <Text as="p" size="3" className={portalClass.textPreWrapRelaxed}>
                      {item}
                    </Text>
                  </li>
                ))}
              </ol>
            ) : null}
            {footer ? (
              <Text
                as="p"
                size="3"
                color="gray"
                mt={principles.length ? "4" : "0"}
                className={portalClass.textPreWrapRelaxed}
              >
                {footer}
              </Text>
            ) : null}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
