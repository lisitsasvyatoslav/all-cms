import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/** ds-pages collection + nested docs + versions. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_section_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`description\` text,
  	\`accent_color\` text,
  	\`label_as_badge\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_section_items_order_idx\` ON \`ds_pages_blocks_section_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_section_items_parent_id_idx\` ON \`ds_pages_blocks_section_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text,
  	\`body\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_section_order_idx\` ON \`ds_pages_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_section_parent_id_idx\` ON \`ds_pages_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_section_path_idx\` ON \`ds_pages_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_props_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`type\` text,
  	\`default_value\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_props_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_props_table_rows_order_idx\` ON \`ds_pages_blocks_props_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_props_table_rows_parent_id_idx\` ON \`ds_pages_blocks_props_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_props_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'API Reference',
  	\`subtitle\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_props_table_order_idx\` ON \`ds_pages_blocks_props_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_props_table_parent_id_idx\` ON \`ds_pages_blocks_props_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_props_table_path_idx\` ON \`ds_pages_blocks_props_table\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_storybook_embed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Превью',
  	\`storybook_url\` text,
  	\`frame_height\` numeric DEFAULT 280,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_storybook_embed_order_idx\` ON \`ds_pages_blocks_storybook_embed\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_storybook_embed_parent_id_idx\` ON \`ds_pages_blocks_storybook_embed\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_storybook_embed_path_idx\` ON \`ds_pages_blocks_storybook_embed\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_code_example\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text,
  	\`preview_storybook_url\` text,
  	\`preview_height\` numeric DEFAULT 200,
  	\`code\` text,
  	\`default_collapsed\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_code_example_order_idx\` ON \`ds_pages_blocks_code_example\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_code_example_parent_id_idx\` ON \`ds_pages_blocks_code_example\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_code_example_path_idx\` ON \`ds_pages_blocks_code_example\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_do_dont_dos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_dos_order_idx\` ON \`ds_pages_blocks_do_dont_dos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_dos_parent_id_idx\` ON \`ds_pages_blocks_do_dont_dos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_dos_image_idx\` ON \`ds_pages_blocks_do_dont_dos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_do_dont_donts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_donts_order_idx\` ON \`ds_pages_blocks_do_dont_donts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_donts_parent_id_idx\` ON \`ds_pages_blocks_do_dont_donts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_donts_image_idx\` ON \`ds_pages_blocks_do_dont_donts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_do_dont\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text,
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_order_idx\` ON \`ds_pages_blocks_do_dont\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_parent_id_idx\` ON \`ds_pages_blocks_do_dont\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_do_dont_path_idx\` ON \`ds_pages_blocks_do_dont\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_accessibility_keyboard_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keys\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_accessibility\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_accessibility_keyboard_rows_order_idx\` ON \`ds_pages_blocks_accessibility_keyboard_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_accessibility_keyboard_rows_parent_id_idx\` ON \`ds_pages_blocks_accessibility_keyboard_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_accessibility\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`intro\` text,
  	\`pattern_link_label\` text,
  	\`pattern_link_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_accessibility_order_idx\` ON \`ds_pages_blocks_accessibility\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_accessibility_parent_id_idx\` ON \`ds_pages_blocks_accessibility\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_accessibility_path_idx\` ON \`ds_pages_blocks_accessibility\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_rel_components\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Related Components',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_rel_components_order_idx\` ON \`ds_pages_blocks_rel_components\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_rel_components_parent_id_idx\` ON \`ds_pages_blocks_rel_components\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_rel_components_path_idx\` ON \`ds_pages_blocks_rel_components\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_design_tokens_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`description\` text,
  	\`value_type\` text DEFAULT 'string',
  	\`default_value\` text,
  	\`swatch_color\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_design_tokens_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_groups_rows_order_idx\` ON \`ds_pages_blocks_design_tokens_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_groups_rows_parent_id_idx\` ON \`ds_pages_blocks_design_tokens_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_design_tokens_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group_title\` text,
  	\`help_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_design_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_groups_order_idx\` ON \`ds_pages_blocks_design_tokens_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_groups_parent_id_idx\` ON \`ds_pages_blocks_design_tokens_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_design_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design Token',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_order_idx\` ON \`ds_pages_blocks_design_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_parent_id_idx\` ON \`ds_pages_blocks_design_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_design_tokens_path_idx\` ON \`ds_pages_blocks_design_tokens\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_changelog_entries_changes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_changelog_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_entries_changes_order_idx\` ON \`ds_pages_blocks_changelog_entries_changes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_entries_changes_parent_id_idx\` ON \`ds_pages_blocks_changelog_entries_changes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_changelog_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`version\` text,
  	\`kind\` text DEFAULT 'patch',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_changelog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_entries_order_idx\` ON \`ds_pages_blocks_changelog_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_entries_parent_id_idx\` ON \`ds_pages_blocks_changelog_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_changelog\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_order_idx\` ON \`ds_pages_blocks_changelog\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_parent_id_idx\` ON \`ds_pages_blocks_changelog\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_changelog_path_idx\` ON \`ds_pages_blocks_changelog\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_anatomy_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_anatomy_parts_order_idx\` ON \`ds_pages_blocks_anatomy_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_anatomy_parts_parent_id_idx\` ON \`ds_pages_blocks_anatomy_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Anatomy',
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_anatomy_order_idx\` ON \`ds_pages_blocks_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_anatomy_parent_id_idx\` ON \`ds_pages_blocks_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_anatomy_path_idx\` ON \`ds_pages_blocks_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_anatomy_image_idx\` ON \`ds_pages_blocks_anatomy\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_checklist_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`done\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_checklist_items_order_idx\` ON \`ds_pages_blocks_checklist_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_checklist_items_parent_id_idx\` ON \`ds_pages_blocks_checklist_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design checklist',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_checklist_order_idx\` ON \`ds_pages_blocks_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_checklist_parent_id_idx\` ON \`ds_pages_blocks_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_checklist_path_idx\` ON \`ds_pages_blocks_checklist\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_resource_links_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_resource_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_resource_links_links_order_idx\` ON \`ds_pages_blocks_resource_links_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_resource_links_links_parent_id_idx\` ON \`ds_pages_blocks_resource_links_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_resource_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_resource_links_order_idx\` ON \`ds_pages_blocks_resource_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_resource_links_parent_id_idx\` ON \`ds_pages_blocks_resource_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_resource_links_path_idx\` ON \`ds_pages_blocks_resource_links\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_motion_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`description\` text,
  	\`value\` text,
  	\`duration_ms\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages_blocks_motion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_motion_tokens_order_idx\` ON \`ds_pages_blocks_motion_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_motion_tokens_parent_id_idx\` ON \`ds_pages_blocks_motion_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_blocks_motion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Motion',
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_motion_order_idx\` ON \`ds_pages_blocks_motion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_motion_parent_id_idx\` ON \`ds_pages_blocks_motion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_blocks_motion_path_idx\` ON \`ds_pages_blocks_motion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`doc_id\` integer,
  	\`url\` text,
  	\`label\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_breadcrumbs_order_idx\` ON \`ds_pages_breadcrumbs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_breadcrumbs_parent_id_idx\` ON \`ds_pages_breadcrumbs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_breadcrumbs_doc_idx\` ON \`ds_pages_breadcrumbs\` (\`doc_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`parent_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages__order_idx\` ON \`ds_pages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_parent_idx\` ON \`ds_pages\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_updated_at_idx\` ON \`ds_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_created_at_idx\` ON \`ds_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages__status_idx\` ON \`ds_pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`components_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`components_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_rels_order_idx\` ON \`ds_pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_rels_parent_idx\` ON \`ds_pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_rels_path_idx\` ON \`ds_pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`ds_pages_rels_components_id_idx\` ON \`ds_pages_rels\` (\`components_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_section_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`description\` text,
  	\`accent_color\` text,
  	\`label_as_badge\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_section_items_order_idx\` ON \`_ds_pages_v_blocks_section_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_section_items_parent_id_idx\` ON \`_ds_pages_v_blocks_section_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_section_order_idx\` ON \`_ds_pages_v_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_section_parent_id_idx\` ON \`_ds_pages_v_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_section_path_idx\` ON \`_ds_pages_v_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_props_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`type\` text,
  	\`default_value\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_props_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_props_table_rows_order_idx\` ON \`_ds_pages_v_blocks_props_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_props_table_rows_parent_id_idx\` ON \`_ds_pages_v_blocks_props_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_props_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'API Reference',
  	\`subtitle\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_props_table_order_idx\` ON \`_ds_pages_v_blocks_props_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_props_table_parent_id_idx\` ON \`_ds_pages_v_blocks_props_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_props_table_path_idx\` ON \`_ds_pages_v_blocks_props_table\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_storybook_embed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Превью',
  	\`storybook_url\` text,
  	\`frame_height\` numeric DEFAULT 280,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_storybook_embed_order_idx\` ON \`_ds_pages_v_blocks_storybook_embed\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_storybook_embed_parent_id_idx\` ON \`_ds_pages_v_blocks_storybook_embed\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_storybook_embed_path_idx\` ON \`_ds_pages_v_blocks_storybook_embed\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_code_example\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text,
  	\`preview_storybook_url\` text,
  	\`preview_height\` numeric DEFAULT 200,
  	\`code\` text,
  	\`default_collapsed\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_code_example_order_idx\` ON \`_ds_pages_v_blocks_code_example\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_code_example_parent_id_idx\` ON \`_ds_pages_v_blocks_code_example\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_code_example_path_idx\` ON \`_ds_pages_v_blocks_code_example\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_dos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_dos_order_idx\` ON \`_ds_pages_v_blocks_do_dont_dos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_dos_parent_id_idx\` ON \`_ds_pages_v_blocks_do_dont_dos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_dos_image_idx\` ON \`_ds_pages_v_blocks_do_dont_dos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_donts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_donts_order_idx\` ON \`_ds_pages_v_blocks_do_dont_donts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_donts_parent_id_idx\` ON \`_ds_pages_v_blocks_do_dont_donts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_donts_image_idx\` ON \`_ds_pages_v_blocks_do_dont_donts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_do_dont\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text,
  	\`intro\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_order_idx\` ON \`_ds_pages_v_blocks_do_dont\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_parent_id_idx\` ON \`_ds_pages_v_blocks_do_dont\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_do_dont_path_idx\` ON \`_ds_pages_v_blocks_do_dont\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_accessibility_keyboard_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`keys\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_accessibility\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_accessibility_keyboard_rows_order_idx\` ON \`_ds_pages_v_blocks_accessibility_keyboard_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_accessibility_keyboard_rows_parent_id_idx\` ON \`_ds_pages_v_blocks_accessibility_keyboard_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_accessibility\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`intro\` text,
  	\`pattern_link_label\` text,
  	\`pattern_link_url\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_accessibility_order_idx\` ON \`_ds_pages_v_blocks_accessibility\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_accessibility_parent_id_idx\` ON \`_ds_pages_v_blocks_accessibility\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_accessibility_path_idx\` ON \`_ds_pages_v_blocks_accessibility\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_rel_components\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Related Components',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_rel_components_order_idx\` ON \`_ds_pages_v_blocks_rel_components\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_rel_components_parent_id_idx\` ON \`_ds_pages_v_blocks_rel_components\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_rel_components_path_idx\` ON \`_ds_pages_v_blocks_rel_components\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`description\` text,
  	\`value_type\` text DEFAULT 'string',
  	\`default_value\` text,
  	\`swatch_color\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_design_tokens_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_groups_rows_order_idx\` ON \`_ds_pages_v_blocks_design_tokens_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_groups_rows_parent_id_idx\` ON \`_ds_pages_v_blocks_design_tokens_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`group_title\` text,
  	\`help_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_design_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_groups_order_idx\` ON \`_ds_pages_v_blocks_design_tokens_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_groups_parent_id_idx\` ON \`_ds_pages_v_blocks_design_tokens_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design Token',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_order_idx\` ON \`_ds_pages_v_blocks_design_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_parent_id_idx\` ON \`_ds_pages_v_blocks_design_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_design_tokens_path_idx\` ON \`_ds_pages_v_blocks_design_tokens\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_changelog_entries_changes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_changelog_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_entries_changes_order_idx\` ON \`_ds_pages_v_blocks_changelog_entries_changes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_entries_changes_parent_id_idx\` ON \`_ds_pages_v_blocks_changelog_entries_changes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_changelog_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version\` text,
  	\`kind\` text DEFAULT 'patch',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_changelog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_entries_order_idx\` ON \`_ds_pages_v_blocks_changelog_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_entries_parent_id_idx\` ON \`_ds_pages_v_blocks_changelog_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_changelog\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_order_idx\` ON \`_ds_pages_v_blocks_changelog\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_parent_id_idx\` ON \`_ds_pages_v_blocks_changelog\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_changelog_path_idx\` ON \`_ds_pages_v_blocks_changelog\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_parts_order_idx\` ON \`_ds_pages_v_blocks_anatomy_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_parts_parent_id_idx\` ON \`_ds_pages_v_blocks_anatomy_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Anatomy',
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_order_idx\` ON \`_ds_pages_v_blocks_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_parent_id_idx\` ON \`_ds_pages_v_blocks_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_path_idx\` ON \`_ds_pages_v_blocks_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_anatomy_image_idx\` ON \`_ds_pages_v_blocks_anatomy\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_checklist_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`done\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_checklist_items_order_idx\` ON \`_ds_pages_v_blocks_checklist_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_checklist_items_parent_id_idx\` ON \`_ds_pages_v_blocks_checklist_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design checklist',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_checklist_order_idx\` ON \`_ds_pages_v_blocks_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_checklist_parent_id_idx\` ON \`_ds_pages_v_blocks_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_checklist_path_idx\` ON \`_ds_pages_v_blocks_checklist\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_resource_links_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_resource_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_resource_links_links_order_idx\` ON \`_ds_pages_v_blocks_resource_links_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_resource_links_links_parent_id_idx\` ON \`_ds_pages_v_blocks_resource_links_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_resource_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_resource_links_order_idx\` ON \`_ds_pages_v_blocks_resource_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_resource_links_parent_id_idx\` ON \`_ds_pages_v_blocks_resource_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_resource_links_path_idx\` ON \`_ds_pages_v_blocks_resource_links\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_motion_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`description\` text,
  	\`value\` text,
  	\`duration_ms\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v_blocks_motion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_motion_tokens_order_idx\` ON \`_ds_pages_v_blocks_motion_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_motion_tokens_parent_id_idx\` ON \`_ds_pages_v_blocks_motion_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_blocks_motion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Motion',
  	\`intro\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_motion_order_idx\` ON \`_ds_pages_v_blocks_motion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_motion_parent_id_idx\` ON \`_ds_pages_v_blocks_motion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_blocks_motion_path_idx\` ON \`_ds_pages_v_blocks_motion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_version_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`doc_id\` integer,
  	\`url\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_breadcrumbs_order_idx\` ON \`_ds_pages_v_version_breadcrumbs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_breadcrumbs_parent_id_idx\` ON \`_ds_pages_v_version_breadcrumbs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_breadcrumbs_doc_idx\` ON \`_ds_pages_v_version_breadcrumbs\` (\`doc_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_parent_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_parent_id\`) REFERENCES \`ds_pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_parent_idx\` ON \`_ds_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_version__order_idx\` ON \`_ds_pages_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_version_parent_idx\` ON \`_ds_pages_v\` (\`version_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_version_updated_at_idx\` ON \`_ds_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_version_created_at_idx\` ON \`_ds_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_version_version__status_idx\` ON \`_ds_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_created_at_idx\` ON \`_ds_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_updated_at_idx\` ON \`_ds_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_latest_idx\` ON \`_ds_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_ds_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`components_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_ds_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`components_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_rels_order_idx\` ON \`_ds_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_rels_parent_idx\` ON \`_ds_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_rels_path_idx\` ON \`_ds_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_ds_pages_v_rels_components_id_idx\` ON \`_ds_pages_v_rels\` (\`components_id\`);`)

  for (const stmt of [
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`ds_pages_find\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`ds_pages_create\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`ds_pages_update\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`ds_pages_delete\` integer DEFAULT false`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ds_pages_id\` integer REFERENCES ds_pages(id)`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      // Existing columns are expected when repairing a partially applied schema.
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally irreversible: preserve editable CMS content.
}
