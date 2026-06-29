import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** MCP tool: composeFromFigmaContext (Figma → TSX one-shot). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(
      sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`payload_mcp_tool_compose_from_figma_context\` integer DEFAULT 1;`,
    );
  } catch {
    /* колонка уже есть */
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
