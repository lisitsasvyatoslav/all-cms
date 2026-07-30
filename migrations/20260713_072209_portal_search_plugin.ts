import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`search\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`priority\` numeric,
  	\`excerpt\` text,
  	\`portal_url\` text,
  	\`area\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_updated_at_idx\` ON \`search\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_created_at_idx\` ON \`search\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`search_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`ds_pages_id\` integer,
  	\`components_id\` integer,
  	\`brand_pages_id\` integer,
  	\`glossary_terms_id\` integer,
  	\`colors_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ds_pages_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`components_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`brand_pages_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`glossary_terms_id\`) REFERENCES \`glossary_terms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`colors_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_order_idx\` ON \`search_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_parent_idx\` ON \`search_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_path_idx\` ON \`search_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_ds_pages_id_idx\` ON \`search_rels\` (\`ds_pages_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_components_id_idx\` ON \`search_rels\` (\`components_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_brand_pages_id_idx\` ON \`search_rels\` (\`brand_pages_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_glossary_terms_id_idx\` ON \`search_rels\` (\`glossary_terms_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_rels_colors_id_idx\` ON \`search_rels\` (\`colors_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`search_id\` integer REFERENCES search(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`search\`;`)
  await db.run(sql`DROP TABLE \`search_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`components_id\` integer,
  	\`design_checklist_items_id\` integer,
  	\`glossary_terms_id\` integer,
  	\`brand_pages_id\` integer,
  	\`ds_pages_id\` integer,
  	\`colors_id\` integer,
  	\`icons_id\` integer,
  	\`notes_id\` integer,
  	\`field_showcase_id\` integer,
  	\`payload_mcp_api_keys_id\` integer,
  	\`payload_folders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`components_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`design_checklist_items_id\`) REFERENCES \`design_checklist_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`glossary_terms_id\`) REFERENCES \`glossary_terms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`brand_pages_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ds_pages_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`colors_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`icons_id\`) REFERENCES \`icons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notes_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`field_showcase_id\`) REFERENCES \`field_showcase\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_mcp_api_keys_id\`) REFERENCES \`payload_mcp_api_keys\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "components_id", "design_checklist_items_id", "glossary_terms_id", "brand_pages_id", "ds_pages_id", "colors_id", "icons_id", "notes_id", "field_showcase_id", "payload_mcp_api_keys_id", "payload_folders_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "components_id", "design_checklist_items_id", "glossary_terms_id", "brand_pages_id", "ds_pages_id", "colors_id", "icons_id", "notes_id", "field_showcase_id", "payload_mcp_api_keys_id", "payload_folders_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_components_id_idx\` ON \`payload_locked_documents_rels\` (\`components_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_design_checklist_items_id_idx\` ON \`payload_locked_documents_rels\` (\`design_checklist_items_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_glossary_terms_id_idx\` ON \`payload_locked_documents_rels\` (\`glossary_terms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_brand_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`brand_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ds_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`ds_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_colors_id_idx\` ON \`payload_locked_documents_rels\` (\`colors_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_icons_id_idx\` ON \`payload_locked_documents_rels\` (\`icons_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_field_showcase_id_idx\` ON \`payload_locked_documents_rels\` (\`field_showcase_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_mcp_api_keys_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_mcp_api_keys_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
}
