import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`order\`;`)
  await db.run(sql`ALTER TABLE \`service_categories\` DROP COLUMN \`order\`;`)
  await db.run(sql`ALTER TABLE \`subscriptions\` DROP COLUMN \`order\`;`)
  await db.run(sql`ALTER TABLE \`faqs\` DROP COLUMN \`order\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`order\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`services\` ADD \`order\` numeric DEFAULT 100;`)
  await db.run(sql`ALTER TABLE \`service_categories\` ADD \`order\` numeric DEFAULT 100;`)
  await db.run(sql`ALTER TABLE \`subscriptions\` ADD \`order\` numeric DEFAULT 100;`)
  await db.run(sql`ALTER TABLE \`faqs\` ADD \`order\` numeric DEFAULT 100;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`order\` numeric DEFAULT 100;`)
}
