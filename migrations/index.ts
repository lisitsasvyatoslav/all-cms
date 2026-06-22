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
];
