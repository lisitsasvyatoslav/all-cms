import type { ManifestProp, RegistryComponent } from "./types";
import {
  BUTTON_VARIANT,
  CARD_VARIANT,
  CHILDREN,
  CLASS_NAME,
  DEFAULT_VALUE,
  DISABLED,
  FLEX_ALIGN,
  FLEX_DIRECTION,
  FLEX_GAP,
  FLEX_JUSTIFY,
  HEADING_AS,
  PLACEHOLDER,
  RADIX_COLORS,
  SIZE_1234,
  TEXT_AS,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
  TYPE_INPUT,
  VALUE_REQUIRED,
  compound,
} from "./radix-shared-props";

export const RADIX_THEMES_PACKAGE = "@radix-ui/themes";

const BUTTON_COLOR: ManifestProp = {
  name: "color",
  type: RADIX_COLORS,
  required: false,
};

const TEXT_FIELD_VARIANT: ManifestProp = {
  name: "variant",
  type: '"classic" | "surface" | "soft"',
  required: false,
};

const CALLOUT_COLOR: ManifestProp = {
  name: "color",
  type: '"gray" | "blue" | "green" | "red" | "yellow"',
  required: false,
  defaultValue: "blue",
};

/** Простые компоненты Radix Themes (id === exportName). */
const SIMPLE_COMPONENTS: Array<{
  id: string;
  exportName: string;
  props: ManifestProp[];
}> = [
  {
    id: "Box",
    exportName: "Box",
    props: [
      CLASS_NAME,
      FLEX_GAP,
      { name: "p", type: '"0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"', required: false },
      CHILDREN,
    ],
  },
  {
    id: "Flex",
    exportName: "Flex",
    props: [CLASS_NAME, FLEX_DIRECTION, FLEX_ALIGN, FLEX_JUSTIFY, FLEX_GAP, CHILDREN],
  },
  {
    id: "Grid",
    exportName: "Grid",
    props: [
      CLASS_NAME,
      {
        name: "columns",
        type: "string",
        required: false,
        description: 'CSS grid-template-columns, e.g. "2" or "1fr 1fr".',
      },
      FLEX_GAP,
      CHILDREN,
    ],
  },
  {
    id: "Container",
    exportName: "Container",
    props: [CLASS_NAME, SIZE_1234, CHILDREN],
  },
  {
    id: "Section",
    exportName: "Section",
    props: [CLASS_NAME, SIZE_1234, CHILDREN],
  },
  {
    id: "ScrollArea",
    exportName: "ScrollArea",
    props: [
      CLASS_NAME,
      { name: "type", type: '"auto" | "always" | "scroll" | "hover"', required: false },
      CHILDREN,
    ],
  },
  {
    id: "Inset",
    exportName: "Inset",
    props: [
      CLASS_NAME,
      { name: "side", type: '"top" | "right" | "bottom" | "left" | "x" | "y"', required: false },
      CHILDREN,
    ],
  },
  {
    id: "Text",
    exportName: "Text",
    props: [CLASS_NAME, TEXT_SIZE, TEXT_WEIGHT, TEXT_COLOR, TEXT_AS, CHILDREN],
  },
  {
    id: "Heading",
    exportName: "Heading",
    props: [CLASS_NAME, TEXT_SIZE, TEXT_WEIGHT, TEXT_COLOR, HEADING_AS, CHILDREN],
  },
  {
    id: "Blockquote",
    exportName: "Blockquote",
    props: [CLASS_NAME, TEXT_SIZE, TEXT_COLOR, CHILDREN],
  },
  {
    id: "Code",
    exportName: "Code",
    props: [
      CLASS_NAME,
      TEXT_SIZE,
      TEXT_COLOR,
      { name: "variant", type: '"solid" | "soft" | "outline" | "ghost"', required: false },
      CHILDREN,
    ],
  },
  { id: "Em", exportName: "Em", props: [CLASS_NAME, CHILDREN] },
  { id: "Strong", exportName: "Strong", props: [CLASS_NAME, CHILDREN] },
  {
    id: "Link",
    exportName: "Link",
    props: [
      CLASS_NAME,
      TEXT_SIZE,
      TEXT_WEIGHT,
      TEXT_COLOR,
      { name: "href", type: "string", required: false },
      { name: "target", type: "string", required: false },
      CHILDREN,
    ],
  },
  {
    id: "Kbd",
    exportName: "Kbd",
    props: [CLASS_NAME, TEXT_SIZE, CHILDREN],
  },
  {
    id: "Button",
    exportName: "Button",
    props: [
      CLASS_NAME,
      BUTTON_VARIANT,
      BUTTON_COLOR,
      SIZE_1234,
      DISABLED,
      { name: "loading", type: "boolean", required: false },
      { name: "highContrast", type: "boolean", required: false },
      { name: "type", type: '"button" | "submit" | "reset"', required: false, defaultValue: "button" },
      { name: "radius", type: '"none" | "small" | "medium" | "large" | "full"', required: false },
      CHILDREN,
    ],
  },
  {
    id: "IconButton",
    exportName: "IconButton",
    props: [
      CLASS_NAME,
      BUTTON_VARIANT,
      BUTTON_COLOR,
      SIZE_1234,
      DISABLED,
      { name: "radius", type: '"none" | "small" | "medium" | "large" | "full"', required: false },
      { name: "type", type: '"button" | "submit" | "reset"', required: false },
      CHILDREN,
    ],
  },
  {
    id: "Badge",
    exportName: "Badge",
    props: [
      CLASS_NAME,
      { name: "variant", type: '"solid" | "soft" | "surface" | "outline"', required: false },
      BUTTON_COLOR,
      SIZE_1234,
      { name: "radius", type: '"none" | "small" | "medium" | "large" | "full"', required: false },
      CHILDREN,
    ],
  },
  {
    id: "Avatar",
    exportName: "Avatar",
    props: [
      CLASS_NAME,
      SIZE_1234,
      { name: "variant", type: '"solid" | "soft"', required: false },
      BUTTON_COLOR,
      { name: "radius", type: '"none" | "small" | "medium" | "large" | "full"', required: false },
      { name: "fallback", type: "string", required: false },
      { name: "src", type: "string", required: false },
      { name: "alt", type: "string", required: false },
    ],
  },
  {
    id: "Card",
    exportName: "Card",
    props: [CLASS_NAME, CARD_VARIANT, SIZE_1234, CHILDREN],
  },
  {
    id: "Checkbox",
    exportName: "Checkbox",
    props: [
      CLASS_NAME,
      SIZE_1234,
      BUTTON_COLOR,
      DISABLED,
      { name: "defaultChecked", type: "boolean", required: false },
      { name: "checked", type: "boolean", required: false },
      CHILDREN,
    ],
  },
  {
    id: "Switch",
    exportName: "Switch",
    props: [
      CLASS_NAME,
      SIZE_1234,
      BUTTON_COLOR,
      DISABLED,
      { name: "defaultChecked", type: "boolean", required: false },
    ],
  },
  {
    id: "Radio",
    exportName: "Radio",
    props: [CLASS_NAME, SIZE_1234, BUTTON_COLOR, DISABLED, VALUE_REQUIRED, CHILDREN],
  },
  {
    id: "Slider",
    exportName: "Slider",
    props: [
      CLASS_NAME,
      SIZE_1234,
      BUTTON_COLOR,
      DISABLED,
      { name: "defaultValue", type: "number[]", required: false },
      { name: "min", type: "number", required: false },
      { name: "max", type: "number", required: false },
      { name: "step", type: "number", required: false },
    ],
  },
  {
    id: "Progress",
    exportName: "Progress",
    props: [
      CLASS_NAME,
      SIZE_1234,
      BUTTON_COLOR,
      { name: "value", type: "number", required: false },
      { name: "max", type: "number", required: false },
      { name: "duration", type: "string", required: false },
    ],
  },
  {
    id: "Spinner",
    exportName: "Spinner",
    props: [
      CLASS_NAME,
      SIZE_1234,
      BUTTON_COLOR,
      { name: "loading", type: "boolean", required: false },
    ],
  },
  {
    id: "Separator",
    exportName: "Separator",
    props: [
      CLASS_NAME,
      SIZE_1234,
      { name: "orientation", type: '"horizontal" | "vertical"', required: false },
    ],
  },
  {
    id: "Skeleton",
    exportName: "Skeleton",
    props: [
      CLASS_NAME,
      { name: "width", type: "string", required: false },
      { name: "height", type: "string", required: false },
    ],
  },
  {
    id: "TextArea",
    exportName: "TextArea",
    props: [
      CLASS_NAME,
      SIZE_1234,
      PLACEHOLDER,
      DISABLED,
      TEXT_FIELD_VARIANT,
      { name: "rows", type: "number", required: false },
      { name: "resize", type: '"none" | "vertical" | "horizontal" | "both"', required: false },
    ],
  },
  {
    id: "AspectRatio",
    exportName: "AspectRatio",
    props: [
      CLASS_NAME,
      { name: "ratio", type: "number", required: false, defaultValue: "1" },
      CHILDREN,
    ],
  },
  {
    id: "DataList",
    exportName: "DataList",
    props: [CLASS_NAME, SIZE_1234, CHILDREN],
  },
];

/** Compound-части Radix Themes. */
const COMPOUND_PARTS = [
  compound("Tabs.Root", "Tabs", "Root", [
    CLASS_NAME,
    DEFAULT_VALUE,
    { name: "value", type: "string", required: false },
    CHILDREN,
  ]),
  compound("Tabs.List", "Tabs", "List", [CLASS_NAME, CHILDREN]),
  compound("Tabs.Trigger", "Tabs", "Trigger", [CLASS_NAME, VALUE_REQUIRED, DISABLED, CHILDREN]),
  compound("Tabs.Content", "Tabs", "Content", [CLASS_NAME, VALUE_REQUIRED, CHILDREN]),

  compound("Dialog.Root", "Dialog", "Root", [
    { name: "open", type: "boolean", required: false },
    { name: "defaultOpen", type: "boolean", required: false },
    CHILDREN,
  ]),
  compound("Dialog.Trigger", "Dialog", "Trigger", [CLASS_NAME, CHILDREN]),
  compound("Dialog.Content", "Dialog", "Content", [
    CLASS_NAME,
    SIZE_1234,
    { name: "maxWidth", type: "string", required: false },
    CHILDREN,
  ]),
  compound("Dialog.Title", "Dialog", "Title", [CLASS_NAME, TEXT_SIZE, CHILDREN]),
  compound("Dialog.Description", "Dialog", "Description", [
    CLASS_NAME,
    TEXT_SIZE,
    TEXT_COLOR,
    CHILDREN,
  ]),
  compound("Dialog.Close", "Dialog", "Close", [CLASS_NAME, CHILDREN]),

  compound("Select.Root", "Select", "Root", [
    CLASS_NAME,
    SIZE_1234,
    DEFAULT_VALUE,
    { name: "name", type: "string", required: false },
    CHILDREN,
  ]),
  compound("Select.Trigger", "Select", "Trigger", [
    CLASS_NAME,
    PLACEHOLDER,
    { name: "variant", type: '"classic" | "surface" | "soft" | "ghost"', required: false },
  ]),
  compound("Select.Content", "Select", "Content", [
    CLASS_NAME,
    { name: "position", type: '"item-aligned" | "popper"', required: false },
    CHILDREN,
  ]),
  compound("Select.Item", "Select", "Item", [CLASS_NAME, VALUE_REQUIRED, DISABLED, CHILDREN]),
  compound("Select.Group", "Select", "Group", [CLASS_NAME, CHILDREN]),
  compound("Select.Label", "Select", "Label", [CLASS_NAME, CHILDREN]),
  compound("Select.Separator", "Select", "Separator", [CLASS_NAME]),

  compound("TextField.Root", "TextField", "Root", [
    CLASS_NAME,
    SIZE_1234,
    PLACEHOLDER,
    TYPE_INPUT,
    DISABLED,
    TEXT_FIELD_VARIANT,
    DEFAULT_VALUE,
    { name: "value", type: "string", required: false },
    { name: "required", type: "boolean", required: false },
  ]),
  compound("TextField.Slot", "TextField", "Slot", [
    CLASS_NAME,
    { name: "side", type: '"left" | "right"', required: false },
    CHILDREN,
  ]),

  compound("Callout.Root", "Callout", "Root", [
    CLASS_NAME,
    SIZE_1234,
    CALLOUT_COLOR,
    { name: "variant", type: '"soft" | "surface" | "outline"', required: false },
    CHILDREN,
  ]),
  compound("Callout.Icon", "Callout", "Icon", [CLASS_NAME, CHILDREN]),
  compound("Callout.Text", "Callout", "Text", [CLASS_NAME, TEXT_SIZE, CHILDREN]),

  compound("AlertDialog.Root", "AlertDialog", "Root", [
    { name: "open", type: "boolean", required: false },
    CHILDREN,
  ]),
  compound("AlertDialog.Trigger", "AlertDialog", "Trigger", [CLASS_NAME, CHILDREN]),
  compound("AlertDialog.Content", "AlertDialog", "Content", [
    CLASS_NAME,
    SIZE_1234,
    { name: "maxWidth", type: "string", required: false },
    CHILDREN,
  ]),
  compound("AlertDialog.Title", "AlertDialog", "Title", [CLASS_NAME, TEXT_SIZE, CHILDREN]),
  compound("AlertDialog.Description", "AlertDialog", "Description", [
    CLASS_NAME,
    TEXT_SIZE,
    TEXT_COLOR,
    CHILDREN,
  ]),
  compound("AlertDialog.Action", "AlertDialog", "Action", [
    CLASS_NAME,
    BUTTON_VARIANT,
    BUTTON_COLOR,
    CHILDREN,
  ]),
  compound("AlertDialog.Cancel", "AlertDialog", "Cancel", [CLASS_NAME, BUTTON_VARIANT, CHILDREN]),

  compound("Table.Root", "Table", "Root", [
    CLASS_NAME,
    SIZE_1234,
    { name: "variant", type: '"surface" | "ghost"', required: false },
    CHILDREN,
  ]),
  compound("Table.Header", "Table", "Header", [CLASS_NAME, CHILDREN]),
  compound("Table.Body", "Table", "Body", [CLASS_NAME, CHILDREN]),
  compound("Table.Row", "Table", "Row", [
    CLASS_NAME,
    { name: "align", type: '"start" | "center" | "end" | "baseline"', required: false },
    CHILDREN,
  ]),
  compound("Table.ColumnHeaderCell", "Table", "ColumnHeaderCell", [
    CLASS_NAME,
    { name: "justify", type: '"start" | "center" | "end"', required: false },
    CHILDREN,
  ]),
  compound("Table.RowHeaderCell", "Table", "RowHeaderCell", [
    CLASS_NAME,
    { name: "justify", type: '"start" | "center" | "end"', required: false },
    CHILDREN,
  ]),
  compound("Table.Cell", "Table", "Cell", [
    CLASS_NAME,
    { name: "justify", type: '"start" | "center" | "end"', required: false },
    CHILDREN,
  ]),

  compound("DropdownMenu.Root", "DropdownMenu", "Root", [
    { name: "open", type: "boolean", required: false },
    CHILDREN,
  ]),
  compound("DropdownMenu.Trigger", "DropdownMenu", "Trigger", [CLASS_NAME, CHILDREN]),
  compound("DropdownMenu.Content", "DropdownMenu", "Content", [
    CLASS_NAME,
    SIZE_1234,
    { name: "variant", type: '"solid" | "soft"', required: false },
    CHILDREN,
  ]),
  compound("DropdownMenu.Item", "DropdownMenu", "Item", [
    CLASS_NAME,
    DISABLED,
    { name: "shortcut", type: "string", required: false },
    CHILDREN,
  ]),
  compound("DropdownMenu.Label", "DropdownMenu", "Label", [CLASS_NAME, CHILDREN]),
  compound("DropdownMenu.Separator", "DropdownMenu", "Separator", [CLASS_NAME]),

  compound("ContextMenu.Root", "ContextMenu", "Root", [
    { name: "open", type: "boolean", required: false },
    CHILDREN,
  ]),
  compound("ContextMenu.Trigger", "ContextMenu", "Trigger", [CLASS_NAME, CHILDREN]),
  compound("ContextMenu.Content", "ContextMenu", "Content", [CLASS_NAME, SIZE_1234, CHILDREN]),
  compound("ContextMenu.Item", "ContextMenu", "Item", [CLASS_NAME, DISABLED, CHILDREN]),

  compound("Popover.Root", "Popover", "Root", [{ name: "open", type: "boolean", required: false }, CHILDREN]),
  compound("Popover.Trigger", "Popover", "Trigger", [CLASS_NAME, CHILDREN]),
  compound("Popover.Content", "Popover", "Content", [
    CLASS_NAME,
    SIZE_1234,
    { name: "width", type: "string", required: false },
    CHILDREN,
  ]),
  compound("Popover.Close", "Popover", "Close", [CLASS_NAME, CHILDREN]),

  compound("HoverCard.Root", "HoverCard", "Root", [{ name: "open", type: "boolean", required: false }, CHILDREN]),
  compound("HoverCard.Trigger", "HoverCard", "Trigger", [CLASS_NAME, CHILDREN]),
  compound("HoverCard.Content", "HoverCard", "Content", [
    CLASS_NAME,
    SIZE_1234,
    { name: "width", type: "string", required: false },
    CHILDREN,
  ]),

  compound("RadioGroup.Root", "RadioGroup", "Root", [
    CLASS_NAME,
    SIZE_1234,
    BUTTON_COLOR,
    DEFAULT_VALUE,
    { name: "name", type: "string", required: false },
    CHILDREN,
  ]),
  compound("RadioGroup.Item", "RadioGroup", "Item", [CLASS_NAME, VALUE_REQUIRED, DISABLED]),

  compound("CheckboxGroup.Root", "CheckboxGroup", "Root", [
    CLASS_NAME,
    SIZE_1234,
    BUTTON_COLOR,
    CHILDREN,
  ]),
  compound("CheckboxGroup.Item", "CheckboxGroup", "Item", [CLASS_NAME, DISABLED, CHILDREN]),

  compound("SegmentedControl.Root", "SegmentedControl", "Root", [
    CLASS_NAME,
    SIZE_1234,
    DEFAULT_VALUE,
    CHILDREN,
  ]),
  compound("SegmentedControl.Item", "SegmentedControl", "Item", [
    CLASS_NAME,
    VALUE_REQUIRED,
    DISABLED,
    CHILDREN,
  ]),

  compound("TabNav.Root", "TabNav", "Root", [CLASS_NAME, SIZE_1234, CHILDREN]),
  compound("TabNav.Link", "TabNav", "Link", [
    CLASS_NAME,
    { name: "href", type: "string", required: false },
    { name: "active", type: "boolean", required: false },
    CHILDREN,
  ]),
];

function toRegistryComponent(entry: {
  id: string;
  exportName: string;
  member?: string;
  props: ManifestProp[];
}): RegistryComponent {
  return {
    id: entry.id,
    exportName: entry.exportName,
    member: entry.member,
    importPath: RADIX_THEMES_PACKAGE,
    props: entry.props,
    sourceFile: `@radix-ui/themes/${entry.exportName}`,
  };
}

function buildRadixRegistryComponents(): Record<string, RegistryComponent> {
  const components: Record<string, RegistryComponent> = {};

  for (const entry of SIMPLE_COMPONENTS) {
    components[entry.id] = toRegistryComponent(entry);
  }

  for (const part of COMPOUND_PARTS) {
    components[part.id] = toRegistryComponent(part);
  }

  return components;
}

export const RADIX_REGISTRY_COMPONENTS = buildRadixRegistryComponents();

export function getRadixRegistryMeta() {
  return {
    version: "3.3.0",
    package: RADIX_THEMES_PACKAGE,
    generatedAt: "2026-06-26T00:00:00.000Z",
    componentCount: Object.keys(RADIX_REGISTRY_COMPONENTS).length,
  };
}
