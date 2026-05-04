import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Идемпотентно: после `next dev` схема могла уже «push»-нуться в SQLite. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`figma_url\` text,
  	\`storybook_url\` text,
  	\`docs_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`components_slug_idx\` ON \`components\` (\`slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`components_updated_at_idx\` ON \`components\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`components_created_at_idx\` ON \`components\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`token_key\` text,
  	\`hex\` text NOT NULL,
  	\`sort_order\` numeric DEFAULT 0,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`colors_updated_at_idx\` ON \`colors\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`colors_created_at_idx\` ON \`colors\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`icons\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text,
  	\`preview_id\` integer,
  	\`figma_url\` text,
  	\`storybook_url\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`preview_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`icons_preview_idx\` ON \`icons\` (\`preview_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`icons_updated_at_idx\` ON \`icons\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`icons_created_at_idx\` ON \`icons\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portal_sources\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`figma_library_url\` text,
  	\`storybook_url\` text,
  	\`documentation_url\` text,
  	\`repository_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `);

  for (const stmt of [
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`components_id\` integer REFERENCES components(id);`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`colors_id\` integer REFERENCES colors(id);`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`icons_id\` integer REFERENCES icons(id);`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже добавлена push-режимом или повторным прогоном */
    }
  }
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_components_id_idx\` ON \`payload_locked_documents_rels\` (\`components_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_colors_id_idx\` ON \`payload_locked_documents_rels\` (\`colors_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_icons_id_idx\` ON \`payload_locked_documents_rels\` (\`icons_id\`);`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`components\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`colors\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`icons\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`portal_sources\`;`);
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`notes_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notes_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "notes_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "notes_id" FROM \`payload_locked_documents_rels\`;`);
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`);
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`);
}
