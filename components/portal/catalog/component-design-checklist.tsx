import { Box, Flex, Grid, Separator, Text } from "@radix-ui/themes";

import { ChecklistItemIcon } from "@/components/portal/documentation/checklist-item-icon";
import { DocSectionHeading } from "@/components/portal/documentation/blocks/shared";
import { portalClass } from "@/lib/portal/core/classes";
import type { MergedDesignChecklistItem } from "@/lib/portal/documentation/design-checklist";

type Props = {
  items: MergedDesignChecklistItem[];
  tocId?: string;
  title?: string;
};

export function ComponentDesignChecklist({
  items,
  tocId,
  title = "Design checklist",
}: Props) {
  if (!items.length) return null;

  return (
    <Box>
      <DocSectionHeading id={tocId}>{title}</DocSectionHeading>
      <Separator size="4" mb="5" className={portalClass.checklistDivider} />
      <Grid columns={{ initial: "1", md: "2" }} gap="5" className={portalClass.checklist}>
        {items.map((item) => (
          <Flex key={item.key} gap="3" align="start" className={portalClass.checklistItem}>
            <ChecklistItemIcon done={item.done} />
            <Box minWidth="0">
              <Text as="div" size="2" weight="bold" highContrast>
                {item.title}
              </Text>
              {item.description ? (
                <Text
                  as="p"
                  size="2"
                  color="gray"
                  mt="1"
                  className={portalClass.checklistDescription}
                >
                  {item.description}
                </Text>
              ) : null}
              {item.note ? (
                <Text as="p" size="1" color="gray" mt="1" style={{ fontStyle: "italic" }}>
                  {item.note}
                </Text>
              ) : null}
            </Box>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
}
