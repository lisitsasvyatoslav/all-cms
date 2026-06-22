import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Перенос полей палитры с global brand-color на коллекцию brand-pages. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const stmt of [
    sql`ALTER TABLE \`brand_pages\` ADD \`hierarchy_base_title\` text`,
    sql`ALTER TABLE \`brand_pages\` ADD \`hierarchy_base_description\` text`,
    sql`ALTER TABLE \`brand_pages\` ADD \`hierarchy_semantic_title\` text`,
    sql`ALTER TABLE \`brand_pages\` ADD \`hierarchy_semantic_description\` text`,
    sql`ALTER TABLE \`brand_pages\` ADD \`hierarchy_component_title\` text`,
    sql`ALTER TABLE \`brand_pages\` ADD \`hierarchy_component_description\` text`,
    sql`ALTER TABLE \`brand_pages\` ADD \`chart_palette_light_label\` text DEFAULT 'Светлая тема'`,
    sql`ALTER TABLE \`brand_pages\` ADD \`chart_palette_dark_label\` text DEFAULT 'Тёмная тема'`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* column already exists */
    }
  }

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_hierarchy_base_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`hex\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_base_tokens_order_idx\` ON \`brand_pages_hierarchy_base_tokens\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_base_tokens_parent_id_idx\` ON \`brand_pages_hierarchy_base_tokens\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_hierarchy_semantic_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`hex\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_semantic_tokens_order_idx\` ON \`brand_pages_hierarchy_semantic_tokens\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_semantic_tokens_parent_id_idx\` ON \`brand_pages_hierarchy_semantic_tokens\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_hierarchy_component_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`hex\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_component_tokens_order_idx\` ON \`brand_pages_hierarchy_component_tokens\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_component_tokens_parent_id_idx\` ON \`brand_pages_hierarchy_component_tokens\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_hierarchy_mappings\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_mappings_order_idx\` ON \`brand_pages_hierarchy_mappings\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_hierarchy_mappings_parent_id_idx\` ON \`brand_pages_hierarchy_mappings\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_semantics_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`body\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_sections_order_idx\` ON \`brand_pages_semantics_sections\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_sections_parent_id_idx\` ON \`brand_pages_semantics_sections\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_semantics_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_semantics_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_sections_items_order_idx\` ON \`brand_pages_semantics_sections_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_sections_items_parent_id_idx\` ON \`brand_pages_semantics_sections_items\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_semantics_naming_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`part\` text NOT NULL,
  	\`required\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_naming_parts_order_idx\` ON \`brand_pages_semantics_naming_parts\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_naming_parts_parent_id_idx\` ON \`brand_pages_semantics_naming_parts\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_semantics_naming_parts_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_semantics_naming_parts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_naming_parts_examples_order_idx\` ON \`brand_pages_semantics_naming_parts_examples\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_naming_parts_examples_parent_id_idx\` ON \`brand_pages_semantics_naming_parts_examples\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_semantics_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`token\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_examples_order_idx\` ON \`brand_pages_semantics_examples\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_semantics_examples_parent_id_idx\` ON \`brand_pages_semantics_examples\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_component_tokens_intro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_intro_order_idx\` ON \`brand_pages_component_tokens_intro\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_intro_parent_id_idx\` ON \`brand_pages_component_tokens_intro\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_component_tokens_naming_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`part\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_naming_parts_order_idx\` ON \`brand_pages_component_tokens_naming_parts\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_naming_parts_parent_id_idx\` ON \`brand_pages_component_tokens_naming_parts\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_component_tokens_naming_parts_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_component_tokens_naming_parts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_naming_parts_examples_order_idx\` ON \`brand_pages_component_tokens_naming_parts_examples\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_naming_parts_examples_parent_id_idx\` ON \`brand_pages_component_tokens_naming_parts_examples\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_component_tokens_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`token\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_examples_order_idx\` ON \`brand_pages_component_tokens_examples\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_component_tokens_examples_parent_id_idx\` ON \`brand_pages_component_tokens_examples\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_gradients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`gradient_id\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`angle\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_gradients_order_idx\` ON \`brand_pages_gradients\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_gradients_parent_id_idx\` ON \`brand_pages_gradients\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_gradients_stops\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex\` text NOT NULL,
  	\`rgb\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_gradients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_gradients_stops_order_idx\` ON \`brand_pages_gradients_stops\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_gradients_stops_parent_id_idx\` ON \`brand_pages_gradients_stops\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_chart_palette_light\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex\` text NOT NULL,
  	\`rgb\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_chart_palette_light_order_idx\` ON \`brand_pages_chart_palette_light\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_chart_palette_light_parent_id_idx\` ON \`brand_pages_chart_palette_light\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_chart_palette_dark\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex\` text NOT NULL,
  	\`rgb\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_chart_palette_dark_order_idx\` ON \`brand_pages_chart_palette_dark\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_chart_palette_dark_parent_id_idx\` ON \`brand_pages_chart_palette_dark\` (\`_parent_id\`);`,
  );

  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_hierarchy_base_tokens\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_hierarchy_semantic_tokens\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_hierarchy_component_tokens\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_hierarchy_mappings\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_semantics_sections_items\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_semantics_sections\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_semantics_naming_parts_examples\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_semantics_naming_parts\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_semantics_examples\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_component_tokens_intro\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_component_tokens_naming_parts_examples\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_component_tokens_naming_parts\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_component_tokens_examples\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_gradients_stops\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_gradients\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_chart_palette_light\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color_chart_palette_dark\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_color\`;`);

  for (const stmt of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` DROP COLUMN \`brand_color_find\``,
    sql`ALTER TABLE \`payload_mcp_api_keys\` DROP COLUMN \`brand_color_update\``,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* SQLite may not support DROP COLUMN on older versions */
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* Откат вручную при необходимости. */
}
