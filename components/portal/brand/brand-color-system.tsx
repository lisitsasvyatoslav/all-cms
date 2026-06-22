"use client";

import { Box, Flex, Grid, Tabs, Text } from "@radix-ui/themes";

import { BrandColorToken } from "@/components/portal/brand/brand-color-token";
import { portalClass } from "@/lib/portal/core/classes";
import type { BrandColorData } from "@/lib/portal/brand/color-data";

function HierarchyTab({ hierarchy }: { hierarchy: BrandColorData["hierarchy"] }) {
  const columns = [hierarchy.base, hierarchy.semantic, hierarchy.component];

  return (
    <Flex direction="column" gap="5">
      <Grid columns={{ initial: "1", md: "3" }} gap="4">
        {columns.map((column) => (
          <Box key={column.title} className={portalClass.brandColorDocCard}>
            <Text size="3" weight="medium" as="p" mb="1">
              {column.title}
            </Text>
            <Text size="2" color="gray" as="p" mb="3" className={portalClass.textPreWrapRelaxed}>
              {column.description}
            </Text>
            <Flex direction="column" gap="2">
              {column.tokens.map((token) => (
                <BrandColorToken key={token.name} name={token.name} hex={token.hex} />
              ))}
            </Flex>
          </Box>
        ))}
      </Grid>

      <Box>
        <Text size="3" weight="medium" as="p" mb="3">
          Связи между уровнями
        </Text>
        <ul className={portalClass.brandColorMappingList}>
          {hierarchy.mappings.map((mapping) => (
            <li key={`${mapping.from}-${mapping.to}`}>
              <Text size="2" color="gray">
                <Text as="span" className={portalClass.brandColorTokenName}>
                  {mapping.from}
                </Text>
                {" → "}
                <Text as="span" className={portalClass.brandColorTokenName}>
                  {mapping.to}
                </Text>
              </Text>
            </li>
          ))}
        </ul>
      </Box>
    </Flex>
  );
}

function SemanticsTab({ semantics }: { semantics: BrandColorData["semantics"] }) {
  return (
    <Flex direction="column" gap="5">
      <Grid columns={{ initial: "1", lg: "minmax(0, 1fr) minmax(0, 1fr)" }} gap="6">
        <Flex direction="column" gap="4">
          {semantics.sections.map((section) => (
            <Box key={section.title}>
              <Text size="3" weight="medium" as="p" mb="2">
                {section.title}
              </Text>
              <Text size="2" color="gray" as="p" mb="2" className={portalClass.textPreWrapRelaxed}>
                {section.body}
              </Text>
              <ul className={portalClass.brandGuidanceList}>
                {section.items.map((item) => (
                  <li key={item}>
                    <Text size="2" color="gray">
                      {item}
                    </Text>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Flex>

        <Box className={portalClass.brandColorDocCard}>
          <Text size="3" weight="medium" as="p" mb="3">
            Структура имени
          </Text>
          <Box className={portalClass.brandColorNamingTable}>
            {semantics.namingParts.map((row) => (
              <Flex key={row.part} gap="3" py="2" className={portalClass.brandColorNamingRow}>
                <Text size="2" weight="medium" className={portalClass.brandColorNamingPart}>
                  {row.part}
                  {row.required ? " *" : ""}
                </Text>
                <Text size="2" color="gray">
                  {row.examples.join(", ")}
                </Text>
              </Flex>
            ))}
          </Box>
          <Text size="1" color="gray" mt="2" as="p">
            * — обязательный сегмент
          </Text>
        </Box>
      </Grid>

      <Box>
        <Text size="3" weight="medium" as="p" mb="3">
          Примеры
        </Text>
        <Flex direction="column" gap="2">
          {semantics.examples.map((example) => (
            <Flex key={example.token} gap="3" align="baseline" wrap="wrap">
              <Text size="2" className={portalClass.brandColorTokenName}>
                {example.token}
              </Text>
              <Text size="2" color="gray">
                — {example.description}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

function TokensTab({ componentTokens }: { componentTokens: BrandColorData["componentTokens"] }) {
  return (
    <Flex direction="column" gap="5">
      <Flex direction="column" gap="3">
        {componentTokens.intro.map((paragraph) => (
          <Text key={paragraph} as="p" size="3" color="gray" className={portalClass.textPreWrapRelaxed}>
            {paragraph}
          </Text>
        ))}
      </Flex>

      <Box className={portalClass.brandColorDocCard}>
        <Text size="3" weight="medium" as="p" mb="3">
          Структура имени
        </Text>
        <Text size="2" color="gray" mb="3" as="p">
          ui element + type + prominence + color role + interaction
        </Text>
        <Box className={portalClass.brandColorNamingTable}>
          {componentTokens.namingParts.map((row) => (
            <Flex key={row.part} gap="3" py="2" className={portalClass.brandColorNamingRow}>
              <Text size="2" weight="medium" className={portalClass.brandColorNamingPart}>
                {row.part}
              </Text>
              <Text size="2" color="gray">
                {row.examples.join(", ")}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>

      <Box>
        <Text size="3" weight="medium" as="p" mb="3">
          Примеры токенов
        </Text>
        <Flex direction="column" gap="2">
          {componentTokens.examples.map((example) => (
            <Flex key={example.token} gap="3" align="baseline" wrap="wrap">
              <Text size="2" className={portalClass.brandColorTokenName}>
                {example.token}
              </Text>
              <Text size="2" color="gray">
                — {example.description}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

type Props = {
  colorData: BrandColorData;
};

export function BrandColorSystem({ colorData }: Props) {
  return (
    <Tabs.Root defaultValue="names" className={portalClass.brandColorTabs}>
      <Tabs.List aria-label="Разделы системы цвета">
        <Tabs.Trigger value="names">Назначения</Tabs.Trigger>
        <Tabs.Trigger value="semantics">Семантика цвета</Tabs.Trigger>
        <Tabs.Trigger value="tokens">Токены</Tabs.Trigger>
      </Tabs.List>

      <Box pt="4">
        <Tabs.Content value="names">
          <HierarchyTab hierarchy={colorData.hierarchy} />
        </Tabs.Content>
        <Tabs.Content value="semantics">
          <SemanticsTab semantics={colorData.semantics} />
        </Tabs.Content>
        <Tabs.Content value="tokens">
          <TokensTab componentTokens={colorData.componentTokens} />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
