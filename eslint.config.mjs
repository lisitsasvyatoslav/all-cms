import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: [
      "app/(portal)/**/*.{ts,tsx}",
      "components/portal/**/*.{ts,tsx}",
      "lib/markdown/**/*.{ts,tsx}",
      "lib/portal/**/*.{ts,tsx}",
    ],
    ignores: ["lib/portal/bootstrap/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/portal/bootstrap", "@/lib/portal/bootstrap/*"],
              message:
                "Bootstrap data is for seed/codegen only. Read component content from Payload CMS at runtime.",
            },
            {
              group: ["@/lib/component-docs", "@/lib/portal/components/seed-data"],
              message:
                "Moved to lib/portal/bootstrap. Use Payload CMS at runtime.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
