import { Callout } from "@radix-ui/themes";

type Tone = "info" | "warning" | "success";

const toneConfig: Record<
  Tone,
  { color: "blue" | "amber" | "green"; icon: string }
> = {
  info: { color: "blue", icon: "ℹ" },
  warning: { color: "amber", icon: "!" },
  success: { color: "green", icon: "✓" },
};

export function PortalDocCallout({ tone, text }: { tone: Tone; text: string }) {
  const { color, icon } = toneConfig[tone];

  return (
    <Callout.Root color={color} variant="soft" role="note">
      <Callout.Icon>{icon}</Callout.Icon>
      <Callout.Text>{text}</Callout.Text>
    </Callout.Root>
  );
}
