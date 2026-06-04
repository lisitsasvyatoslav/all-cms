import { Box, Card, Code, Text } from "@radix-ui/themes";

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
        <Box mb="2" pb="2" style={{ borderBottom: "1px solid var(--gray-a5)" }}>
          <Text size="1" color="gray" weight="medium">
            {title}
          </Text>
        </Box>
      ) : null}
      <Code
        size="2"
        variant="ghost"
        style={{
          display: "block",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {code.trim()}
      </Code>
    </Card>
  );
}
