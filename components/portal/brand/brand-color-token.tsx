import { Box, Flex, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  name?: string;
  hex: string;
  rgb?: string;
  size?: "sm" | "md";
  hideName?: boolean;
  /** Одна строка: HEX · RGB без дублирования */
  compact?: boolean;
  /** Две строки HEX / RGB — для карточек градиентов */
  stackedMeta?: boolean;
};

export function BrandColorToken({
  name,
  hex,
  rgb,
  size = "md",
  hideName = false,
  compact = false,
  stackedMeta = false,
}: Props) {
  const displayName = name ?? hex.toUpperCase();
  const hexValue = hex.replace("#", "").toUpperCase();

  if (compact && stackedMeta) {
    return (
      <Flex align="center" gap="3" className={portalClass.brandGradientStop}>
        <Box
          className={portalClass.brandGradientStopSwatch}
          style={{ backgroundColor: hex }}
          aria-hidden
        />
        <Box minWidth="0" className={portalClass.brandGradientStopMeta}>
          <Text size="1" color="gray" as="div">
            HEX {hexValue}
          </Text>
          {rgb ? (
            <Text size="1" color="gray" as="div">
              RGB {rgb}
            </Text>
          ) : null}
        </Box>
      </Flex>
    );
  }

  if (compact) {
    return (
      <Flex align="center" gap="2" className={portalClass.brandColorTokenCompact}>
        <Box
          className={portalClass.brandColorTokenSwatchXs}
          style={{ backgroundColor: hex }}
          aria-hidden
        />
        <Text size="1" color="gray" className={portalClass.brandColorTokenMeta} as="div">
          {rgb ? (
            <>
              HEX {hexValue} · RGB {rgb}
            </>
          ) : (
            <>HEX {hexValue}</>
          )}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex align="center" gap="3" className={portalClass.brandColorToken}>
      <Box
        className={
          size === "sm" ? portalClass.brandColorTokenSwatchSm : portalClass.brandColorTokenSwatch
        }
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <Box minWidth="0">
        {hideName ? null : (
          <Text size="2" className={portalClass.brandColorTokenName} as="div">
            {displayName}
          </Text>
        )}
        {rgb ? (
          <Text size="1" color="gray" as="div">
            HEX {hexValue} · RGB {rgb}
          </Text>
        ) : null}
      </Box>
    </Flex>
  );
}
