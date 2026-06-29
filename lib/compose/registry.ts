import { getRadixRegistryMeta, RADIX_REGISTRY_COMPONENTS } from "./radix-registry-data";
import type { ComponentRegistry, RegistryComponent } from "./types";
import { COMPOSITION_VERSION } from "./types";

let cachedRegistry: ComponentRegistry | undefined;

function buildRegistry(): ComponentRegistry {
  const meta = getRadixRegistryMeta();

  return {
    version: meta.version,
    package: meta.package,
    generatedAt: meta.generatedAt,
    components: { ...RADIX_REGISTRY_COMPONENTS },
  };
}

export function getComponentRegistry(): ComponentRegistry {
  if (!cachedRegistry) {
    cachedRegistry = buildRegistry();
  }
  return cachedRegistry;
}

export function getRegistryComponent(
  componentId: string,
): RegistryComponent | undefined {
  return getComponentRegistry().components[componentId];
}

export function listRegistryComponentIds(): string[] {
  return Object.keys(getComponentRegistry().components).sort();
}

/** Сводка реестра для MCP (Radix Themes). */
export function getRegistrySummary() {
  const registry = getComponentRegistry();
  return {
    version: registry.version,
    package: registry.package,
    generatedAt: registry.generatedAt,
    componentCount: Object.keys(registry.components).length,
    compose: {
      callFirst: "getComposeGuide",
      compositionVersion: COMPOSITION_VERSION,
      workflow:
        "getComposeGuide → plan JSON → validateComposition → renderComposition",
      target: "@radix-ui/themes only — do not use @next-app/ui-kit in Composition JSON",
    },
    components: Object.values(registry.components).map((entry) => ({
      id: entry.id,
      exportName: entry.exportName,
      member: entry.member,
      props: entry.props.map((prop) => ({
        name: prop.name,
        type: prop.type,
        required: prop.required ?? false,
        defaultValue: prop.defaultValue,
        description: prop.description,
      })),
    })),
  };
}
