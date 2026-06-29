import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** MCP tools: composeUi, resolveComposeIntent (plain-language compose). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const stmt of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_compose_ui\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_resolve_compose_intent\` integer DEFAULT 1;`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже есть */
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
