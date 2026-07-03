import { createHash } from "node:crypto";
import type { Payload } from "payload";

export type ComposePayloadGuidance = {
  revision: string;
  packageName: string;
  packageVersion: string;
  installCommands: string[];
  setupCode: string;
  usageGuideMarkdown: string;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function loadComposePayloadGuidance(
  payload: Payload,
): Promise<ComposePayloadGuidance> {
  const doc = await payload.findGlobal({
    slug: "ds-overview",
    depth: 0,
    overrideAccess: true,
  });

  const guidance = {
    packageName: text(doc.packageName),
    packageVersion: text(doc.packageVersion),
    installCommands:
      doc.installCommands?.map((item) => text(item.command)).filter(Boolean) ?? [],
    setupCode: text(doc.setupCode),
    usageGuideMarkdown: text(doc.usageGuideMarkdown),
  };

  return {
    revision: createHash("sha256")
      .update(JSON.stringify(guidance))
      .digest("hex")
      .slice(0, 16),
    ...guidance,
  };
}
