import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { syncStorybookUrls } from "../lib/payload/sync-storybook-urls";
import { defaultStorybookBaseUrl } from "../lib/storybook/portal-preview-config";

async function main() {
  const baseUrl = defaultStorybookBaseUrl();

  if (!process.env.NEXT_PUBLIC_STORYBOOK_URL?.trim()) {
    console.warn(
      "NEXT_PUBLIC_STORYBOOK_URL не задан — используется fallback http://127.0.0.1:6006.\n" +
        "Задайте URL задеплоенного Storybook в .env.local и запустите снова.",
    );
  }

  const payload = await getPayload({ config });
  const result = await syncStorybookUrls(payload, baseUrl);

  console.log(
    [
      `Storybook base: ${result.baseUrl}`,
      `portal-sources: ${result.portalSourcesUpdated ? "updated" : "unchanged"}`,
      `components: ${result.componentsUpdated} updated`,
      `colors: ${result.colorsUpdated} updated`,
      `icons: ${result.iconsUpdated} updated`,
      "ds-overview: synced from portal-sources",
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
