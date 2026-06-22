import {
  Box,
  Callout,
  Card,
  Code,
  Heading,
  Text,
} from "@radix-ui/themes";

import { PortalCalloutContent } from "@/components/portal/documentation/portal-callout-content";
import type { Media } from "@/payload-types";
import { portalClass } from "@/lib/portal/core/classes";
import { portalSwatchBg } from "@/lib/portal/core/css-vars";

export function mediaPublicUrl(image: number | Media): string | null {
  if (typeof image === "object" && image?.url) return image.url;
  return null;
}

export function safeJsonStringify(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? null, null, 2);
  } catch {
    return String(payload);
  }
}

export function DocSectionHeading({
  id,
  children,
  size = "4",
}: {
  id?: string;
  children: React.ReactNode;
  size?: "3" | "4" | "5";
}) {
  return (
    <Heading
      as="h2"
      size={size}
      mb="4"
      id={id}
      className={id ? portalClass.scrollTarget : undefined}
    >
      {children}
    </Heading>
  );
}

export function DocFieldCard({ children }: { children: React.ReactNode }) {
  return (
    <Card size="2" variant="surface">
      <Box p="3">{children}</Box>
    </Card>
  );
}

export function DocFieldLabel({
  children,
  weight = "medium",
}: {
  children: React.ReactNode;
  weight?: "medium" | "bold";
}) {
  return (
    <Text
      as="div"
      size="1"
      color="gray"
      weight={weight}
      mb="2"
      className={portalClass.labelUpper}
    >
      {children}
    </Text>
  );
}

export function DocColorSwatch({ hex }: { hex: string }) {
  return (
    <Box
      width="40px"
      height="40px"
      flexShrink="0"
      style={portalSwatchBg(hex)}
      className={portalClass.swatch}
      title={hex}
    />
  );
}

export function DocUnknownBlock({
  blockType,
  legacy = false,
}: {
  blockType?: string;
  legacy?: boolean;
}) {
  return (
    <Callout.Root color="amber" role="status">
      <PortalCalloutContent>
        <Text weight="bold" as="div" mb="1">
          {legacy ? "Устаревший тип блока" : "Блок не отображается на портале"}
        </Text>
        <Text size="1" as="div">
          Тип{" "}
          <Code size="1" variant="soft">
            {String(blockType)}
          </Code>{" "}
          {legacy
            ? "удалён из CMS — замените на один из 13 актуальных блоков документации."
            : "не обработан — добавьте ветку switch для этого blockType."}
        </Text>
      </PortalCalloutContent>
    </Callout.Root>
  );
}
