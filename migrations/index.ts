import * as migration_20260503_172439_initial from './20260503_172439_initial';
import * as migration_20260503_225628_add_components_colors_icons_globals from './20260503_225628_add_components_colors_icons_globals';
import * as migration_20260609_134127_documentation_blocks from './20260609_134127_documentation_blocks';
import * as migration_20260610_120000_component_related_previews from './20260610_120000_component_related_previews';
import * as migration_20260610_150000_design_checklist_items from './20260610_150000_design_checklist_items';
import * as migration_20260610_150100_design_checklist_locked_docs_rels from './20260610_150100_design_checklist_locked_docs_rels';
import * as migration_20260610_150200_fix_components_design_checklist_schema from './20260610_150200_fix_components_design_checklist_schema';

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
    name: '20260609_134127_documentation_blocks'
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
];
