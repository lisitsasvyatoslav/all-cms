import { Badge, Code, Flex } from "@radix-ui/themes";

import { getDocumentationBlockAdminLabel } from "@/collections/componentDocumentationBlocks";
import { portalClass } from "@/lib/portal/classes";

export function PortalDocumentationBlockLabel({ blockType }: { blockType: string }) {
  const adminLabel = getDocumentationBlockAdminLabel(blockType);

  return (
    <Flex align="center" gap="2" mb="3" wrap="wrap" className={portalClass.docBlockAdminLabel}>
      <Badge variant="outline" color="gray" size="1" radius="full">
        {adminLabel}
      </Badge>
      <Code size="1" variant="soft" color="gray">
        {blockType}
      </Code>
    </Flex>
  );
}
