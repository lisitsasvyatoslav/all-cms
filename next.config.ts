import path from "path";
import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: "/docs",
});

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
  webpack: (config) => {
    config.resolve.alias["next-mdx-import-source-file"] = path.resolve(
      "./mdx-components.tsx",
    );
    return config;
  },
};

export default withNextra(nextConfig);
