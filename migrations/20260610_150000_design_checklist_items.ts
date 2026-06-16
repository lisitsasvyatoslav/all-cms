import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Справочник design checklist + статусы на components. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`design_checklist_items\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`description\` text,
  	\`category\` text,
  	\`sort_order\` numeric DEFAULT 0,
  	\`is_active\` integer DEFAULT 1,
  	\`updated_at\` text NOT NULL,
  	\`created_at\` text NOT NULL
  );`);

  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`design_checklist_items_slug_idx\` ON \`design_checklist_items\` (\`slug\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_design_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item_id\` integer,
  	\`done\` integer DEFAULT 0,
  	\`note\` text,
  	FOREIGN KEY (\`item_id\`) REFERENCES \`design_checklist_items\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`components_design_checklist_order_idx\` ON \`components_design_checklist\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`components_design_checklist_parent_id_idx\` ON \`components_design_checklist\` (\`_parent_id\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
