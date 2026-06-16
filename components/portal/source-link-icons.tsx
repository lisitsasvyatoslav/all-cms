import type { ReactNode } from "react";

import type { SourceLinkIconKind } from "@/lib/portal/source-link-icon";
import { portalBrandIconPaths } from "@/lib/portal/public-icon-paths";

type IconProps = {
  className?: string;
};

const PUBLIC_SOURCE_LINK_ICONS: Partial<
  Record<SourceLinkIconKind, (typeof portalBrandIconPaths)[keyof typeof portalBrandIconPaths]>
> = {
  figma: portalBrandIconPaths.figma,
  github: portalBrandIconPaths.github,
  storybook: portalBrandIconPaths.storybook,
  markdown: portalBrandIconPaths.markdown,
};

function IconFrame({ children, className }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function ReactAriaIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#7C3AED" />
      <path
        d="M5.2 11.2V4.8h1.45c1.02 0 1.75.58 1.75 1.58 0 .66-.3 1.14-.84 1.38l1.12 3.44H7.55L6.55 8.05H6.65v3.15H5.2Zm1.45-4.35h-.25v1.55h.28c.45 0 .7-.24.7-.76 0-.5-.25-.79-.73-.79Z"
        fill="#fff"
      />
    </IconFrame>
  );
}

function RadixIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#111827" />
      <path
        d="M4.6 11.2V4.8h2.55c1.45 0 2.35.78 2.35 2.02 0 .86-.42 1.45-1.12 1.72l1.42 2.68H7.95L6.75 8.75H6.15v2.45H4.6Zm2.55-3.85c.62 0 .98-.32.98-.86 0-.54-.36-.86-.98-.86H6.15v1.72h1Z"
        fill="#fff"
      />
    </IconFrame>
  );
}

function TailwindIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path
        fill="#38BDF8"
        d="M8 3.2c2.24 0 3.52 1.12 3.84 3.36 1.44-1.44 2.48-1.98 3.12-1.62.48.27.72.95.72 2.04 0 .58-.08 1.2-.24 1.86C14.8 11.2 13.2 12.8 10.4 12.8c-2.24 0-3.52-1.12-3.84-3.36-1.44 1.44-2.48 1.98-3.12 1.62-.48-.27-.72-.95-.72-2.04 0-.58.08-1.2.24-1.86C1.2 4.8 2.8 3.2 5.6 3.2H8Z"
      />
    </IconFrame>
  );
}

function DocsIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path
        fill="currentColor"
        d="M4.5 2.667h4.553l3.58 3.58V13.2a.867.867 0 0 1-.867.867H4.5a.867.867 0 0 1-.867-.867V3.533c0-.48.388-.866.867-.866Zm4.22 1.3v2.9h2.9l-2.9-2.9ZM6.1 8.8h3.8v1.1H6.1V8.8Zm0-2.2h3.8v1.1H6.1V6.6Z"
      />
    </IconFrame>
  );
}

function LinkIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        d="M6.2 9.8 9.8 6.2M7.1 5.3l1.1-1.1a2.2 2.2 0 0 1 3.1 0l.4.4a2.2 2.2 0 0 1 0 3.1l-1.1 1.1M8.9 10.7l-1.1 1.1a2.2 2.2 0 0 1-3.1 0l-.4-.4a2.2 2.2 0 0 1 0-3.1l1.1-1.1"
      />
    </IconFrame>
  );
}

const FALLBACK_ICONS: Partial<Record<SourceLinkIconKind, (props: IconProps) => ReactNode>> = {
  "react-aria": ReactAriaIcon,
  radix: RadixIcon,
  tailwind: TailwindIcon,
  docs: DocsIcon,
  link: LinkIcon,
};

export function SourceLinkIcon({
  kind,
  className,
}: {
  kind: SourceLinkIconKind;
  className?: string;
}) {
  const publicSrc = PUBLIC_SOURCE_LINK_ICONS[kind];
  if (publicSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static brand SVG from /public
      <img
        className={className}
        src={publicSrc}
        alt=""
        width={16}
        height={16}
        decoding="async"
        draggable={false}
      />
    );
  }

  const Fallback = FALLBACK_ICONS[kind] ?? LinkIcon;
  return <Fallback className={className} />;
}
