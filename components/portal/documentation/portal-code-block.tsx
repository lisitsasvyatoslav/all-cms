import { Box, Card, Separator, Text } from "@radix-ui/themes";

import { highlightCodeLine } from "@/lib/portal/documentation/highlight-code-line";
import { portalClass } from "@/lib/portal/core/classes";

export function PortalCodeBlock({
  title,
  code,
}: {
  title?: string;
  code: string;
}) {
  const lines = code.trim().split("\n");

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
      <Box className={portalClass.codeExampleCode}>
        <div className={portalClass.codeExamplePreWrap}>
          <pre className={portalClass.codeExamplePre}>
            <code className={portalClass.codeExamplePreInner}>
              {lines.map((line, index) => (
                <span key={`${index}-${line}`} className={portalClass.codeExampleLine}>
                  <span className={portalClass.codeExampleLineNo} aria-hidden>
                    {index + 1}
                  </span>
                  <span className={portalClass.codeExampleLineContent}>
                    {highlightCodeLine(line)}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </Box>
    </Card>
  );
}
