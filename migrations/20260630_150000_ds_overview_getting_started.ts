import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const statement of [
    sql`ALTER TABLE \`ds_overview\` ADD \`installation_heading\` text;`,
    sql`ALTER TABLE \`ds_overview\` ADD \`installation_intro\` text;`,
    sql`ALTER TABLE \`ds_overview\` ADD \`package_name\` text;`,
    sql`ALTER TABLE \`ds_overview\` ADD \`package_version\` text;`,
    sql`ALTER TABLE \`ds_overview\` ADD \`setup_code\` text;`,
    sql`ALTER TABLE \`ds_overview\` ADD \`principles_heading\` text;`,
    sql`ALTER TABLE \`ds_overview\` ADD \`principles_intro\` text;`,
  ]) {
    try {
      await db.run(statement);
    } catch {
      // Existing columns are expected when repairing a partially pushed schema.
    }
  }

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview_install_commands\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`command\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_overview_install_commands_order_idx\` ON \`ds_overview_install_commands\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_overview_install_commands_parent_id_idx\` ON \`ds_overview_install_commands\` (\`_parent_id\`);`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview_principles\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text NOT NULL,
    \`agent_rule\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_overview_principles_order_idx\` ON \`ds_overview_principles\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_overview_principles_parent_id_idx\` ON \`ds_overview_principles\` (\`_parent_id\`);`);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally irreversible: preserve editable CMS content.
}
