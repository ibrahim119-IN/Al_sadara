import * as migration_20251229_180327 from './20251229_180327';

export const migrations = [
  {
    up: migration_20251229_180327.up,
    down: migration_20251229_180327.down,
    name: '20251229_180327'
  },
];
