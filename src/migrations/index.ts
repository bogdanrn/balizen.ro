import * as migration_20260830_180040_initial from './20260830_180040_initial';
import * as migration_20260830_234824_add_orderable_index from './20260830_234824_add_orderable_index';
import * as migration_20260830_235552_drop_legacy_order_field from './20260830_235552_drop_legacy_order_field';

export const migrations = [
  {
    up: migration_20260830_180040_initial.up,
    down: migration_20260830_180040_initial.down,
    name: '20260830_180040_initial',
  },
  {
    up: migration_20260830_234824_add_orderable_index.up,
    down: migration_20260830_234824_add_orderable_index.down,
    name: '20260830_234824_add_orderable_index',
  },
  {
    up: migration_20260830_235552_drop_legacy_order_field.up,
    down: migration_20260830_235552_drop_legacy_order_field.down,
    name: '20260830_235552_drop_legacy_order_field'
  },
];
