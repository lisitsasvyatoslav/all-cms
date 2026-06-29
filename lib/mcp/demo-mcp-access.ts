import type { MCPAccessSettings } from "@payloadcms/plugin-mcp";
import type { PayloadRequest, TypedUser } from "payload";

import { readDefaultMcpApiKey } from "@/lib/portal/core/cursor-mcp-install";

/** Все custom MCP tools (compose + docs). */
export function allCustomMcpToolFlags() {
  return {
    getComponent: true,
    listComponents: true,
    listComponentsFull: true,
    getComposeUserPromptGuide: true,
    composeUi: true,
    composeFromFigmaContext: true,
    resolveComposeIntent: true,
    getComposeGuide: true,
    getFigmaComposeWorkflow: true,
    planCompositionFromBrief: true,
    getComponentRegistry: true,
    validateComposition: true,
    renderComposition: true,
  } as const;
}

/** В dev для demo-ключа не ходим в Turso при handshake MCP. */
export function shouldBypassMcpDbAuth(): boolean {
  if (process.env.PAYLOAD_MCP_DEMO_BYPASS_AUTH === "false") {
    return false;
  }
  if (process.env.PAYLOAD_MCP_DEMO_BYPASS_AUTH === "true") {
    return true;
  }
  return process.env.NODE_ENV === "development" && !process.env.VERCEL;
}

export function readBearerApiKey(req: PayloadRequest): string | null {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }
  const apiKey = authorization.replace("Bearer ", "").trim();
  return apiKey || null;
}

export function isDemoMcpApiKey(apiKey: string): boolean {
  return apiKey === readDefaultMcpApiKey();
}

export function buildDemoMcpUser(userCollection = "users"): TypedUser {
  return {
    id: 1,
    role: "admin",
    collection: userCollection,
  } as TypedUser;
}

export function buildDemoMcpAccessSettings(userCollection = "users"): MCPAccessSettings {
  return {
    user: buildDemoMcpUser(userCollection),
    "payload-mcp-tool": { ...allCustomMcpToolFlags() },
  };
}

type GetDefaultMcpAccessSettings = (
  overrideApiKey?: string | null,
) => Promise<MCPAccessSettings>;

/** Payload MCP plugin: demo key без запроса к Turso/SQLite в dev. */
export function createMcpOverrideAuth(userCollection = "users") {
  return async (
    req: PayloadRequest,
    getDefaultMcpAccessSettings: GetDefaultMcpAccessSettings,
  ): Promise<MCPAccessSettings> => {
    const apiKey = readBearerApiKey(req);

    if (apiKey && shouldBypassMcpDbAuth() && isDemoMcpApiKey(apiKey)) {
      if (process.env.NODE_ENV === "development") {
        req.payload.logger.info(
          "[payload-mcp] Demo API key — auth bypass (no DB lookup).",
        );
      }
      return buildDemoMcpAccessSettings(userCollection);
    }

    return getDefaultMcpAccessSettings(apiKey);
  };
}
