import type { PayloadRequest } from "payload";

/** Документация (blocks) доступна порталу и админке; для MCP API скрыта на поле. */
export function isPortalDocumentationReadable({ req }: { req: PayloadRequest }) {
  return req.payloadAPI !== "MCP";
}
