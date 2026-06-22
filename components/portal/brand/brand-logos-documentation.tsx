"use client";

import { Box, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

type BackgroundRule = {
  label: string;
  surface: "light" | "dark";
  logoSrc: string;
};

type MisuseItem = {
  imageSrc: string;
  text: string;
};

type BrandLogoBackgroundGridProps = {
  rules: BackgroundRule[];
};

export function BrandLogoBackgroundGrid({ rules }: BrandLogoBackgroundGridProps) {
  if (!rules.length) return null;

  return (
    <div className={portalClass.brandLogoBackgroundGrid}>
      {rules.map((rule) => (
        <article key={rule.label} className={portalClass.brandLogoBackgroundCard}>
          <Box
            className={`${portalClass.brandLogoBackgroundPreview} portal-brand-logo-preview--${rule.surface}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rule.logoSrc} alt="" className={portalClass.brandLogoImg} />
          </Box>
          <Text size="2" as="p" color="gray" className={portalClass.brandLogoBackgroundCaption}>
            {rule.label}
          </Text>
        </article>
      ))}
    </div>
  );
}

type BrandLogoClearspaceSectionProps = {
  items: string[];
};

export function BrandLogoClearspaceSection({ items }: BrandLogoClearspaceSectionProps) {
  if (!items.length) return null;

  return (
    <ul className={portalClass.brandGuidanceList}>
      {items.map((item) => (
        <li key={item}>
          <Text size="2">{item}</Text>
        </li>
      ))}
    </ul>
  );
}

type BrandLogoMisuseGridProps = {
  intro?: string;
  items: MisuseItem[];
};

export function BrandLogoMisuseGrid({ intro, items }: BrandLogoMisuseGridProps) {
  if (!items.length) return null;

  return (
    <>
      {intro ? (
        <Text as="p" size="3" color="gray" mb="4" className={portalClass.textPreWrapRelaxed}>
          {intro}
        </Text>
      ) : null}
      <div className={portalClass.brandLogoMisuseGrid}>
        {items.map((item) => (
          <article key={item.imageSrc} className={portalClass.brandLogoMisuseCard}>
            <Box className={portalClass.brandLogoMisuseVisual}>
              <span className={portalClass.brandLogoMisuseBadge} aria-hidden>
                ×
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageSrc} alt="" className={portalClass.brandLogoMisuseImg} />
            </Box>
            <Text size="2" as="p" className={portalClass.brandLogoMisuseCaption}>
              <Text as="span" color="red" weight="medium">
                Не{" "}
              </Text>
              {item.text}
            </Text>
          </article>
        ))}
      </div>
    </>
  );
}
