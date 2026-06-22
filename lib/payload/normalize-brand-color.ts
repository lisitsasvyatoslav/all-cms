import type { BrandColorData } from "@/lib/portal/brand/color-data";

type BrandColorDoc = {
  hierarchyBase?: {
    title?: string | null;
    description?: string | null;
    tokens?: { name: string; hex: string }[] | null;
  } | null;
  hierarchySemantic?: {
    title?: string | null;
    description?: string | null;
    tokens?: { name: string; hex: string }[] | null;
  } | null;
  hierarchyComponent?: {
    title?: string | null;
    description?: string | null;
    tokens?: { name: string; hex: string }[] | null;
  } | null;
  hierarchyMappings?: { from: string; to: string }[] | null;
  semanticsSections?: {
    title: string;
    body: string;
    items?: { text: string }[] | null;
  }[] | null;
  semanticsNamingParts?: {
    part: string;
    required?: boolean | null;
    examples?: { text: string }[] | null;
  }[] | null;
  semanticsExamples?: { token: string; description: string }[] | null;
  componentTokensIntro?: { text: string }[] | null;
  componentTokensNamingParts?: {
    part: string;
    examples?: { text: string }[] | null;
  }[] | null;
  componentTokensExamples?: { token: string; description: string }[] | null;
  gradients?: {
    gradientId: string;
    title: string;
    angle?: number | null;
    stops?: { hex: string; rgb: string }[] | null;
  }[] | null;
  chartPaletteLightLabel?: string | null;
  chartPaletteLight?: { hex: string; rgb: string; name?: string | null }[] | null;
  chartPaletteDarkLabel?: string | null;
  chartPaletteDark?: { hex: string; rgb: string; name?: string | null }[] | null;
};

const EMPTY_HIERARCHY_LEVEL = { title: "", description: "", tokens: [] as { name: string; hex: string }[] };

function normalizeHierarchyLevel(level: BrandColorDoc["hierarchyBase"]) {
  return {
    title: level?.title?.trim() ?? "",
    description: level?.description?.trim() ?? "",
    tokens: level?.tokens?.length ? level.tokens : [],
  };
}

function hasBrandColorContent(doc: BrandColorDoc): boolean {
  return Boolean(
    doc.hierarchyBase?.tokens?.length ||
      doc.hierarchySemantic?.tokens?.length ||
      doc.hierarchyComponent?.tokens?.length ||
      doc.hierarchyMappings?.length ||
      doc.semanticsSections?.length ||
      doc.semanticsNamingParts?.length ||
      doc.semanticsExamples?.length ||
      doc.componentTokensIntro?.length ||
      doc.componentTokensNamingParts?.length ||
      doc.componentTokensExamples?.length ||
      doc.gradients?.length ||
      doc.chartPaletteLight?.length ||
      doc.chartPaletteDark?.length,
  );
}

export function normalizeBrandColorData(
  doc: BrandColorDoc | null | undefined,
): BrandColorData | null {
  if (!doc || !hasBrandColorContent(doc)) return null;

  return {
    hierarchy: {
      base: normalizeHierarchyLevel(doc.hierarchyBase ?? EMPTY_HIERARCHY_LEVEL),
      semantic: normalizeHierarchyLevel(doc.hierarchySemantic ?? EMPTY_HIERARCHY_LEVEL),
      component: normalizeHierarchyLevel(doc.hierarchyComponent ?? EMPTY_HIERARCHY_LEVEL),
      mappings: doc.hierarchyMappings?.length ? doc.hierarchyMappings : [],
    },
    semantics: {
      sections:
        doc.semanticsSections?.map((section) => ({
          title: section.title?.trim() ?? "",
          body: section.body?.trim() ?? "",
          items: section.items?.map((item) => item.text).filter(Boolean) ?? [],
        })) ?? [],
      namingParts:
        doc.semanticsNamingParts?.map((part) => ({
          part: part.part?.trim() ?? "",
          required: part.required ?? false,
          examples: part.examples?.map((item) => item.text).filter(Boolean) ?? [],
        })) ?? [],
      examples: doc.semanticsExamples?.length ? doc.semanticsExamples : [],
    },
    componentTokens: {
      intro: doc.componentTokensIntro?.map((item) => item.text).filter(Boolean) ?? [],
      namingParts:
        doc.componentTokensNamingParts?.map((part) => ({
          part: part.part?.trim() ?? "",
          examples: part.examples?.map((item) => item.text).filter(Boolean) ?? [],
        })) ?? [],
      examples: doc.componentTokensExamples?.length ? doc.componentTokensExamples : [],
    },
    gradients:
      doc.gradients?.map((gradient) => ({
        id: gradient.gradientId?.trim() ?? "",
        title: gradient.title?.trim() ?? "",
        angle: gradient.angle ?? undefined,
        stops: gradient.stops?.length ? gradient.stops : [],
      })) ?? [],
    chartPalette: {
      light: {
        id: "light",
        label: doc.chartPaletteLightLabel?.trim() ?? "",
        colors:
          doc.chartPaletteLight?.map((color) => ({
            hex: color.hex,
            rgb: color.rgb,
            name: color.name ?? undefined,
          })) ?? [],
      },
      dark: {
        id: "dark",
        label: doc.chartPaletteDarkLabel?.trim() ?? "",
        colors:
          doc.chartPaletteDark?.map((color) => ({
            hex: color.hex,
            rgb: color.rgb,
            name: color.name ?? undefined,
          })) ?? [],
      },
    },
  };
}

export function brandColorDataToPayload(data: BrandColorData) {
  return {
    hierarchyBase: data.hierarchy.base,
    hierarchySemantic: data.hierarchy.semantic,
    hierarchyComponent: data.hierarchy.component,
    hierarchyMappings: data.hierarchy.mappings,
    semanticsSections: data.semantics.sections.map((section) => ({
      title: section.title,
      body: section.body,
      items: section.items.map((text) => ({ text })),
    })),
    semanticsNamingParts: data.semantics.namingParts.map((part) => ({
      part: part.part,
      required: part.required ?? false,
      examples: part.examples.map((text) => ({ text })),
    })),
    semanticsExamples: data.semantics.examples,
    componentTokensIntro: data.componentTokens.intro.map((text) => ({ text })),
    componentTokensNamingParts: data.componentTokens.namingParts.map((part) => ({
      part: part.part,
      examples: part.examples.map((text) => ({ text })),
    })),
    componentTokensExamples: data.componentTokens.examples,
    gradients: data.gradients.map((gradient) => ({
      gradientId: gradient.id,
      title: gradient.title,
      angle: gradient.angle ?? null,
      stops: gradient.stops,
    })),
    chartPaletteLightLabel: data.chartPalette.light.label,
    chartPaletteLight: data.chartPalette.light.colors,
    chartPaletteDarkLabel: data.chartPalette.dark.label,
    chartPaletteDark: data.chartPalette.dark.colors,
  };
}
