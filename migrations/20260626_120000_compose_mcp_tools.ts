import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Колонки MCP tools для ui-kit compose (getComposeGuide, …). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const stmt of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_compose_guide\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_component_registry\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_validate_composition\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_render_composition\` integer DEFAULT 1;`,
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
