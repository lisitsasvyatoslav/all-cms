import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_section_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`accent_color\` text,
  	\`label_as_badge\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_section_items_order_idx\` ON \`components_blocks_section_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_section_items_parent_id_idx\` ON \`components_blocks_section_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text NOT NULL,
  	\`body\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_section_order_idx\` ON \`components_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_section_parent_id_idx\` ON \`components_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_section_path_idx\` ON \`components_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_props_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`default_value\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_props_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_props_table_rows_order_idx\` ON \`components_blocks_props_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_props_table_rows_parent_id_idx\` ON \`components_blocks_props_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_props_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'API Reference',
  	\`subtitle\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_props_table_order_idx\` ON \`components_blocks_props_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_props_table_parent_id_idx\` ON \`components_blocks_props_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_props_table_path_idx\` ON \`components_blocks_props_table\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_storybook_embed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Превью' NOT NULL,
  	\`storybook_url\` text NOT NULL,
  	\`frame_height\` numeric DEFAULT 280,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_storybook_embed_order_idx\` ON \`components_blocks_storybook_embed\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_storybook_embed_parent_id_idx\` ON \`components_blocks_storybook_embed\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_storybook_embed_path_idx\` ON \`components_blocks_storybook_embed\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_code_example\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text,
  	\`preview_storybook_url\` text,
  	\`preview_height\` numeric DEFAULT 200,
  	\`code\` text NOT NULL,
  	\`default_collapsed\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_code_example_order_idx\` ON \`components_blocks_code_example\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_code_example_parent_id_idx\` ON \`components_blocks_code_example\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_code_example_path_idx\` ON \`components_blocks_code_example\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_do_dont_dos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_dos_order_idx\` ON \`components_blocks_do_dont_dos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_dos_parent_id_idx\` ON \`components_blocks_do_dont_dos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_dos_image_idx\` ON \`components_blocks_do_dont_dos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_do_dont_donts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_donts_order_idx\` ON \`components_blocks_do_dont_donts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_donts_parent_id_idx\` ON \`components_blocks_do_dont_donts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_donts_image_idx\` ON \`components_blocks_do_dont_donts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_do_dont\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text,
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_order_idx\` ON \`components_blocks_do_dont\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_parent_id_idx\` ON \`components_blocks_do_dont\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_do_dont_path_idx\` ON \`components_blocks_do_dont\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_accessibility_keyboard_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keys\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_accessibility\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_accessibility_keyboard_rows_order_idx\` ON \`components_blocks_accessibility_keyboard_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_accessibility_keyboard_rows_parent_id_idx\` ON \`components_blocks_accessibility_keyboard_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_accessibility\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`intro\` text,
  	\`pattern_link_label\` text,
  	\`pattern_link_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_accessibility_order_idx\` ON \`components_blocks_accessibility\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_accessibility_parent_id_idx\` ON \`components_blocks_accessibility\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_accessibility_path_idx\` ON \`components_blocks_accessibility\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_rel_components\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Related Components',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_rel_components_order_idx\` ON \`components_blocks_rel_components\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_rel_components_parent_id_idx\` ON \`components_blocks_rel_components\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_rel_components_path_idx\` ON \`components_blocks_rel_components\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_design_tokens_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`value_type\` text DEFAULT 'string',
  	\`default_value\` text,
  	\`swatch_color\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_design_tokens_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_groups_rows_order_idx\` ON \`components_blocks_design_tokens_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_groups_rows_parent_id_idx\` ON \`components_blocks_design_tokens_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_design_tokens_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group_title\` text NOT NULL,
  	\`help_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_design_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_groups_order_idx\` ON \`components_blocks_design_tokens_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_groups_parent_id_idx\` ON \`components_blocks_design_tokens_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_design_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design Token',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_order_idx\` ON \`components_blocks_design_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_parent_id_idx\` ON \`components_blocks_design_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_design_tokens_path_idx\` ON \`components_blocks_design_tokens\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_changelog_entries_changes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_changelog_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_entries_changes_order_idx\` ON \`components_blocks_changelog_entries_changes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_entries_changes_parent_id_idx\` ON \`components_blocks_changelog_entries_changes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_changelog_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`version\` text NOT NULL,
  	\`kind\` text DEFAULT 'patch',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_changelog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_entries_order_idx\` ON \`components_blocks_changelog_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_entries_parent_id_idx\` ON \`components_blocks_changelog_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_changelog\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_order_idx\` ON \`components_blocks_changelog\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_parent_id_idx\` ON \`components_blocks_changelog\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_changelog_path_idx\` ON \`components_blocks_changelog\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_anatomy_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_anatomy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_anatomy_parts_order_idx\` ON \`components_blocks_anatomy_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_anatomy_parts_parent_id_idx\` ON \`components_blocks_anatomy_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_anatomy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Anatomy',
  	\`image_id\` integer NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_anatomy_order_idx\` ON \`components_blocks_anatomy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_anatomy_parent_id_idx\` ON \`components_blocks_anatomy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_anatomy_path_idx\` ON \`components_blocks_anatomy\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_anatomy_image_idx\` ON \`components_blocks_anatomy\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_checklist_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`done\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_checklist_items_order_idx\` ON \`components_blocks_checklist_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_checklist_items_parent_id_idx\` ON \`components_blocks_checklist_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design checklist',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_checklist_order_idx\` ON \`components_blocks_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_checklist_parent_id_idx\` ON \`components_blocks_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_checklist_path_idx\` ON \`components_blocks_checklist\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_resource_links_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_resource_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_resource_links_links_order_idx\` ON \`components_blocks_resource_links_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_resource_links_links_parent_id_idx\` ON \`components_blocks_resource_links_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_resource_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_resource_links_order_idx\` ON \`components_blocks_resource_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_resource_links_parent_id_idx\` ON \`components_blocks_resource_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_resource_links_path_idx\` ON \`components_blocks_resource_links\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_motion_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`value\` text NOT NULL,
  	\`duration_ms\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components_blocks_motion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_motion_tokens_order_idx\` ON \`components_blocks_motion_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_motion_tokens_parent_id_idx\` ON \`components_blocks_motion_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_blocks_motion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Motion',
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_motion_order_idx\` ON \`components_blocks_motion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_motion_parent_id_idx\` ON \`components_blocks_motion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_blocks_motion_path_idx\` ON \`components_blocks_motion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`components_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`components_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`components_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_rels_order_idx\` ON \`components_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_rels_parent_idx\` ON \`components_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_rels_path_idx\` ON \`components_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_rels_components_id_idx\` ON \`components_rels\` (\`components_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_section_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`accent_color\` text,
  	\`label_as_badge\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_section_items_order_idx\` ON \`colors_blocks_section_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_section_items_parent_id_idx\` ON \`colors_blocks_section_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text NOT NULL,
  	\`body\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_section_order_idx\` ON \`colors_blocks_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_section_parent_id_idx\` ON \`colors_blocks_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_section_path_idx\` ON \`colors_blocks_section\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_do_dont_dos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_dos_order_idx\` ON \`colors_blocks_do_dont_dos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_dos_parent_id_idx\` ON \`colors_blocks_do_dont_dos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_dos_image_idx\` ON \`colors_blocks_do_dont_dos\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_do_dont_donts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_do_dont\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_donts_order_idx\` ON \`colors_blocks_do_dont_donts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_donts_parent_id_idx\` ON \`colors_blocks_do_dont_donts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_donts_image_idx\` ON \`colors_blocks_do_dont_donts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_do_dont\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`heading\` text,
  	\`intro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_order_idx\` ON \`colors_blocks_do_dont\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_parent_id_idx\` ON \`colors_blocks_do_dont\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_do_dont_path_idx\` ON \`colors_blocks_do_dont\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_code_example\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text,
  	\`preview_storybook_url\` text,
  	\`preview_height\` numeric DEFAULT 200,
  	\`code\` text NOT NULL,
  	\`default_collapsed\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_code_example_order_idx\` ON \`colors_blocks_code_example\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_code_example_parent_id_idx\` ON \`colors_blocks_code_example\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_code_example_path_idx\` ON \`colors_blocks_code_example\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_resource_links_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_resource_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_resource_links_links_order_idx\` ON \`colors_blocks_resource_links_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_resource_links_links_parent_id_idx\` ON \`colors_blocks_resource_links_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_resource_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_resource_links_order_idx\` ON \`colors_blocks_resource_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_resource_links_parent_id_idx\` ON \`colors_blocks_resource_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_resource_links_path_idx\` ON \`colors_blocks_resource_links\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_design_tokens_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`value_type\` text DEFAULT 'string',
  	\`default_value\` text,
  	\`swatch_color\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_design_tokens_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_groups_rows_order_idx\` ON \`colors_blocks_design_tokens_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_groups_rows_parent_id_idx\` ON \`colors_blocks_design_tokens_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_design_tokens_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group_title\` text NOT NULL,
  	\`help_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_design_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_groups_order_idx\` ON \`colors_blocks_design_tokens_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_groups_parent_id_idx\` ON \`colors_blocks_design_tokens_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_design_tokens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'Design Token',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_order_idx\` ON \`colors_blocks_design_tokens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_parent_id_idx\` ON \`colors_blocks_design_tokens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_design_tokens_path_idx\` ON \`colors_blocks_design_tokens\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_props_table_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`default_value\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors_blocks_props_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_props_table_rows_order_idx\` ON \`colors_blocks_props_table_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_props_table_rows_parent_id_idx\` ON \`colors_blocks_props_table_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`colors_blocks_props_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_l_l_m\` integer DEFAULT true,
  	\`title\` text DEFAULT 'API Reference',
  	\`subtitle\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_props_table_order_idx\` ON \`colors_blocks_props_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_props_table_parent_id_idx\` ON \`colors_blocks_props_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`colors_blocks_props_table_path_idx\` ON \`colors_blocks_props_table\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`field_showcase_demo_select\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`field_showcase\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_demo_select_order_idx\` ON \`field_showcase_demo_select\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_demo_select_parent_idx\` ON \`field_showcase_demo_select\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`field_showcase_demo_array\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`count\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`field_showcase\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_demo_array_order_idx\` ON \`field_showcase_demo_array\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_demo_array_parent_id_idx\` ON \`field_showcase_demo_array\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`field_showcase_blocks_line\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`value\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`field_showcase\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_blocks_line_order_idx\` ON \`field_showcase_blocks_line\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_blocks_line_parent_id_idx\` ON \`field_showcase_blocks_line\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_blocks_line_path_idx\` ON \`field_showcase_blocks_line\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`field_showcase_blocks_tag\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`field_showcase\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_blocks_tag_order_idx\` ON \`field_showcase_blocks_tag\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_blocks_tag_parent_id_idx\` ON \`field_showcase_blocks_tag\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_blocks_tag_path_idx\` ON \`field_showcase_blocks_tag\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`field_showcase\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Все типы полей Payload (Data Fields)' NOT NULL,
  	\`demo_text\` text,
  	\`demo_textarea\` text,
  	\`demo_number\` numeric,
  	\`demo_checkbox\` integer DEFAULT false,
  	\`demo_email\` text,
  	\`demo_date\` text,
  	\`demo_radio\` text DEFAULT 'a',
  	\`demo_code\` text,
  	\`demo_json\` text DEFAULT '{"example":true,"note":"редактор JSON в админке"}',
  	\`demo_point\` text,
  	\`demo_rich_text\` text,
  	\`demo_relationship_id\` integer,
  	\`demo_upload_id\` integer,
  	\`demo_group_group_title\` text,
  	\`demo_group_group_note\` text,
  	\`tab_meta_meta_slug\` text,
  	\`tab_metrics_score\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`demo_relationship_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`demo_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_demo_relationship_idx\` ON \`field_showcase\` (\`demo_relationship_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_demo_upload_idx\` ON \`field_showcase\` (\`demo_upload_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_updated_at_idx\` ON \`field_showcase\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`field_showcase_created_at_idx\` ON \`field_showcase\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_mcp_api_keys\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`label\` text,
  	\`description\` text,
  	\`colors_find\` integer DEFAULT false,
  	\`colors_create\` integer DEFAULT false,
  	\`colors_update\` integer DEFAULT false,
  	\`icons_find\` integer DEFAULT false,
  	\`icons_create\` integer DEFAULT false,
  	\`icons_update\` integer DEFAULT false,
  	\`media_find\` integer DEFAULT false,
  	\`media_create\` integer DEFAULT false,
  	\`media_update\` integer DEFAULT false,
  	\`notes_find\` integer DEFAULT false,
  	\`notes_create\` integer DEFAULT false,
  	\`notes_update\` integer DEFAULT false,
  	\`portal_sources_find\` integer DEFAULT false,
  	\`portal_sources_update\` integer DEFAULT false,
  	\`payload_mcp_tool_get_component\` integer DEFAULT true,
  	\`payload_mcp_tool_list_components\` integer DEFAULT true,
  	\`payload_mcp_tool_list_components_full\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`enable_a_p_i_key\` integer,
  	\`api_key\` text,
  	\`api_key_index\` text,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_mcp_api_keys_user_idx\` ON \`payload_mcp_api_keys\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_mcp_api_keys_updated_at_idx\` ON \`payload_mcp_api_keys\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_mcp_api_keys_created_at_idx\` ON \`payload_mcp_api_keys\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_folders_folder_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_folder_type_order_idx\` ON \`payload_folders_folder_type\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_folder_type_parent_idx\` ON \`payload_folders_folder_type\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_folders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`folder_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`folder_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_name_idx\` ON \`payload_folders\` (\`name\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_folder_idx\` ON \`payload_folders\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_updated_at_idx\` ON \`payload_folders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_created_at_idx\` ON \`payload_folders\` (\`created_at\`);`)
  for (const stmt of [
    sql`ALTER TABLE \`users\` ADD \`first_name\` text NOT NULL;`,
    sql`ALTER TABLE \`users\` ADD \`last_name\` text NOT NULL;`,
    sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'viewer' NOT NULL;`,
    sql`ALTER TABLE \`components\` ADD \`status\` text DEFAULT 'stable';`,
    sql`ALTER TABLE \`components\` ADD \`status_note\` text;`,
    sql`ALTER TABLE \`components\` ADD \`parent_component_id\` integer REFERENCES components(id);`,
    sql`ALTER TABLE \`components\` ADD \`replaced_by_id\` integer REFERENCES components(id);`,
    sql`ALTER TABLE \`components\` ADD \`show_t_o_c\` integer DEFAULT true;`,
    sql`ALTER TABLE \`components\` ADD \`folder_id\` integer REFERENCES payload_folders(id);`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`field_showcase_id\` integer REFERENCES field_showcase(id);`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`payload_mcp_api_keys_id\` integer REFERENCES payload_mcp_api_keys(id);`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`payload_folders_id\` integer REFERENCES payload_folders(id);`,
    sql`ALTER TABLE \`payload_preferences_rels\` ADD \`payload_mcp_api_keys_id\` integer REFERENCES payload_mcp_api_keys(id);`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже добавлена push-режимом или повторным прогоном */
    }
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_parent_component_idx\` ON \`components\` (\`parent_component_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_replaced_by_idx\` ON \`components\` (\`replaced_by_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_folder_idx\` ON \`components\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_field_showcase_id_idx\` ON \`payload_locked_documents_rels\` (\`field_showcase_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_payload_mcp_api_keys_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_mcp_api_keys_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_payload_mcp_api_keys_id_idx\` ON \`payload_preferences_rels\` (\`payload_mcp_api_keys_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`components_blocks_section_items\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_section\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_props_table_rows\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_props_table\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_storybook_embed\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_code_example\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_do_dont_dos\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_do_dont_donts\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_do_dont\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_accessibility_keyboard_rows\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_accessibility\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_rel_components\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_design_tokens_groups_rows\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_design_tokens_groups\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_design_tokens\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_changelog_entries_changes\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_changelog_entries\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_changelog\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_anatomy_parts\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_anatomy\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_checklist_items\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_checklist\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_resource_links_links\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_resource_links\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_motion_tokens\`;`)
  await db.run(sql`DROP TABLE \`components_blocks_motion\`;`)
  await db.run(sql`DROP TABLE \`components_rels\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_section_items\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_section\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_do_dont_dos\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_do_dont_donts\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_do_dont\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_code_example\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_resource_links_links\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_resource_links\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_design_tokens_groups_rows\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_design_tokens_groups\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_design_tokens\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_props_table_rows\`;`)
  await db.run(sql`DROP TABLE \`colors_blocks_props_table\`;`)
  await db.run(sql`DROP TABLE \`field_showcase_demo_select\`;`)
  await db.run(sql`DROP TABLE \`field_showcase_demo_array\`;`)
  await db.run(sql`DROP TABLE \`field_showcase_blocks_line\`;`)
  await db.run(sql`DROP TABLE \`field_showcase_blocks_tag\`;`)
  await db.run(sql`DROP TABLE \`field_showcase\`;`)
  await db.run(sql`DROP TABLE \`payload_mcp_api_keys\`;`)
  await db.run(sql`DROP TABLE \`payload_folders_folder_type\`;`)
  await db.run(sql`DROP TABLE \`payload_folders\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`__new_components\` (
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
  `)
  await db.run(sql`INSERT INTO \`__new_components\`("id", "name", "slug", "description", "figma_url", "storybook_url", "docs_url", "updated_at", "created_at") SELECT "id", "name", "slug", "description", "figma_url", "storybook_url", "docs_url", "updated_at", "created_at" FROM \`components\`;`)
  await db.run(sql`DROP TABLE \`components\`;`)
  await db.run(sql`ALTER TABLE \`__new_components\` RENAME TO \`components\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`components_slug_idx\` ON \`components\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_updated_at_idx\` ON \`components\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`components_created_at_idx\` ON \`components\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`components_id\` integer,
  	\`colors_id\` integer,
  	\`icons_id\` integer,
  	\`notes_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`components_id\`) REFERENCES \`components\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`colors_id\`) REFERENCES \`colors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`icons_id\`) REFERENCES \`icons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notes_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "components_id", "colors_id", "icons_id", "notes_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "components_id", "colors_id", "icons_id", "notes_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_components_id_idx\` ON \`payload_locked_documents_rels\` (\`components_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_colors_id_idx\` ON \`payload_locked_documents_rels\` (\`colors_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_icons_id_idx\` ON \`payload_locked_documents_rels\` (\`icons_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`__new_payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_preferences_rels\`("id", "order", "parent_id", "path", "users_id") SELECT "id", "order", "parent_id", "path", "users_id" FROM \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_preferences_rels\` RENAME TO \`payload_preferences_rels\`;`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`first_name\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`last_name\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
