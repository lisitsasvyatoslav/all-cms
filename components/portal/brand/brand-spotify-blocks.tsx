import { Box, Button, Flex, Grid, Heading, Link, Text } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

export function BrandWhenApplies({ children }: { children: React.ReactNode }) {
  return (
    <Box className={portalClass.brandWhenApplies} mb="4">
      <Text size="2" weight="bold" as="p" mb="2">
        Когда это актуально?
      </Text>
      <Text size="2" color="gray" as="p">
        {children}
      </Text>
    </Box>
  );
}

export function BrandSubheading({
  children,
  as = "h3",
}: {
  children: React.ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <Heading as={as} size={as === "h2" ? "6" : "4"} weight="medium" mb="3" mt="6">
      {children}
    </Heading>
  );
}

type DownloadItem = { label: string; href: string };

export function BrandLogoLockup({
  intro,
  fullLogoSrc,
  iconSrc,
  downloads,
}: {
  intro: string;
  fullLogoSrc: string;
  iconSrc: string;
  downloads: DownloadItem[];
}) {
  return (
    <>
      <Text as="p" size="3" color="gray" mb="5" className={portalClass.textPreWrapRelaxed}>
        {intro}
      </Text>
      <Grid columns={{ initial: "1", sm: "2" }} gap="4" mb="4">
        <Box className={portalClass.brandLockupCard}>
          <Text size="2" weight="medium" mb="3" as="p">
            Полный логотип
          </Text>
          <Box className={portalClass.brandLockupPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fullLogoSrc} alt="Design System — полный логотип" className={portalClass.brandLogoImg} />
          </Box>
        </Box>
        <Box className={portalClass.brandLockupCard}>
          <Text size="2" weight="medium" mb="3" as="p">
            Иконка
          </Text>
          <Box className={portalClass.brandLockupPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconSrc} alt="Design System — иконка" width={48} height={48} />
          </Box>
        </Box>
      </Grid>
      <Flex gap="3" wrap="wrap">
        {downloads.map((item) => (
          <Button key={item.label} asChild variant="soft" size="2">
            <a href={item.href} download>
              {item.label}
            </a>
          </Button>
        ))}
      </Flex>
    </>
  );
}

export type BrandYesNoDemoKey =
  | "icon-original"
  | "icon-crop"
  | "icon-overlay"
  | "icon-brand-overlay"
  | "logo-rotate"
  | "logo-fill"
  | "logo-stretch"
  | "logo-sentence"
  | "logo-shapes"
  | "logo-busy"
  | "color-creative"
  | "color-contrast"
  | "color-outside"
  | "color-oversaturated";

export function BrandYesNoCard({
  variant,
  text,
  demo,
}: {
  variant: "yes" | "no";
  text: string;
  demo?: BrandYesNoDemoKey;
}) {
  const isYes = variant === "yes";

  return (
    <Box className={portalClass.brandYesNoCard}>
      <Box
        className={`${portalClass.brandYesNoVisual} ${
          isYes ? portalClass.brandYesNoVisualYes : portalClass.brandYesNoVisualNo
        }`}
      >
        {demo ? <BrandYesNoDemo demo={demo} /> : null}
      </Box>
      <Box className={portalClass.brandYesNoLabel} data-variant={variant}>
        <Text size="1" weight="bold" as="span">
          {isYes ? "YES" : "NO"}
        </Text>
      </Box>
      <Box p="3">
        <Text size="2">{text}</Text>
      </Box>
    </Box>
  );
}

function BrandYesNoDemo({ demo }: { demo: BrandYesNoDemoKey }) {
  switch (demo) {
    case "icon-original":
      return (
        <Flex align="center" gap="3" className="portal-brand-demo-icon-row">
          <Box className="portal-brand-demo-icon portal-brand-demo-icon--good">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/ui/search.svg" alt="" width={20} height={20} />
          </Box>
          <Text size="2">Поиск</Text>
        </Flex>
      );
    case "icon-crop":
      return (
        <Box className="portal-brand-demo-icon-crop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/ui/search.svg" alt="" width={28} height={28} />
        </Box>
      );
    case "icon-overlay":
      return (
        <Box className="portal-brand-demo-artwork">
          <Box className="portal-brand-demo-artwork__bg" />
          <Text size="1" className="portal-brand-demo-artwork__overlay">
            Текст поверх
          </Text>
        </Box>
      );
    case "icon-brand-overlay":
      return (
        <Box className="portal-brand-demo-artwork">
          <Box className="portal-brand-demo-artwork__bg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-icon.svg"
            alt=""
            width={24}
            height={24}
            className="portal-brand-demo-artwork__logo"
          />
        </Box>
      );
    case "logo-rotate":
      return <BrandDemoLogo className="portal-brand-demo-logo--rotate" />;
    case "logo-fill":
      return <BrandDemoLogo className="portal-brand-demo-logo--fill" />;
    case "logo-stretch":
      return <BrandDemoLogo className="portal-brand-demo-logo--stretch" />;
    case "logo-sentence":
      return (
        <Text size="3" className="portal-brand-demo-sentence">
          Мы любим{" "}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-icon.svg" alt="" width={18} height={18} className="portal-brand-demo-sentence__logo" />{" "}
          Design System
        </Text>
      );
    case "logo-shapes":
      return (
        <Flex gap="2" align="center" justify="center">
          <BrandDemoLogo scale={0.7} />
          <Box className="portal-brand-demo-shape" />
          <BrandDemoLogo scale={0.5} />
        </Flex>
      );
    case "logo-busy":
      return (
        <Box className="portal-brand-demo-busy">
          <BrandDemoLogo scale={0.6} />
        </Box>
      );
    case "color-creative":
      return (
        <Flex gap="2" justify="center" wrap="wrap">
          <Box className="portal-brand-demo-swatch" style={{ background: "#0090ff" }} />
          <Box className="portal-brand-demo-swatch" style={{ background: "#30a46c" }} />
          <Box className="portal-brand-demo-swatch" style={{ background: "#e5484d" }} />
          <Box className="portal-brand-demo-swatch" style={{ background: "#ffc53d" }} />
        </Flex>
      );
    case "color-contrast":
      return (
        <Box className="portal-brand-demo-contrast">
          <Text size="3" weight="bold">
            Заголовок
          </Text>
          <Text size="2">Body-текст с достаточным контрастом</Text>
        </Box>
      );
    case "color-outside":
      return (
        <Flex gap="2" justify="center">
          <Box className="portal-brand-demo-swatch" style={{ background: "#ff00ff" }} />
          <Box className="portal-brand-demo-swatch" style={{ background: "#00ffff" }} />
          <Box className="portal-brand-demo-swatch" style={{ background: "#9932cc" }} />
        </Flex>
      );
    case "color-oversaturated":
      return (
        <Box className="portal-brand-demo-saturated">
          <Text size="2" weight="bold">
            CMYK print
          </Text>
        </Box>
      );
    default:
      return null;
  }
}

function BrandDemoLogo({
  className,
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-primary.svg"
      alt=""
      className={`portal-brand-demo-logo ${className ?? ""}`}
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
    />
  );
}

export function BrandLogoColorRow({
  rules,
}: {
  rules: { backgroundLabel: string; surface: "light" | "dark" | "color"; logoSrc: string; logoLabel: string }[];
}) {
  return (
    <Grid columns={{ initial: "1", md: "3" }} gap="4">
      {rules.map((rule) => (
        <Box key={rule.backgroundLabel} className={portalClass.brandLogoVariant}>
          <Box className={`${portalClass.brandLogoPreview} portal-brand-logo-preview--${rule.surface}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rule.logoSrc} alt={rule.logoLabel} className={portalClass.brandLogoImg} />
          </Box>
          <Box p="3">
            <Text size="2" weight="medium" as="div" mb="1">
              {rule.backgroundLabel}
            </Text>
            <Text size="2" color="gray">
              {rule.logoLabel}
            </Text>
          </Box>
        </Box>
      ))}
    </Grid>
  );
}

export function BrandMinimumSizeTable({
  items,
}: {
  items: { label: string; digital: string; print?: string }[];
}) {
  return (
    <Box className={portalClass.brandMinSizeTable}>
      {items.map((item) => (
        <Flex
          key={item.label}
          direction={{ initial: "column", sm: "row" }}
          gap="2"
          justify="between"
          py="3"
          className={portalClass.brandMinSizeRow}
        >
          <Text size="2" weight="medium">
            {item.label}
          </Text>
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">
              Digital: {item.digital}
            </Text>
            {item.print ? (
              <Text size="2" color="gray">
                Print: {item.print}
              </Text>
            ) : null}
          </Flex>
        </Flex>
      ))}
    </Box>
  );
}

export function BrandFontStack({ fonts }: { fonts: string[] }) {
  return (
    <ol className={portalClass.brandFontStack}>
      {fonts.map((font, i) => (
        <li key={font}>
          <Text
            size="4"
            style={{
              fontFamily:
                i === 0
                  ? "var(--default-font-family)"
                  : font.includes("Helvetica")
                    ? "Helvetica Neue, Helvetica, Arial, sans-serif"
                    : font,
            }}
          >
            {font}
          </Text>
        </li>
      ))}
    </ol>
  );
}

export function BrandGuidanceGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Box mb="4">
      <Text size="2" weight="bold" as="p" mb="2">
        {title}
      </Text>
      <ul className={portalClass.brandGuidanceList}>
        {items.map((item, i) => (
          <li key={i}>
            <Text size="2">{item}</Text>
          </li>
        ))}
      </ul>
    </Box>
  );
}

export function BrandConsiderationsTable({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <Box className={portalClass.brandConsiderationsTable}>
      {rows.map((row) => (
        <Flex key={row.label} justify="between" gap="4" py="2" className={portalClass.brandConsiderationsRow}>
          <Text size="2" weight="medium">
            {row.label}
          </Text>
          <Text size="2" color="gray">
            {row.value}
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export function BrandExclusionZone() {
  return (
    <Box className={portalClass.brandExclusionZone} aria-hidden="true">
      <Box className={portalClass.brandExclusionInner}>
        <Box className={portalClass.brandExclusionMark} data-pos="top" />
        <Box className={portalClass.brandExclusionMark} data-pos="right" />
        <Box className={portalClass.brandExclusionMark} data-pos="bottom" />
        <Box className={portalClass.brandExclusionMark} data-pos="left" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-primary.svg" alt="" className={portalClass.brandLogoImg} />
      </Box>
      <Text size="1" color="gray" mt="2" as="p">
        Зона исключения = половина высоты иконки (×)
      </Text>
    </Box>
  );
}

export function BrandAccentSwatch({ hex, name }: { hex: string; name: string }) {
  return (
    <Flex align="center" gap="3" mb="4">
      <Box className={portalClass.brandAccentSwatch} style={{ background: hex }} />
      <Box>
        <Text size="2" weight="medium" as="div">
          {name}
        </Text>
        <Text size="1" color="gray">
          {hex} · resting color бренда
        </Text>
      </Box>
    </Flex>
  );
}

export function BrandInlineDownloads({ items }: { items: DownloadItem[] }) {
  return (
    <Flex gap="3" wrap="wrap" mt="3">
      {items.map((item) => (
        <Link key={item.label} href={item.href} download size="2" weight="medium">
          {item.label}
        </Link>
      ))}
    </Flex>
  );
}
