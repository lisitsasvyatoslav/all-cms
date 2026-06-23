import { getPayload } from "payload";

import config from "@payload-config";
import type { DsOverview } from "@/payload-types";
import type { SourceLinkIconKind } from "@/lib/portal/core/source-link-icon";

import {
  buildDsOverviewSourceItemsSeed,
  DS_OVERVIEW_PAGE_SEED,
} from "./ds-overview-seed";

export type DsOverviewSourceItem = {
  label: string;
  description: string;
  href: string;
  icon: SourceLinkIconKind;
  external: boolean;
};

export type NormalizedDsOverviewPage = {
  eyebrow: string;
  title: string;
  lead: string;
  capabilitiesHeading: string;
  capabilities: string[];
  stackHeading: string;
  stackItems: string[];
  navigationNote: string;
  roadmapHeading: string;
  roadmap: string[];
  sourcesHeading: string;
  sourcesIntro: string;
  sourceItems: DsOverviewSourceItem[];
};

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

function normalizeStringList(
  items: { text?: string | null }[] | null | undefined,
  fallback: string[],
): string[] {
  const normalized =
    items
      ?.map((item) => trimOrNull(item.text))
      .filter((text): text is string => Boolean(text)) ?? [];

  return normalized.length ? normalized : fallback;
}

function normalizeLabelList(
  items: { label?: string | null }[] | null | undefined,
  fallback: string[],
): string[] {
  const normalized =
    items
      ?.map((item) => trimOrNull(item.label))
      .filter((label): label is string => Boolean(label)) ?? [];

  return normalized.length ? normalized : fallback;
}

function normalizeSourceIcon(value: string | null | undefined): SourceLinkIconKind {
  const icons: SourceLinkIconKind[] = [
    "figma",
    "github",
    "storybook",
    "docs",
    "markdown",
    "link",
  ];
  if (value && icons.includes(value as SourceLinkIconKind)) {
    return value as SourceLinkIconKind;
  }
  return "link";
}

function normalizeSourceItems(
  items: DsOverview["sourceItems"] | null | undefined,
): DsOverviewSourceItem[] {
  const normalized =
    items
      ?.map((item) => {
        const href = trimOrNull(item.href);
        const label = trimOrNull(item.label);
        if (!href || !label) return null;

        return {
          label,
          description: trimOrNull(item.description) ?? "",
          href,
          icon: normalizeSourceIcon(item.icon),
          external: item.external ?? true,
        };
      })
      .filter((item): item is DsOverviewSourceItem => Boolean(item)) ?? [];

  if (normalized.length) return normalized;

  return buildDsOverviewSourceItemsSeed({
    figmaLibraryUrl: "https://www.figma.com/community/file/1199125538294350451",
    storybookUrl: process.env.NEXT_PUBLIC_STORYBOOK_URL?.trim().replace(/\/$/, "") ||
      "http://127.0.0.1:6006",
    documentationUrl: "https://payloadcms.com/docs",
    repositoryUrl: "https://github.com/payloadcms/payload",
  });
}

function normalizePage(doc: DsOverview | null | undefined): NormalizedDsOverviewPage {
  return {
    eyebrow: trimOrNull(doc?.eyebrow) ?? DS_OVERVIEW_PAGE_SEED.eyebrow,
    title: trimOrNull(doc?.title) ?? DS_OVERVIEW_PAGE_SEED.title,
    lead: trimOrNull(doc?.lead) ?? DS_OVERVIEW_PAGE_SEED.lead,
    capabilitiesHeading:
      trimOrNull(doc?.capabilitiesHeading) ?? DS_OVERVIEW_PAGE_SEED.capabilitiesHeading,
    capabilities: normalizeStringList(doc?.capabilities, DS_OVERVIEW_PAGE_SEED.capabilities.map((c) => c.text)),
    stackHeading: trimOrNull(doc?.stackHeading) ?? DS_OVERVIEW_PAGE_SEED.stackHeading,
    stackItems: normalizeLabelList(
      doc?.stackItems,
      DS_OVERVIEW_PAGE_SEED.stackItems.map((item) => item.label),
    ),
    navigationNote: trimOrNull(doc?.navigationNote) ?? DS_OVERVIEW_PAGE_SEED.navigationNote,
    roadmapHeading: trimOrNull(doc?.roadmapHeading) ?? DS_OVERVIEW_PAGE_SEED.roadmapHeading,
    roadmap: normalizeStringList(doc?.roadmap, DS_OVERVIEW_PAGE_SEED.roadmap.map((item) => item.text)),
    sourcesHeading: trimOrNull(doc?.sourcesHeading) ?? DS_OVERVIEW_PAGE_SEED.sourcesHeading,
    sourcesIntro: trimOrNull(doc?.sourcesIntro) ?? DS_OVERVIEW_PAGE_SEED.sourcesIntro,
    sourceItems: normalizeSourceItems(doc?.sourceItems),
  };
}

export async function loadDsOverviewPage(): Promise<NormalizedDsOverviewPage> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "ds-overview",
    depth: 0,
    overrideAccess: true,
  });

  return normalizePage(doc);
}
