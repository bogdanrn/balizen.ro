import * as migration_20260831_165244_initial from './20260831_165244_initial';

export const migrations = [
  {
    up: migration_20260831_165244_initial.up,
    down: migration_20260831_165244_initial.down,
    name: '20260831_165244_initial'
  },
];
