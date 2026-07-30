import * as migration_20260503_172439_initial from './20260503_172439_initial';
import * as migration_20260503_225628_add_components_colors_icons_globals from './20260503_225628_add_components_colors_icons_globals';
import * as migration_20260609_134127_documentation_blocks from './20260609_134127_documentation_blocks';
import * as migration_20260610_120000_component_related_previews from './20260610_120000_component_related_previews';
import * as migration_20260610_150000_design_checklist_items from './20260610_150000_design_checklist_items';
import * as migration_20260610_150100_design_checklist_locked_docs_rels from './20260610_150100_design_checklist_locked_docs_rels';
import * as migration_20260610_150200_fix_components_design_checklist_schema from './20260610_150200_fix_components_design_checklist_schema';
import * as migration_20260616_120000_portal_seo_global from './20260616_120000_portal_seo_global';
import * as migration_20260617_120000_text_glossary from './20260617_120000_text_glossary';
import * as migration_20260618_120000_glossary_letter from './20260618_120000_glossary_letter';
import * as migration_20260618_213235_brand_pages from './20260618_213235_brand_pages';
import * as migration_20260619_120000_glossary_drop_sort_order from './20260619_120000_glossary_drop_sort_order';
import * as migration_20260619_140000_brand_figure_logo_blocks from './20260619_140000_brand_figure_logo_blocks';
import * as migration_20260622_120000_brand_color_to_brand_pages from './20260622_120000_brand_color_to_brand_pages';
import * as migration_20260623_120000_ds_overview from './20260623_120000_ds_overview';
import * as migration_20260626_120000_compose_mcp_tools from './20260626_120000_compose_mcp_tools';
import * as migration_20260626_140000_figma_compose_mcp_tools from './20260626_140000_figma_compose_mcp_tools';
import * as migration_20260626_160000_compose_from_figma_context_tool from './20260626_160000_compose_from_figma_context_tool';
import * as migration_20260626_180000_compose_ui_intent_tools from './20260626_180000_compose_ui_intent_tools';
import * as migration_20260630_130000_repair_compose_mcp_tool_columns from './20260630_130000_repair_compose_mcp_tool_columns';
import * as migration_20260630_150000_ds_overview_getting_started from './20260630_150000_ds_overview_getting_started';
import * as migration_20260630_160000_seed_ds_overview_guidance from './20260630_160000_seed_ds_overview_guidance';
import * as migration_20260630_170000_rename_mcp_server_in_ds_guidance from './20260630_170000_rename_mcp_server_in_ds_guidance';
import * as migration_20260701_120000_modal_do_dont_guidelines from './20260701_120000_modal_do_dont_guidelines';
import * as migration_20260702_120000_ds_layout_guide from './20260702_120000_ds_layout_guide';
import * as migration_20260703_120000_button_do_dont_guidelines from './20260703_120000_button_do_dont_guidelines';
import * as migration_20260710_092152_ds_pages_nested_tree from './20260710_092152_ds_pages_nested_tree';
import * as migration_20260713_072209_portal_search_plugin from './20260713_072209_portal_search_plugin';
import * as migration_20260713_105900_search_text_normalized from './20260713_105900_search_text_normalized';

export const migrations = [
  {
    up: migration_20260503_172439_initial.up,
    down: migration_20260503_172439_initial.down,
    name: '20260503_172439_initial',
  },
  {
    up: migration_20260503_225628_add_components_colors_icons_globals.up,
    down: migration_20260503_225628_add_components_colors_icons_globals.down,
    name: '20260503_225628_add_components_colors_icons_globals',
  },
  {
    up: migration_20260609_134127_documentation_blocks.up,
    down: migration_20260609_134127_documentation_blocks.down,
    name: '20260609_134127_documentation_blocks',
  },
  {
    up: migration_20260610_120000_component_related_previews.up,
    down: migration_20260610_120000_component_related_previews.down,
    name: '20260610_120000_component_related_previews',
  },
  {
    up: migration_20260610_150000_design_checklist_items.up,
    down: migration_20260610_150000_design_checklist_items.down,
    name: '20260610_150000_design_checklist_items',
  },
  {
    up: migration_20260610_150100_design_checklist_locked_docs_rels.up,
    down: migration_20260610_150100_design_checklist_locked_docs_rels.down,
    name: '20260610_150100_design_checklist_locked_docs_rels',
  },
  {
    up: migration_20260610_150200_fix_components_design_checklist_schema.up,
    down: migration_20260610_150200_fix_components_design_checklist_schema.down,
    name: '20260610_150200_fix_components_design_checklist_schema',
  },
  {
    up: migration_20260616_120000_portal_seo_global.up,
    down: migration_20260616_120000_portal_seo_global.down,
    name: '20260616_120000_portal_seo_global',
  },
  {
    up: migration_20260617_120000_text_glossary.up,
    down: migration_20260617_120000_text_glossary.down,
    name: '20260617_120000_text_glossary',
  },
  {
    up: migration_20260618_120000_glossary_letter.up,
    down: migration_20260618_120000_glossary_letter.down,
    name: '20260618_120000_glossary_letter',
  },
  {
    up: migration_20260618_213235_brand_pages.up,
    down: migration_20260618_213235_brand_pages.down,
    name: '20260618_213235_brand_pages',
  },
  {
    up: migration_20260619_120000_glossary_drop_sort_order.up,
    down: migration_20260619_120000_glossary_drop_sort_order.down,
    name: '20260619_120000_glossary_drop_sort_order',
  },
  {
    up: migration_20260619_140000_brand_figure_logo_blocks.up,
    down: migration_20260619_140000_brand_figure_logo_blocks.down,
    name: '20260619_140000_brand_figure_logo_blocks',
  },
  {
    up: migration_20260622_120000_brand_color_to_brand_pages.up,
    down: migration_20260622_120000_brand_color_to_brand_pages.down,
    name: '20260622_120000_brand_color_to_brand_pages',
  },
  {
    up: migration_20260623_120000_ds_overview.up,
    down: migration_20260623_120000_ds_overview.down,
    name: '20260623_120000_ds_overview',
  },
  {
    up: migration_20260626_120000_compose_mcp_tools.up,
    down: migration_20260626_120000_compose_mcp_tools.down,
    name: '20260626_120000_compose_mcp_tools',
  },
  {
    up: migration_20260626_140000_figma_compose_mcp_tools.up,
    down: migration_20260626_140000_figma_compose_mcp_tools.down,
    name: '20260626_140000_figma_compose_mcp_tools',
  },
  {
    up: migration_20260626_160000_compose_from_figma_context_tool.up,
    down: migration_20260626_160000_compose_from_figma_context_tool.down,
    name: '20260626_160000_compose_from_figma_context_tool',
  },
  {
    up: migration_20260626_180000_compose_ui_intent_tools.up,
    down: migration_20260626_180000_compose_ui_intent_tools.down,
    name: '20260626_180000_compose_ui_intent_tools',
  },
  {
    up: migration_20260630_130000_repair_compose_mcp_tool_columns.up,
    down: migration_20260630_130000_repair_compose_mcp_tool_columns.down,
    name: '20260630_130000_repair_compose_mcp_tool_columns',
  },
  {
    up: migration_20260630_150000_ds_overview_getting_started.up,
    down: migration_20260630_150000_ds_overview_getting_started.down,
    name: '20260630_150000_ds_overview_getting_started',
  },
  {
    up: migration_20260630_160000_seed_ds_overview_guidance.up,
    down: migration_20260630_160000_seed_ds_overview_guidance.down,
    name: '20260630_160000_seed_ds_overview_guidance',
  },
  {
    up: migration_20260630_170000_rename_mcp_server_in_ds_guidance.up,
    down: migration_20260630_170000_rename_mcp_server_in_ds_guidance.down,
    name: '20260630_170000_rename_mcp_server_in_ds_guidance',
  },
  {
    up: migration_20260701_120000_modal_do_dont_guidelines.up,
    down: migration_20260701_120000_modal_do_dont_guidelines.down,
    name: '20260701_120000_modal_do_dont_guidelines',
  },
  {
    up: migration_20260702_120000_ds_layout_guide.up,
    down: migration_20260702_120000_ds_layout_guide.down,
    name: '20260702_120000_ds_layout_guide',
  },
  {
    up: migration_20260703_120000_button_do_dont_guidelines.up,
    down: migration_20260703_120000_button_do_dont_guidelines.down,
    name: '20260703_120000_button_do_dont_guidelines',
  },
  {
    up: migration_20260710_092152_ds_pages_nested_tree.up,
    down: migration_20260710_092152_ds_pages_nested_tree.down,
    name: '20260710_092152_ds_pages_nested_tree',
  },
  {
    up: migration_20260713_072209_portal_search_plugin.up,
    down: migration_20260713_072209_portal_search_plugin.down,
    name: '20260713_072209_portal_search_plugin'
  },
  {
    up: migration_20260713_105900_search_text_normalized.up,
    down: migration_20260713_105900_search_text_normalized.down,
    name: '20260713_105900_search_text_normalized',
  },
];
