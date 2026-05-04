import * as migration_20260503_172439_initial from './20260503_172439_initial';
import * as migration_20260503_225628_add_components_colors_icons_globals from './20260503_225628_add_components_colors_icons_globals';

export const migrations = [
  {
    up: migration_20260503_172439_initial.up,
    down: migration_20260503_172439_initial.down,
    name: '20260503_172439_initial',
  },
  {
    up: migration_20260503_225628_add_components_colors_icons_globals.up,
    down: migration_20260503_225628_add_components_colors_icons_globals.down,
    name: '20260503_225628_add_components_colors_icons_globals'
  },
];
