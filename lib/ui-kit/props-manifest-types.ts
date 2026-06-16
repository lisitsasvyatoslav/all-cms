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
