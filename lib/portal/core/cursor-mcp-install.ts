import { componentWebMarkdownPath, componentWebPagePath } from "@/lib/portal/components/routes";

/** Имя MCP-сервера в Cursor (query `name` deeplink). */
export const CURSOR_MCP_SERVER_NAME = "design-system-portal";

export const PAYLOAD_MCP_API_KEY_STORAGE_KEY = "portal:payload-mcp-api-key";

export type McpRemoteServerConfig = {
  command: string;
  args: string[];
};

export function resolvePortalSiteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://127.0.0.1:3000";
}

export function resolvePayloadMcpEndpointUrl(): string {
  return `${resolvePortalSiteBaseUrl()}/api/mcp`;
}

export function payloadMcpApiKeysAdminUrl(): string {
  return `${resolvePortalSiteBaseUrl()}/admin/collections/payload-mcp-api-keys/create`;
}

export function buildPayloadMcpRemoteConfig(
  apiKey: string,
  mcpEndpointUrl = resolvePayloadMcpEndpointUrl(),
): McpRemoteServerConfig {
  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    throw new Error("MCP API key is required");
  }

  return {
    command: "npx",
    args: [
      "-y",
      "mcp-remote",
      mcpEndpointUrl,
      "--header",
      `Authorization: Bearer ${trimmedKey}`,
    ],
  };
}

function encodeConfigBase64(config: McpRemoteServerConfig): string {
  const json = JSON.stringify(config);
  if (typeof btoa === "function") {
    return btoa(json);
  }
  return Buffer.from(json, "utf8").toString("base64");
}

/** Cursor deeplink: https://cursor.com/docs/mcp/install-links */
export function buildCursorMcpInstallDeeplink(
  serverName: string,
  serverConfig: McpRemoteServerConfig,
): string {
  const params = new URLSearchParams({
    name: serverName,
    config: encodeConfigBase64(serverConfig),
  });
  return `cursor://anysphere.cursor-deeplink/mcp/install?${params.toString()}`;
}

export function buildDesignSystemPortalMcpDeeplink(apiKey: string): string {
  const config = buildPayloadMcpRemoteConfig(apiKey);
  return buildCursorMcpInstallDeeplink(CURSOR_MCP_SERVER_NAME, config);
}

export function openCursorMcpInstallDeeplink(deeplink: string): void {
  window.location.assign(deeplink);
}

export function readStoredMcpApiKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(PAYLOAD_MCP_API_KEY_STORAGE_KEY)?.trim();
    return value || null;
  } catch {
    return null;
  }
}

export function writeStoredMcpApiKey(apiKey: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PAYLOAD_MCP_API_KEY_STORAGE_KEY, apiKey.trim());
}

export function clearStoredMcpApiKey(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PAYLOAD_MCP_API_KEY_STORAGE_KEY);
}

export function buildCursorStarterPrompt(componentSlug: string): string {
  const pageUrl = `${resolvePortalSiteBaseUrl()}${componentWebPagePath(componentSlug)}`;
  const markdownUrl = `${resolvePortalSiteBaseUrl()}${componentWebMarkdownPath(componentSlug)}`;
  return [
    `I'm reading the design system docs for component "${componentSlug}".`,
    `Page: ${pageUrl}`,
    `Markdown: ${markdownUrl}`,
    "",
    "Use MCP tools getComponent or listComponentsFull for structured data.",
    `Start with getComponent slug="${componentSlug}".`,
  ].join("\n");
}
