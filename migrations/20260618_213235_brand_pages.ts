import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-sqlite';

/** brand-pages collection + brand-overview + brand-color globals. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_subheading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_subheading_order_idx\` ON \`brand_pages_blocks_subheading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_subheading_parent_id_idx\` ON \`brand_pages_blocks_subheading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_subheading_path_idx\` ON \`brand_pages_blocks_subheading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_paragraph_order_idx\` ON \`brand_pages_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_paragraph_parent_id_idx\` ON \`brand_pages_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_paragraph_path_idx\` ON \`brand_pages_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_list_items_order_idx\` ON \`brand_pages_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_list_items_parent_id_idx\` ON \`brand_pages_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_list_order_idx\` ON \`brand_pages_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_list_parent_id_idx\` ON \`brand_pages_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_list_path_idx\` ON \`brand_pages_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_content_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_blocks_order_idx\` ON \`brand_pages_blocks_content_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_blocks_parent_id_idx\` ON \`brand_pages_blocks_content_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_blocks_path_idx\` ON \`brand_pages_blocks_content_blocks\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_content_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_content_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_accordion_items_order_idx\` ON \`brand_pages_blocks_content_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_accordion_items_parent_id_idx\` ON \`brand_pages_blocks_content_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_content_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_accordion_order_idx\` ON \`brand_pages_blocks_content_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_accordion_parent_id_idx\` ON \`brand_pages_blocks_content_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_content_accordion_path_idx\` ON \`brand_pages_blocks_content_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_typography_scale_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`font_size\` numeric NOT NULL,
  	\`line_height\` numeric NOT NULL,
  	\`letter_spacing\` numeric NOT NULL,
  	\`weight\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_typography_scale_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_groups_rows_order_idx\` ON \`brand_pages_blocks_typography_scale_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_groups_rows_parent_id_idx\` ON \`brand_pages_blocks_typography_scale_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_typography_scale_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group_id\` text NOT NULL,
  	\`title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages_blocks_typography_scale\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_groups_order_idx\` ON \`brand_pages_blocks_typography_scale_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_groups_parent_id_idx\` ON \`brand_pages_blocks_typography_scale_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_typography_scale\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_order_idx\` ON \`brand_pages_blocks_typography_scale\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_parent_id_idx\` ON \`brand_pages_blocks_typography_scale\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_typography_scale_path_idx\` ON \`brand_pages_blocks_typography_scale\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_font_setup\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`desktop_label\` text NOT NULL,
  	\`download_href\` text NOT NULL,
  	\`download_label\` text NOT NULL,
  	\`css_label\` text NOT NULL,
  	\`css_code\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_font_setup_order_idx\` ON \`brand_pages_blocks_font_setup\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_font_setup_parent_id_idx\` ON \`brand_pages_blocks_font_setup\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_font_setup_path_idx\` ON \`brand_pages_blocks_font_setup\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_color_system\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_system_order_idx\` ON \`brand_pages_blocks_color_system\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_system_parent_id_idx\` ON \`brand_pages_blocks_color_system\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_system_path_idx\` ON \`brand_pages_blocks_color_system\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_color_gradients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_gradients_order_idx\` ON \`brand_pages_blocks_color_gradients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_gradients_parent_id_idx\` ON \`brand_pages_blocks_color_gradients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_gradients_path_idx\` ON \`brand_pages_blocks_color_gradients\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages_blocks_color_chart_palette\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_id\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_chart_palette_order_idx\` ON \`brand_pages_blocks_color_chart_palette\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_chart_palette_parent_id_idx\` ON \`brand_pages_blocks_color_chart_palette\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_blocks_color_chart_palette_path_idx\` ON \`brand_pages_blocks_color_chart_palette\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`sort_order\` numeric DEFAULT 0,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`share_title\` text,
  	\`share_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`brand_pages_slug_idx\` ON \`brand_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_updated_at_idx\` ON \`brand_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_pages_created_at_idx\` ON \`brand_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Brand',
  	\`intro\` text DEFAULT 'Бренд-гайдлайны задают узнаваемый визуальный язык: логотипы, иконки, типографика, палитра и принципы оформления.',
  	\`share_title\` text DEFAULT 'Brand',
  	\`share_description\` text DEFAULT 'Бренд-гайдлайны: логотипы, иконки, шрифты, палитра и визуальный стиль.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_hierarchy_base_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`hex\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_base_tokens_order_idx\` ON \`brand_color_hierarchy_base_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_base_tokens_parent_id_idx\` ON \`brand_color_hierarchy_base_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_hierarchy_semantic_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`hex\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_semantic_tokens_order_idx\` ON \`brand_color_hierarchy_semantic_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_semantic_tokens_parent_id_idx\` ON \`brand_color_hierarchy_semantic_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_hierarchy_component_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`hex\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_component_tokens_order_idx\` ON \`brand_color_hierarchy_component_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_component_tokens_parent_id_idx\` ON \`brand_color_hierarchy_component_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_hierarchy_mappings\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_mappings_order_idx\` ON \`brand_color_hierarchy_mappings\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_hierarchy_mappings_parent_id_idx\` ON \`brand_color_hierarchy_mappings\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_semantics_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color_semantics_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_sections_items_order_idx\` ON \`brand_color_semantics_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_sections_items_parent_id_idx\` ON \`brand_color_semantics_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_semantics_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`body\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_sections_order_idx\` ON \`brand_color_semantics_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_sections_parent_id_idx\` ON \`brand_color_semantics_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_semantics_naming_parts_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color_semantics_naming_parts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_naming_parts_examples_order_idx\` ON \`brand_color_semantics_naming_parts_examples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_naming_parts_examples_parent_id_idx\` ON \`brand_color_semantics_naming_parts_examples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_semantics_naming_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`part\` text NOT NULL,
  	\`required\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_naming_parts_order_idx\` ON \`brand_color_semantics_naming_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_naming_parts_parent_id_idx\` ON \`brand_color_semantics_naming_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_semantics_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`token\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_examples_order_idx\` ON \`brand_color_semantics_examples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_semantics_examples_parent_id_idx\` ON \`brand_color_semantics_examples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_component_tokens_intro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_intro_order_idx\` ON \`brand_color_component_tokens_intro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_intro_parent_id_idx\` ON \`brand_color_component_tokens_intro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_component_tokens_naming_parts_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color_component_tokens_naming_parts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_naming_parts_examples_order_idx\` ON \`brand_color_component_tokens_naming_parts_examples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_naming_parts_examples_parent_id_idx\` ON \`brand_color_component_tokens_naming_parts_examples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_component_tokens_naming_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`part\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_naming_parts_order_idx\` ON \`brand_color_component_tokens_naming_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_naming_parts_parent_id_idx\` ON \`brand_color_component_tokens_naming_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_component_tokens_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`token\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_examples_order_idx\` ON \`brand_color_component_tokens_examples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_component_tokens_examples_parent_id_idx\` ON \`brand_color_component_tokens_examples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_gradients_stops\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex\` text NOT NULL,
  	\`rgb\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color_gradients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_gradients_stops_order_idx\` ON \`brand_color_gradients_stops\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_gradients_stops_parent_id_idx\` ON \`brand_color_gradients_stops\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_gradients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`gradient_id\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`angle\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_gradients_order_idx\` ON \`brand_color_gradients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_gradients_parent_id_idx\` ON \`brand_color_gradients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_chart_palette_light\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex\` text NOT NULL,
  	\`rgb\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_chart_palette_light_order_idx\` ON \`brand_color_chart_palette_light\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_chart_palette_light_parent_id_idx\` ON \`brand_color_chart_palette_light\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color_chart_palette_dark\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex\` text NOT NULL,
  	\`rgb\` text NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`brand_color\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_chart_palette_dark_order_idx\` ON \`brand_color_chart_palette_dark\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`brand_color_chart_palette_dark_parent_id_idx\` ON \`brand_color_chart_palette_dark\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`brand_color\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hierarchy_base_title\` text NOT NULL,
  	\`hierarchy_base_description\` text NOT NULL,
  	\`hierarchy_semantic_title\` text NOT NULL,
  	\`hierarchy_semantic_description\` text NOT NULL,
  	\`hierarchy_component_title\` text NOT NULL,
  	\`hierarchy_component_description\` text NOT NULL,
  	\`chart_palette_light_label\` text DEFAULT 'Светлая тема',
  	\`chart_palette_dark_label\` text DEFAULT 'Тёмная тема',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  for (const stmt of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_pages_find\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_pages_create\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_pages_update\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_pages_delete\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_overview_find\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_overview_update\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_color_find\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`brand_color_update\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`brand_pages_id\` integer REFERENCES brand_pages(id)`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* column already exists */
    }
  }

  try {
    await db.run(
      sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_brand_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`brand_pages_id\`)`,
    );
  } catch {
    /* index already exists or column missing */
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: отkат вручную при необходимости. */
}
