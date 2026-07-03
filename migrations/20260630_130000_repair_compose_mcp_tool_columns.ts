import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/**
 * Repairs MCP tool columns for databases whose migration history predates the
 * complete compose tool set. Every statement is safe when the column exists.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const statement of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_compose_user_prompt_guide\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_compose_guide\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_figma_compose_workflow\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_plan_composition_from_brief\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_get_component_registry\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_validate_composition\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_render_composition\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_compose_from_figma_context\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_compose_ui\` integer DEFAULT 1;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_resolve_compose_intent\` integer DEFAULT 1;`,
  ]) {
    try {
      await db.run(statement);
    } catch {
      // SQLite has no ADD COLUMN IF NOT EXISTS. Existing columns are expected.
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally irreversible: dropping SQLite columns is unsafe here.
}
