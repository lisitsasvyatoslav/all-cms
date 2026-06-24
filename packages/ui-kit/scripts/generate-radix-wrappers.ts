/**
 * Генерирует тонкие обёртки Radix Themes для ui-kit.
 * Запуск: npx tsx packages/ui-kit/scripts/generate-radix-wrappers.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RADIX_THEMES_CATALOG,
  type RadixThemesCatalogEntry,
} from "../../../lib/portal/bootstrap/radix-themes-catalog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "src");

/** slug → { radixImport, propsExport, demo? } */
const WRAPPER_SPEC: Record<
  string,
  {
    radixName: string;
    propsName: string;
    compound?: boolean;
    demoBody?: string;
  }
> = {
  "aspect-ratio": { radixName: "AspectRatio", propsName: "AspectRatioProps" },
  box: { radixName: "Box", propsName: "BoxProps" },
  container: { radixName: "Container", propsName: "ContainerProps" },
  flex: { radixName: "Flex", propsName: "FlexProps" },
  grid: { radixName: "Grid", propsName: "GridProps" },
  inset: { radixName: "Inset", propsName: "InsetProps" },
  section: { radixName: "Section", propsName: "SectionProps" },
  "scroll-area": { radixName: "ScrollArea", propsName: "ScrollAreaProps" },
  blockquote: { radixName: "Blockquote", propsName: "BlockquoteProps" },
  code: { radixName: "Code", propsName: "CodeProps" },
  em: { radixName: "Em", propsName: "EmProps" },
  heading: { radixName: "Heading", propsName: "HeadingProps" },
  kbd: { radixName: "Kbd", propsName: "KbdProps" },
  quote: { radixName: "Quote", propsName: "QuoteProps" },
  strong: { radixName: "Strong", propsName: "StrongProps" },
  text: { radixName: "Text", propsName: "TextProps" },
  avatar: { radixName: "Avatar", propsName: "AvatarProps" },
  progress: { radixName: "Progress", propsName: "ProgressProps" },
  radio: { radixName: "Radio", propsName: "RadioProps" },
  separator: { radixName: "Separator", propsName: "SeparatorProps" },
  skeleton: { radixName: "Skeleton", propsName: "SkeletonProps" },
  slider: { radixName: "Slider", propsName: "SliderProps" },
  spinner: { radixName: "Spinner", propsName: "SpinnerProps" },
  switch: { radixName: "Switch", propsName: "SwitchProps" },
  "text-area": { radixName: "TextArea", propsName: "TextAreaProps" },
  tooltip: { radixName: "Tooltip", propsName: "TooltipProps" },
  portal: { radixName: "Portal", propsName: "PortalProps" },
  reset: { radixName: "Reset", propsName: "ResetProps" },
  "accessible-icon": { radixName: "AccessibleIcon", propsName: "AccessibleIconProps" },
  "visually-hidden": { radixName: "VisuallyHidden", propsName: "VisuallyHiddenProps" },
  "checkbox-cards": {
    radixName: "CheckboxCards",
    propsName: "CheckboxCardsRootProps",
    compound: true,
    demoBody: `return (
    <CheckboxCards.Root defaultValue={["a"]} columns={{ initial: "1", sm: "2" }}>
      <CheckboxCards.Item value="a">Option A</CheckboxCards.Item>
      <CheckboxCards.Item value="b">Option B</CheckboxCards.Item>
    </CheckboxCards.Root>
  );`,
  },
  "checkbox-group": {
    radixName: "CheckboxGroup",
    propsName: "CheckboxGroupRootProps",
    compound: true,
    demoBody: `return (
    <CheckboxGroup.Root defaultValue={["a"]}>
      <CheckboxGroup.Item value="a">Option A</CheckboxGroup.Item>
      <CheckboxGroup.Item value="b">Option B</CheckboxGroup.Item>
    </CheckboxGroup.Root>
  );`,
  },
  "data-list": {
    radixName: "DataList",
    propsName: "DataListRootProps",
    compound: true,
    demoBody: `return (
    <DataList.Root>
      <DataList.Item>
        <DataList.Label>Name</DataList.Label>
        <DataList.Value>Finam</DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );`,
  },
  "radio-cards": {
    radixName: "RadioCards",
    propsName: "RadioCardsRootProps",
    compound: true,
    demoBody: `return (
    <RadioCards.Root defaultValue="a" columns={{ initial: "1", sm: "2" }}>
      <RadioCards.Item value="a">Option A</RadioCards.Item>
      <RadioCards.Item value="b">Option B</RadioCards.Item>
    </RadioCards.Root>
  );`,
  },
  "radio-group": {
    radixName: "RadioGroup",
    propsName: "RadioGroupRootProps",
    compound: true,
    demoBody: `return (
    <RadioGroup.Root defaultValue="a">
      <RadioGroup.Item value="a">Option A</RadioGroup.Item>
      <RadioGroup.Item value="b">Option B</RadioGroup.Item>
    </RadioGroup.Root>
  );`,
  },
  "segmented-control": {
    radixName: "SegmentedControl",
    propsName: "SegmentedControlRootProps",
    compound: true,
    demoBody: `return (
    <SegmentedControl.Root defaultValue="a">
      <SegmentedControl.Item value="a">One</SegmentedControl.Item>
      <SegmentedControl.Item value="b">Two</SegmentedControl.Item>
    </SegmentedControl.Root>
  );`,
  },
  "tab-nav": {
    radixName: "TabNav",
    propsName: "TabNavRootProps",
    compound: true,
    demoBody: `return (
    <TabNav.Root>
      <TabNav.Link href="#" active>Active</TabNav.Link>
      <TabNav.Link href="#">Link</TabNav.Link>
    </TabNav.Root>
  );`,
  },
  table: {
    radixName: "Table",
    propsName: "TableRootProps",
    compound: true,
    demoBody: `return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Finam</Table.Cell>
          <Table.Cell>Design</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );`,
  },
  "alert-dialog": {
    radixName: "AlertDialog",
    propsName: "AlertDialogRootProps",
    compound: true,
    demoBody: `return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button>Open</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Confirm</AlertDialog.Title>
        <AlertDialog.Description size="2">Are you sure?</AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel><Button variant="soft" color="gray">Cancel</Button></AlertDialog.Cancel>
          <AlertDialog.Action><Button>Confirm</Button></AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );`,
  },
  "context-menu": {
    radixName: "ContextMenu",
    propsName: "ContextMenuRootProps",
    compound: true,
    demoBody: `return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Box p="4" style={{ border: "1px dashed var(--gray-a6)" }}>Right click</Box>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ V">Paste</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );`,
  },
  "dropdown-menu": {
    radixName: "DropdownMenu",
    propsName: "DropdownMenuRootProps",
    compound: true,
    demoBody: `return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );`,
  },
  "hover-card": {
    radixName: "HoverCard",
    propsName: "HoverCardRootProps",
    compound: true,
    demoBody: `return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Link href="#">@finam</Link>
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">
        <Text as="div" size="2">Hover card content</Text>
      </HoverCard.Content>
    </HoverCard.Root>
  );`,
  },
  popover: {
    radixName: "Popover",
    propsName: "PopoverRootProps",
    compound: true,
    demoBody: `return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">Open popover</Button>
      </Popover.Trigger>
      <Popover.Content width="260px">
        <Text as="div" size="2">Popover content</Text>
      </Popover.Content>
    </Popover.Root>
  );`,
  },
};

function pascalFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function simpleWrapper(spec: NonNullable<(typeof WRAPPER_SPEC)[string]>, entry: RadixThemesCatalogEntry): string {
  const exportName = pascalFromSlug(entry.slug);
  return `import { ${spec.radixName} } from "@radix-ui/themes";

export { ${spec.radixName} as ${exportName} };
export type { ${spec.propsName} as ${exportName}Props } from "@radix-ui/themes";
`;
}

function compoundWrapper(spec: NonNullable<(typeof WRAPPER_SPEC)[string]>, entry: RadixThemesCatalogEntry): string {
  const exportName = pascalFromSlug(entry.slug);
  const radixAlias = `Radix${spec.radixName}`;
  const imports = new Set<string>([`${spec.radixName} as ${radixAlias}`]);
  if (spec.demoBody?.includes("Button")) imports.add("Button");
  if (spec.demoBody?.includes("Link")) imports.add("Link");
  if (spec.demoBody?.includes("Box")) imports.add("Box");
  if (spec.demoBody?.includes("Flex")) imports.add("Flex");
  if (spec.demoBody?.includes("Text")) imports.add("Text");

  const demoBody = spec.demoBody!.replaceAll(`${spec.radixName}.`, `${radixAlias}.`);

  return `import { ${[...imports].join(", ")} } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type ${exportName}Props = ComponentProps<typeof ${radixAlias}.Root>;

export function ${exportName}(_props: ${exportName}Props) {
  ${demoBody}
}
`;
}

function catalogEntry(entry: RadixThemesCatalogEntry) {
  const propsType = WRAPPER_SPEC[entry.slug]?.propsName ?? `${pascalFromSlug(entry.slug)}Props`;
  const exportName = pascalFromSlug(entry.slug);
  const line: Record<string, unknown> = {
    slug: entry.slug,
    exportName,
    file: `${entry.slug}.tsx`,
    propsType,
  };
  return `  ${JSON.stringify(line).replace(/"([^"]+)":/g, "$1:")}`;
}

const customSlugs = new Set(
  RADIX_THEMES_CATALOG.filter((e) => e.customUiKit).map((e) => e.slug),
);

const catalogLines: string[] = [];

for (const entry of RADIX_THEMES_CATALOG) {
  if (entry.customUiKit) {
    catalogLines.push(
      `  { slug: "${entry.slug}", exportName: "${existingExportName(entry.slug)}", file: "${existingFile(entry.slug)}"${entry.slug === "tabs" ? ', propsType: "TabsRootProps"' : ""} },`,
    );
    continue;
  }

  const spec = WRAPPER_SPEC[entry.slug];
  if (!spec) {
    console.warn(`Skip ${entry.slug}: no wrapper spec`);
    continue;
  }

  const filePath = path.join(srcDir, `${entry.slug}.tsx`);
  const content = spec.compound
    ? compoundWrapper(spec, entry)
    : simpleWrapper(spec, entry);
  fs.writeFileSync(filePath, content, "utf8");
  catalogLines.push(catalogEntry(entry) + ",");
}

function existingExportName(slug: string): string {
  const map: Record<string, string> = {
    alert: "Alert",
    badge: "Badge",
    button: "Button",
    card: "Card",
    checkbox: "Checkbox",
    "icon-button": "IconButton",
    input: "Input",
    "legacy-chip": "LegacyChip",
    link: "Link",
    modal: "Modal",
    select: "Select",
    tabs: "Tabs",
  };
  return map[slug] ?? pascalFromSlug(slug);
}

function existingFile(slug: string): string {
  return `${slug}.tsx`;
}

const CUSTOM_INDEX_LINES: Record<string, string> = {
  alert: `export { Alert, type AlertProps, type AlertVariant } from "./alert";`,
  badge: `export { Badge, type BadgeProps, type BadgeVariant } from "./badge";`,
  button: `export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "./button";`,
  card: `export { Card, type CardProps } from "./card";`,
  checkbox: `export { Checkbox, type CheckboxProps } from "./checkbox";`,
  "icon-button": `export { IconButton, type IconButtonProps, type IconButtonSize } from "./icon-button";`,
  input: `export { Input, type InputProps, type InputSize } from "./input";`,
  "legacy-chip": `export { LegacyChip, type LegacyChipProps } from "./legacy-chip";`,
  link: `export { Link, type LinkProps } from "./link";`,
  modal: `export { Modal, type ModalProps } from "./modal";`,
  select: `export { Select, type SelectOption, type SelectProps, type SelectSize } from "./select";`,
  tabs: `export {
  Tabs,
  type TabsContentProps,
  type TabsListProps,
  type TabsRootProps,
  type TabsTriggerProps,
} from "./tabs";`,
};

const catalogTs = `/** Реестр компонентов ui-kit: slug портала → исходный файл. */
export const UI_KIT_CATALOG = [
${catalogLines.join("\n")}
] as const;

export type UiKitSlug = (typeof UI_KIT_CATALOG)[number]["slug"];

export const UI_KIT_SLUGS: UiKitSlug[] = UI_KIT_CATALOG.map((entry) => entry.slug);
`;

fs.writeFileSync(path.join(srcDir, "catalog.ts"), catalogTs, "utf8");

const indexLines = catalogLines
  .map((line) => {
    const slugMatch = line.match(/slug:\s*"([^"]+)"/);
    if (!slugMatch) return null;
    const slug = slugMatch[1];
    if (CUSTOM_INDEX_LINES[slug]) return CUSTOM_INDEX_LINES[slug];
    const exportMatch = line.match(/exportName:\s*"([^"]+)"/);
    if (!exportMatch) return null;
    const exportName = exportMatch[1];
    return `export { ${exportName}, type ${exportName}Props } from "./${slug}";`;
  })
  .filter(Boolean);

fs.writeFileSync(
  path.join(srcDir, "index.ts"),
  `${indexLines.join("\n")}\n\nexport { UI_KIT_CATALOG, UI_KIT_SLUGS, type UiKitSlug } from "./catalog";\n`,
  "utf8",
);

console.log(`Generated ${catalogLines.length} catalog entries.`);
