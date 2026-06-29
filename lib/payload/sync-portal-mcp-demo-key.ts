import crypto from "node:crypto";

import type { Payload } from "payload";

import { allCustomMcpToolFlags } from "@/lib/mcp/demo-mcp-access";
import { readDefaultMcpApiKey } from "@/lib/portal/core/cursor-mcp-install";

const DEMO_KEY_LABEL = "Portal demo MCP (Cursor / compose)";

async function findMcpUserId(payload: Payload): Promise<number> {
  const preferredRoles = ["admin", "pm", "developer"] as const;

  for (const role of preferredRoles) {
    const { docs } = await payload.find({
      collection: "users",
      limit: 1,
      overrideAccess: true,
      where: { role: { equals: role } },
    });
    if (docs[0]?.id) {
      return docs[0].id;
    }
  }

  const { docs } = await payload.find({
    collection: "users",
    limit: 1,
    overrideAccess: true,
  });

  const userId = docs[0]?.id;
  if (!userId) {
    throw new Error(
      "No users in database. Create an admin user in Payload Admin before syncing MCP demo key.",
    );
  }

  return userId;
}

export async function syncPortalMcpDemoKey(payload: Payload) {
  const apiKey = readDefaultMcpApiKey();
  const apiKeyIndex = crypto
    .createHmac("sha256", payload.secret)
    .update(apiKey)
    .digest("hex");

  const existing = await payload.find({
    collection: "payload-mcp-api-keys",
    limit: 1,
    overrideAccess: true,
    where: { apiKeyIndex: { equals: apiKeyIndex } },
  });

  const toolFlags = allCustomMcpToolFlags();

  if (existing.docs[0]) {
    await payload.update({
      collection: "payload-mcp-api-keys",
      id: existing.docs[0].id,
      overrideAccess: true,
      data: {
        label: DEMO_KEY_LABEL,
        enableAPIKey: true,
        "payload-mcp-tool": toolFlags,
      },
    });
    return { action: "updated" as const, id: existing.docs[0].id, apiKey };
  }

  const userId = await findMcpUserId(payload);

  const created = await payload.create({
    collection: "payload-mcp-api-keys",
    overrideAccess: true,
    data: {
      user: userId,
      label: DEMO_KEY_LABEL,
      description: "Auto-created for local MCP (Cursor Add to Cursor / compose).",
      enableAPIKey: true,
      apiKey,
      "payload-mcp-tool": toolFlags,
    },
  });

  return { action: "created" as const, id: created.id, apiKey };
}
