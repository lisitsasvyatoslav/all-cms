import manifest from "@next-app/ui-kit/props-manifest.json";

import type { PortalPropsTableRow } from "@/components/portal/documentation/portal-props-table";

import type { PropsManifest, PropsManifestProp } from "./props-manifest-types";

/** Runtime source of truth for component API Reference on portal pages. */

export const UI_KIT_PACKAGE_NAME = "@next-app/ui-kit";

const propsManifest = manifest as PropsManifest;

export function getUiKitPropsManifest(): PropsManifest {
  return propsManifest;
}

export function hasUiKitProps(slug: string): boolean {
  const entry = propsManifest.components[slug];
  return Boolean(entry?.props?.length);
}

function toPortalRow(prop: PropsManifestProp): PortalPropsTableRow {
  return {
    name: prop.name,
    type: prop.type,
    defaultValue: prop.defaultValue,
    description: prop.description,
  };
}

/** Пропсы компонента из props-manifest.json пакета ui-kit. */
export function getUiKitPropsForSlug(slug: string): PortalPropsTableRow[] {
  const entry = propsManifest.components[slug];
  if (!entry?.props?.length) return [];
  return entry.props.map(toPortalRow);
}

export function getUiKitExportName(slug: string): string | null {
  return propsManifest.components[slug]?.exportName ?? null;
}
