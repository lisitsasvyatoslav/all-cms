/** Slug'и со stories, поддерживаемыми вручную (не перезаписывать generate-ds-stories). */
export const MANUAL_DS_STORY_SLUGS = new Set([
  "badge",
  "button",
  "card",
  "checkbox",
  "input",
  "legacy-chip",
  "link",
  "modal",
  "select",
  "tabs",
]);

/** Compound-обёртки ui-kit: достаточно `<Component />`. */
export const SELF_CLOSING_DS_STORY_SLUGS = new Set([
  "alert-dialog",
  "checkbox-cards",
  "checkbox-group",
  "context-menu",
  "data-list",
  "dropdown-menu",
  "hover-card",
  "popover",
  "radio-cards",
  "radio-group",
  "segmented-control",
  "tab-nav",
  "table",
]);

type StoryPreviewSpec = {
  extraImports?: string[];
  defaultBody: string;
  relatedPreviewBody: string;
  metaComponent?: string;
};

const PREVIEW_BY_SLUG: Record<string, StoryPreviewSpec> = {
  "aspect-ratio": {
    extraImports: ["Box"],
    defaultBody: `<AspectRatio ratio={16 / 9}><Box width="100%" height="100%" style={{ background: "var(--gray-a3)" }} /></AspectRatio>`,
    relatedPreviewBody: `<AspectRatio ratio={16 / 9} style={{ width: 280 }}><Box width="100%" height="100%" style={{ background: "var(--gray-a3)" }} /></AspectRatio>`,
  },
  box: {
    defaultBody: `<Box p="4" style={{ border: "1px solid var(--gray-a6)" }}>Box</Box>`,
    relatedPreviewBody: `<Box p="4" style={{ border: "1px solid var(--gray-a6)" }}>Box</Box>`,
  },
  container: {
    defaultBody: `<Container size="2"><Text>Container</Text></Container>`,
    relatedPreviewBody: `<Container size="2"><Text>Container</Text></Container>`,
    extraImports: ["Text"],
  },
  flex: {
    extraImports: ["Button"],
    defaultBody: `<Flex gap="2"><Button>One</Button><Button variant="soft">Two</Button></Flex>`,
    relatedPreviewBody: `<Flex gap="2"><Button>One</Button><Button variant="soft">Two</Button></Flex>`,
  },
  grid: {
    defaultBody: `<Grid columns="2" gap="2" width="240px"><Box p="3" style={{ background: "var(--gray-a3)" }}>A</Box><Box p="3" style={{ background: "var(--gray-a3)" }}>B</Box></Grid>`,
    relatedPreviewBody: `<Grid columns="2" gap="2" width="240px"><Box p="3" style={{ background: "var(--gray-a3)" }}>A</Box><Box p="3" style={{ background: "var(--gray-a3)" }}>B</Box></Grid>`,
    extraImports: ["Box"],
  },
  inset: {
    extraImports: ["Box"],
    defaultBody: `<Inset p="current" clip="padding-box"><Box p="4" style={{ background: "var(--accent-a3)" }}>Inset</Box></Inset>`,
    relatedPreviewBody: `<Inset p="current" clip="padding-box"><Box p="4" style={{ background: "var(--accent-a3)" }}>Inset</Box></Inset>`,
  },
  section: {
    extraImports: ["Text"],
    defaultBody: `<Section size="2"><Text>Section</Text></Section>`,
    relatedPreviewBody: `<Section size="2"><Text>Section</Text></Section>`,
  },
  "scroll-area": {
    extraImports: ["Text"],
    defaultBody: `<ScrollArea type="always" scrollbars="vertical" style={{ height: 120, width: 240 }}><Text as="p" size="2">Scrollable content line 1<br />Line 2<br />Line 3<br />Line 4</Text></ScrollArea>`,
    relatedPreviewBody: `<ScrollArea type="always" scrollbars="vertical" style={{ height: 120, width: 240 }}><Text as="p" size="2">Scrollable content</Text></ScrollArea>`,
  },
  blockquote: {
    defaultBody: `<Blockquote>Design systems scale consistency.</Blockquote>`,
    relatedPreviewBody: `<Blockquote>Design systems scale consistency.</Blockquote>`,
  },
  code: {
    defaultBody: `<Code>npm run dev</Code>`,
    relatedPreviewBody: `<Code>npm run dev</Code>`,
  },
  em: {
    defaultBody: `<Text><Em>Emphasis</Em> in text</Text>`,
    relatedPreviewBody: `<Text><Em>Emphasis</Em> in text</Text>`,
    extraImports: ["Text"],
  },
  heading: {
    defaultBody: `<Heading size="5">Heading</Heading>`,
    relatedPreviewBody: `<Heading size="5">Heading</Heading>`,
  },
  kbd: {
    defaultBody: `<Text><Kbd>⌘</Kbd> + <Kbd>K</Kbd></Text>`,
    relatedPreviewBody: `<Text><Kbd>⌘</Kbd> + <Kbd>K</Kbd></Text>`,
    extraImports: ["Text"],
  },
  quote: {
    defaultBody: `<Quote>Short quote</Quote>`,
    relatedPreviewBody: `<Quote>Short quote</Quote>`,
  },
  strong: {
    defaultBody: `<Text><Strong>Strong</Strong> label</Text>`,
    relatedPreviewBody: `<Text><Strong>Strong</Strong> label</Text>`,
    extraImports: ["Text"],
  },
  text: {
    defaultBody: `<Text size="3">Body text</Text>`,
    relatedPreviewBody: `<Text size="3">Body text</Text>`,
  },
  avatar: {
    defaultBody: `<Avatar fallback="A" radius="full" size="3" />`,
    relatedPreviewBody: `<Avatar fallback="A" radius="full" size="3" />`,
  },
  progress: {
    defaultBody: `<Progress value={60} />`,
    relatedPreviewBody: `<Progress value={60} style={{ width: 240 }} />`,
  },
  radio: {
    defaultBody: `<Flex align="center" gap="2"><Radio name="demo" value="a" defaultChecked /> <Text size="2">Option</Text></Flex>`,
    relatedPreviewBody: `<Flex align="center" gap="2"><Radio name="preview" value="a" defaultChecked /> <Text size="2">Radio</Text></Flex>`,
    extraImports: ["Flex", "Text"],
  },
  separator: {
    defaultBody: `<Flex direction="column" gap="3" width="240px"><Text size="2">Above</Text><Separator size="4" /><Text size="2">Below</Text></Flex>`,
    relatedPreviewBody: `<Flex direction="column" gap="3" width="240px"><Text size="2">Above</Text><Separator size="4" /><Text size="2">Below</Text></Flex>`,
    extraImports: ["Flex", "Text"],
  },
  skeleton: {
    defaultBody: `<Skeleton width="240px" height="32px" />`,
    relatedPreviewBody: `<Skeleton width="240px" height="32px" />`,
  },
  slider: {
    defaultBody: `<Slider defaultValue={[50]} />`,
    relatedPreviewBody: `<Slider defaultValue={[50]} style={{ width: 240 }} />`,
  },
  spinner: {
    defaultBody: `<Spinner />`,
    relatedPreviewBody: `<Spinner />`,
  },
  switch: {
    defaultBody: `<Flex align="center" gap="2"><Switch defaultChecked /><Text size="2">Enabled</Text></Flex>`,
    relatedPreviewBody: `<Flex align="center" gap="2"><Switch defaultChecked /><Text size="2">Switch</Text></Flex>`,
    extraImports: ["Flex", "Text"],
  },
  tooltip: {
    extraImports: ["Button"],
    defaultBody: `<Tooltip content="Tooltip"><Button variant="soft">Hover me</Button></Tooltip>`,
    relatedPreviewBody: `<Tooltip content="Tooltip"><Button variant="soft">Tooltip</Button></Tooltip>`,
  },
  "text-area": {
    defaultBody: `<TextArea placeholder="Text area" />`,
    relatedPreviewBody: `<TextArea placeholder="Text area" style={{ width: 280 }} />`,
  },
  "accessible-icon": {
    extraImports: ["Button"],
    defaultBody: `<AccessibleIcon label="Close"><Button variant="ghost">×</Button></AccessibleIcon>`,
    relatedPreviewBody: `<AccessibleIcon label="Close"><Button variant="ghost">×</Button></AccessibleIcon>`,
  },
  tabs: {
    extraImports: ["Box", "Text"],
    metaComponent: "Tabs.Root",
    defaultBody: `<Tabs.Root defaultValue="one"><Tabs.List><Tabs.Trigger value="one">One</Tabs.Trigger><Tabs.Trigger value="two">Two</Tabs.Trigger></Tabs.List><Box pt="3"><Tabs.Content value="one"><Text size="2">Tab one</Text></Tabs.Content></Box></Tabs.Root>`,
    relatedPreviewBody: `<Tabs.Root defaultValue="one"><Tabs.List><Tabs.Trigger value="one">Tab 1</Tabs.Trigger><Tabs.Trigger value="two">Tab 2</Tabs.Trigger></Tabs.List></Tabs.Root>`,
  },
};

export function storyPreviewSpecForSlug(
  slug: string,
  exportName: string,
): StoryPreviewSpec {
  if (PREVIEW_BY_SLUG[slug]) return PREVIEW_BY_SLUG[slug]!;

  if (SELF_CLOSING_DS_STORY_SLUGS.has(slug)) {
    return {
      defaultBody: `<${exportName} />`,
      relatedPreviewBody: `<${exportName} />`,
    };
  }

  return {
    defaultBody: `<${exportName} />`,
    relatedPreviewBody: `<${exportName} />`,
  };
}
