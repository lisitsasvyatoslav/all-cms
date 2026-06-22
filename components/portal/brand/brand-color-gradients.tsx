import { Box, Text } from "@radix-ui/themes";

import { BrandColorToken } from "@/components/portal/brand/brand-color-token";
import { portalClass } from "@/lib/portal/core/classes";
import type { BrandGradient } from "@/lib/portal/brand/color-data";

function gradientCss(stops: BrandGradient["stops"], angle = 135): string {
  const points = stops.map((stop) => stop.hex).join(", ");
  return `linear-gradient(${angle}deg, ${points})`;
}

type Props = {
  gradients: BrandGradient[];
};

export function BrandColorGradients({ gradients }: Props) {
  if (!gradients.length) return null;

  const maxStops = Math.max(...gradients.map((gradient) => gradient.stops.length));

  return (
    <Box className={portalClass.brandGradientGrid}>
      {gradients.map((gradient) => (
        <Box key={gradient.id} className={portalClass.brandGradientCard}>
          <Text size="2" weight="medium" as="p" className={portalClass.brandGradientTitle}>
            {gradient.title}
          </Text>
          <Box className={portalClass.brandGradientCardBody}>
            <Box
              className={portalClass.brandGradientPreview}
              style={{ background: gradientCss(gradient.stops, gradient.angle) }}
              aria-hidden
            />
            <Box className={portalClass.brandGradientStops}>
              {Array.from({ length: maxStops }, (_, index) => {
                const stop = gradient.stops[index];
                if (!stop) {
                  return (
                    <Box
                      key={`${gradient.id}-placeholder-${index}`}
                      className={`${portalClass.brandGradientStop} ${portalClass.brandGradientStopPlaceholder}`}
                      aria-hidden
                    />
                  );
                }

                return (
                  <BrandColorToken
                    key={`${gradient.id}-${stop.hex}`}
                    hex={stop.hex}
                    rgb={stop.rgb}
                    compact
                    stackedMeta
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
