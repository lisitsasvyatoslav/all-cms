import { Box, Card, Code, Separator, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/classes";

export function PortalCodeBlock({
  title,
  code,
}: {
  title?: string;
  code: string;
}) {
  return (
    <Card size="2" variant="surface">
      {title ? (
        <>
          <Box px="3" pt="3" pb="2">
            <Text size="1" color="gray" weight="medium">
              {title}
            </Text>
          </Box>
          <Separator size="4" />
        </>
      ) : null}
      <Box p="3">
        <Code size="2" variant="ghost" className={portalClass.textPreWrap}>
          {code.trim()}
        </Code>
      </Box>
    </Card>
  );
}
