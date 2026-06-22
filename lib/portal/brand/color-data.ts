export type ColorStop = {
  hex: string;
  rgb: string;
};

export type ColorToken = {
  name: string;
  hex: string;
};

export type ColorMapping = {
  from: string;
  to: string;
};

export type BrandGradient = {
  id: string;
  title: string;
  stops: ColorStop[];
  angle?: number;
};

export type ChartPaletteColor = ColorStop & { name?: string };

export type BrandColorData = {
  hierarchy: {
    base: { title: string; description: string; tokens: ColorToken[] };
    semantic: { title: string; description: string; tokens: ColorToken[] };
    component: { title: string; description: string; tokens: ColorToken[] };
    mappings: ColorMapping[];
  };
  semantics: {
    sections: { title: string; body: string; items: string[] }[];
    namingParts: { part: string; required?: boolean; examples: string[] }[];
    examples: { token: string; description: string }[];
  };
  componentTokens: {
    intro: string[];
    namingParts: { part: string; examples: string[] }[];
    examples: { token: string; description: string }[];
  };
  gradients: BrandGradient[];
  chartPalette: {
    light: { id: string; label: string; colors: ChartPaletteColor[] };
    dark: { id: string; label: string; colors: ChartPaletteColor[] };
  };
};
