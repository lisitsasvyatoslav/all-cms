/** Реестр компонентов ui-kit: slug портала → исходный файл. */
export const UI_KIT_CATALOG = [
  {slug:"container",exportName:"Container",file:"container.tsx",propsType:"ContainerProps"},
  {slug:"section",exportName:"Section",file:"section.tsx",propsType:"SectionProps"},
  {slug:"scroll-area",exportName:"ScrollArea",file:"scroll-area.tsx",propsType:"ScrollAreaProps"},
  {slug:"blockquote",exportName:"Blockquote",file:"blockquote.tsx",propsType:"BlockquoteProps"},
  {slug:"em",exportName:"Em",file:"em.tsx",propsType:"EmProps"},
  {slug:"heading",exportName:"Heading",file:"heading.tsx",propsType:"HeadingProps"},
  { slug: "link", exportName: "Link", file: "link.tsx" },
  {slug:"strong",exportName:"Strong",file:"strong.tsx",propsType:"StrongProps"},
  {slug:"text",exportName:"Text",file:"text.tsx",propsType:"TextProps"},
  {slug:"avatar",exportName:"Avatar",file:"avatar.tsx",propsType:"AvatarProps"},
  { slug: "badge", exportName: "Badge", file: "badge.tsx" },
  { slug: "button", exportName: "Button", file: "button.tsx" },
  { slug: "card", exportName: "Card", file: "card.tsx" },
  { slug: "checkbox", exportName: "Checkbox", file: "checkbox.tsx" },
  { slug: "legacy-chip", exportName: "LegacyChip", file: "legacy-chip.tsx" },
  {slug:"progress",exportName:"Progress",file:"progress.tsx",propsType:"ProgressProps"},
  {slug:"radio",exportName:"Radio",file:"radio.tsx",propsType:"RadioProps"},
  { slug: "select", exportName: "Select", file: "select.tsx" },
  {slug:"slider",exportName:"Slider",file:"slider.tsx",propsType:"SliderProps"},
  {slug:"spinner",exportName:"Spinner",file:"spinner.tsx",propsType:"SpinnerProps"},
  {slug:"switch",exportName:"Switch",file:"switch.tsx",propsType:"SwitchProps"},
  {slug:"table",exportName:"Table",file:"table.tsx",propsType:"TableRootProps"},
  { slug: "tabs", exportName: "Tabs", file: "tabs.tsx", propsType: "TabsRootProps" },
  { slug: "input", exportName: "Input", file: "input.tsx" },
  { slug: "password-input", exportName: "PasswordInput", file: "password-input.tsx" },
  { slug: "icon-button", exportName: "IconButton", file: "icon-button.tsx" },
  { slug: "illustration", exportName: "Illustration", file: "illustration.tsx" },
  {slug:"context-menu",exportName:"ContextMenu",file:"context-menu.tsx",propsType:"ContextMenuRootProps"},
  {slug:"dropdown-menu",exportName:"DropdownMenu",file:"dropdown-menu.tsx",propsType:"DropdownMenuRootProps"},
  { slug: "alert", exportName: "Alert", file: "alert.tsx" },
  {slug:"alert-dialog",exportName:"AlertDialog",file:"alert-dialog.tsx",propsType:"AlertDialogRootProps"},
  { slug: "modal", exportName: "Modal", file: "modal.tsx" },
] as const;

export type UiKitSlug = (typeof UI_KIT_CATALOG)[number]["slug"];

export const UI_KIT_SLUGS: UiKitSlug[] = UI_KIT_CATALOG.map((entry) => entry.slug);
