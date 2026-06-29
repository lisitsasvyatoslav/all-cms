import crypto from "node:crypto";

import type { PayloadRequest, TypedUser } from "payload";

import {
  buildDemoMcpUser,
  isDemoMcpApiKey,
  readBearerApiKey,
  shouldBypassMcpDbAuth,
} from "./demo-mcp-access";

const CACHE_TTL_MS = 5 * 60 * 1000;

type CachedUser = {
  user: TypedUser;
  expiresAt: number;
};

const userByApiKeyIndex = new Map<string, CachedUser>();

function getUserCollection(req: PayloadRequest): string {
  return req.payload.config.admin?.user ?? "users";
}

/**
 * MCP custom tools: user для access.read на components.
 * В dev demo-ключ не требует запроса к БД (Turso timeout → MCP 500).
 */
export async function resolveMcpUser(
  req: PayloadRequest,
): Promise<TypedUser | undefined> {
  if (req.user) {
    return req.user as TypedUser;
  }

  const apiKey = readBearerApiKey(req);
  if (!apiKey) {
    return undefined;
  }

  if (shouldBypassMcpDbAuth() && isDemoMcpApiKey(apiKey)) {
    return buildDemoMcpUser(getUserCollection(req));
  }

  const apiKeyIndex = crypto
    .createHmac("sha256", req.payload.secret)
    .update(apiKey)
    .digest("hex");

  const cached = userByApiKeyIndex.get(apiKeyIndex);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.user;
  }

  const { docs } = await req.payload.find({
    collection: "payload-mcp-api-keys",
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      apiKeyIndex: {
        equals: apiKeyIndex,
      },
    },
  });

  const user = docs[0]?.user;
  if (user && typeof user === "object") {
    const typedUser = user as TypedUser;
    userByApiKeyIndex.set(apiKeyIndex, {
      user: typedUser,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return typedUser;
  }

  return undefined;
}
