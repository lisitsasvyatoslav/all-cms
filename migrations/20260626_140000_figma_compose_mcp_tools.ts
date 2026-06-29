import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** MCP tools: Figma → Design Brief → Composition. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const stmt of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_figma_compose_workflow\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_plan_composition_from_brief\` integer DEFAULT 1;`,
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
