"use client";

import { Box, Flex, Grid, Tabs } from "@radix-ui/themes";

import { BrandColorToken } from "@/components/portal/brand/brand-color-token";
import { portalClass } from "@/lib/portal/core/classes";
import type { BrandColorData } from "@/lib/portal/brand/color-data";

type Props = {
  chartPalette: BrandColorData["chartPalette"];
};

export function BrandColorChartPalette({ chartPalette }: Props) {
  const themes = [chartPalette.light, chartPalette.dark].filter(
    (theme) => theme.colors.length > 0,
  );

  if (!themes.length) return null;

  return (
    <Tabs.Root defaultValue="light" className={portalClass.brandColorTabs}>
      <Tabs.List aria-label="Тема палитры для графиков">
        {themes.map((theme) => (
          <Tabs.Trigger key={theme.id} value={theme.id}>
            {theme.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {themes.map((theme) => (
        <Tabs.Content key={theme.id} value={theme.id}>
          <Box pt="4">
            <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="3">
              {theme.colors.map((color, index) => (
                <BrandColorToken
                  key={`${theme.id}-${color.hex}-${index}`}
                  hex={color.hex}
                  rgb={color.rgb}
                  size="sm"
                  hideName
                />
              ))}
            </Grid>
          </Box>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
