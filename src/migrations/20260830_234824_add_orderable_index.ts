import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { generateNKeysBetween } from 'payload/shared'

// Collections that moved from a manual numeric `order` field to Payload's
// native drag-and-drop ordering (`orderable: true`), which stores a fractional
// index in a hidden `_order` text column.
const ORDERABLE_TABLES = ['service_categories', 'services', 'faqs', 'subscriptions', 'locations']

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`service_categories\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`service_categories__order_idx\` ON \`service_categories\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`services\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`services__order_idx\` ON \`services\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`faqs\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`faqs__order_idx\` ON \`faqs\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`subscriptions\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`subscriptions__order_idx\` ON \`subscriptions\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`locations__order_idx\` ON \`locations\` (\`_order\`);`)

  // Backfill: without this, every existing row has a NULL `_order` and both the
  // admin list and the public site fall back to an arbitrary order. Rank rows
  // by the legacy `order` value (id breaks ties) and hand out fractional-index
  // keys in that same sequence, so the site keeps the order it has today.
  for (const table of ORDERABLE_TABLES) {
    const result = await db.run(
      sql.raw(`SELECT id FROM \`${table}\` ORDER BY COALESCE(\`order\`, 1000000) ASC, id ASC`),
    )

    const ids = extractIds(result)
    if (ids.length === 0) continue

    const keys = generateNKeysBetween(null, null, ids.length)

    for (let i = 0; i < ids.length; i++) {
      await db.run(sql.raw(`UPDATE \`${table}\` SET \`_order\` = '${keys[i]}' WHERE id = ${ids[i]}`))
    }

    payload.logger.info(`orderable backfill: ${table} — ${ids.length} rows`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`services__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`service_categories__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`service_categories\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`subscriptions__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`subscriptions\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`faqs__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`faqs\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`locations__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`_order\`;`)
}

// The D1 driver returns `{ rows }` (arrays) in some paths and `{ results }`
// (objects) in others, so read both shapes.
function extractIds(result: unknown): number[] {
  const raw =
    (result as { results?: unknown[]; rows?: unknown[] })?.rows ??
    (result as { results?: unknown[] })?.results ??
    []

  return raw
    .map((row) => (Array.isArray(row) ? row[0] : (row as { id?: unknown })?.id))
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id))
}
