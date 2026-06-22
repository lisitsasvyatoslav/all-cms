import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** figure block + logo section blocks for brand-pages. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_figure\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`src\` text NOT NULL,
  	\`alt\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_figure_order_idx\` ON \`brand_pages_blocks_figure\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_figure_parent_id_idx\` ON \`brand_pages_blocks_figure\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_figure_path_idx\` ON \`brand_pages_blocks_figure\` (\`_path\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_logo_background_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_background_grid_order_idx\` ON \`brand_pages_blocks_logo_background_grid\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_background_grid_parent_id_idx\` ON \`brand_pages_blocks_logo_background_grid\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_background_grid_path_idx\` ON \`brand_pages_blocks_logo_background_grid\` (\`_path\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_logo_background_grid_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`surface\` text NOT NULL,
  	\`logo_src\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_logo_background_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_background_grid_rules_order_idx\` ON \`brand_pages_blocks_logo_background_grid_rules\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_background_grid_rules_parent_id_idx\` ON \`brand_pages_blocks_logo_background_grid_rules\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_logo_clearspace\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_clearspace_order_idx\` ON \`brand_pages_blocks_logo_clearspace\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_clearspace_parent_id_idx\` ON \`brand_pages_blocks_logo_clearspace\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_clearspace_path_idx\` ON \`brand_pages_blocks_logo_clearspace\` (\`_path\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_logo_clearspace_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_logo_clearspace\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_clearspace_items_order_idx\` ON \`brand_pages_blocks_logo_clearspace_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_clearspace_items_parent_id_idx\` ON \`brand_pages_blocks_logo_clearspace_items\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid_order_idx\` ON \`brand_pages_blocks_logo_misuse_grid\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid_parent_id_idx\` ON \`brand_pages_blocks_logo_misuse_grid\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid_path_idx\` ON \`brand_pages_blocks_logo_misuse_grid\` (\`_path\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_src\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_logo_misuse_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid_items_order_idx\` ON \`brand_pages_blocks_logo_misuse_grid_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_logo_misuse_grid_items_parent_id_idx\` ON \`brand_pages_blocks_logo_misuse_grid_items\` (\`_parent_id\`);`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_logo_misuse_grid_items\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_logo_misuse_grid\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_logo_clearspace_items\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_logo_clearspace\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_logo_background_grid_rules\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_logo_background_grid\`;`);
  await db.run(sql`DROP TABLE IF EXISTS \`brand_pages_blocks_figure\`;`);
}
