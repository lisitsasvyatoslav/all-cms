import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import type { PayloadRequest } from "payload";
import { z } from "zod";

import { filterDocumentationForLlm } from "./filter-documentation-for-llm";
import { resolveMcpUser } from "./resolve-mcp-user";

type McpTools = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>;

/** Поля components, доступные MCP-агенту (без documentation blocks). */
export const MCP_COMPONENT_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  figmaUrl: true,
  storybookUrl: true,
  docsUrl: true,
} as const;

export { isPortalDocumentationReadable as isComponentDocumentationReadable } from "@/lib/payload/documentation-access";

function mcpText(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  };
}

export const componentAgentMcpTools: McpTools = [
  {
    name: "getComponent",
    description:
      "Карточка UI-компонента (components): name, slug, description, ссылки. Без documentation. Укажи slug или id.",
    parameters: {
      slug: z
        .string()
        .optional()
        .describe("Slug компонента, например button или input"),
      id: z
        .number()
        .optional()
        .describe("Числовой ID документа, если slug неизвестен"),
    },
    handler: async (
      args: Record<string, unknown>,
      req: PayloadRequest,
    ) => {
      const slug =
        typeof args.slug === "string" && args.slug.trim()
          ? args.slug.trim()
          : undefined;
      const id =
        args.id !== undefined && args.id !== null && args.id !== ""
          ? Number(args.id)
          : undefined;

      if (!slug && (id === undefined || Number.isNaN(id))) {
        return mcpText("Укажи slug или id.");
      }

      const user = await resolveMcpUser(req);
      if (!user) {
        return mcpText("Не удалось определить пользователя MCP API key.");
      }

      const { payload } = req;
      const result = await payload.find({
        collection: "components",
        where: slug ? { slug: { equals: slug } } : { id: { equals: id! } },
        limit: 1,
        depth: 0,
        select: MCP_COMPONENT_SELECT,
        req,
        user,
        overrideAccess: false,
      });

      const doc = result.docs[0];
      if (!doc) {
        return mcpText("Компонент не найден.");
      }

      return mcpText(JSON.stringify(doc, null, 2));
    },
  },
  {
    name: "listComponents",
    description:
      "Список карточек UI-компонентов (name, slug, description, ссылки). Без documentation.",
    parameters: {
      limit: z
        .number()
        .optional()
        .describe("Максимум записей в ответе (по умолчанию 50)"),
    },
    handler: async (
      args: Record<string, unknown>,
      req: PayloadRequest,
    ) => {
      const rawLimit = args.limit;
      const limit =
        rawLimit !== undefined && rawLimit !== null && rawLimit !== ""
          ? Number(rawLimit)
          : 50;

      const user = await resolveMcpUser(req);
      if (!user) {
        return mcpText("Не удалось определить пользователя MCP API key.");
      }

      const { payload } = req;
      const result = await payload.find({
        collection: "components",
        limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 50,
        depth: 0,
        select: MCP_COMPONENT_SELECT,
        req,
        user,
        overrideAccess: false,
      });

      return mcpText(
        JSON.stringify(
          {
            totalDocs: result.totalDocs,
            docs: result.docs,
          },
          null,
          2,
        ),
      );
    },
  },
  {
    name: "listComponentsFull",
    description:
      "Полный список коллекции components: все поля, documentation только с блоками, у которых в CMS включён showLLM. Большой ответ; для карточки — listComponents.",
    parameters: {
      limit: z
        .number()
        .optional()
        .describe("Максимум записей (по умолчанию 50, макс. 100)"),
      page: z
        .number()
        .optional()
        .describe("Номер страницы (по умолчанию 1)"),
      depth: z
        .number()
        .optional()
        .describe(
          "Глубина populate связей в blocks (0–2, по умолчанию 1)",
        ),
    },
    handler: async (
      args: Record<string, unknown>,
      req: PayloadRequest,
    ) => {
      const rawLimit = args.limit;
      const limit =
        rawLimit !== undefined && rawLimit !== null && rawLimit !== ""
          ? Number(rawLimit)
          : 50;
      const rawPage = args.page;
      const page =
        rawPage !== undefined && rawPage !== null && rawPage !== ""
          ? Number(rawPage)
          : 1;
      const rawDepth = args.depth;
      let depth =
        rawDepth !== undefined && rawDepth !== null && rawDepth !== ""
          ? Number(rawDepth)
          : 1;
      if (!Number.isFinite(depth) || depth < 0) depth = 0;
      if (depth > 2) depth = 2;

      const user = await resolveMcpUser(req);
      if (!user) {
        return mcpText("Не удалось определить пользователя MCP API key.");
      }

      const { payload } = req;
      const result = await payload.find({
        collection: "components",
        limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 50,
        page: Number.isFinite(page) && page > 0 ? page : 1,
        depth,
        req,
        user,
        // Полный документ: field access скрывает documentation для MCP — обходим только в этом tool.
        overrideAccess: true,
      });

      const docs = result.docs.map((doc) => filterDocumentationForLlm(doc));

      return mcpText(
        JSON.stringify(
          {
            totalDocs: result.totalDocs,
            page: result.page,
            totalPages: result.totalPages,
            docs,
          },
          null,
          2,
        ),
      );
    },
  },
];
