import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { withCustomConfig } from "react-docgen-typescript";

import { UI_KIT_CATALOG } from "../src/catalog";
import { resolvePropDescription } from "../src/prop-descriptions";
import { shouldIncludeManifestProp } from "./props-manifest-filter";
import { createUiKitTypeResolver, formatDocgenPropType } from "./resolve-exported-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, "..");
const srcDir = path.join(packageRoot, "src");

export type PropsManifestProp = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required: boolean;
};

export type PropsManifestComponent = {
  exportName: string;
  sourceFile: string;
  props: PropsManifestProp[];
};

export type PropsManifest = {
  version: string;
  package: string;
  generatedAt: string;
  components: Record<string, PropsManifestComponent>;
};

function formatDefaultValue(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value === "undefined" ? undefined : value;
  if (typeof value === "object" && value !== null && "value" in value) {
    const inner = (value as { value: unknown }).value;
    if (inner == null || inner === "undefined") return undefined;
    return String(inner);
  }
  return String(value);
}

function main() {
  const resolveType = createUiKitTypeResolver(packageRoot);
  const components: PropsManifest["components"] = {};

  for (const entry of UI_KIT_CATALOG) {
    const filePath = path.join(srcDir, entry.file);
    const parser = withCustomConfig(path.join(packageRoot, "tsconfig.json"), {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => shouldIncludeManifestProp(prop, filePath),
    });
    const docs = parser.parse(filePath);
    const propsTypeName = "propsType" in entry && entry.propsType ? entry.propsType : entry.exportName;
    const doc =
      docs.find((item) => item.displayName === propsTypeName) ??
      docs.find((item) => item.displayName === entry.exportName) ??
      docs.find((item) => item.displayName !== undefined) ??
      docs[0];

    const props: PropsManifestProp[] = doc?.props
      ? Object.values(doc.props)
          .filter((prop) => shouldIncludeManifestProp(prop, filePath))
          .map((prop) => ({
            name: prop.name,
            type: formatDocgenPropType(prop, resolveType),
            defaultValue: formatDefaultValue(prop.defaultValue),
            description: resolvePropDescription(entry.slug, prop.name, prop.description),
            required: prop.required,
          }))
          .sort((a, b) => Number(a.required === b.required ? 0 : a.required ? -1 : 1) || a.name.localeCompare(b.name))
      : [];

    components[entry.slug] = {
      exportName: entry.exportName,
      sourceFile: `src/${entry.file}`,
      props,
    };

    console.log(`  ${entry.slug}: ${props.length} props`);
  }

  const manifest: PropsManifest = {
    version: JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version,
    package: "@next-app/ui-kit",
    generatedAt: new Date().toISOString(),
    components,
  };

  const outPath = path.join(packageRoot, "props-manifest.json");
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
}

main();
