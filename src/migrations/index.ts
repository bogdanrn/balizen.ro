import * as migration_20260830_180040_initial from './20260830_180040_initial';

export const migrations = [
  {
    up: migration_20260830_180040_initial.up,
    down: migration_20260830_180040_initial.down,
    name: '20260830_180040_initial'
  },
];
