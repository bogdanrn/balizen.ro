import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variants\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`service_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`service_categories_updated_at_idx\` ON \`service_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`service_categories_created_at_idx\` ON \`service_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`service_categories_locales\` (
  	\`name\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`service_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`service_categories_locales_locale_parent_id_unique\` ON \`service_categories_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_pricing\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`duration\` numeric NOT NULL,
  	\`price\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_pricing_order_idx\` ON \`services_pricing\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_pricing_parent_id_idx\` ON \`services_pricing\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`image_id\` integer,
  	\`order\` numeric DEFAULT 100,
  	\`modified_date\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`service_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`services_category_idx\` ON \`services\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`services_image_idx\` ON \`services\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_locales_locale_parent_id_unique\` ON \`services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`rating\` numeric DEFAULT 5 NOT NULL,
  	\`date\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`faqs_locales_locale_parent_id_unique\` ON \`faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`subscriptions_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`subscriptions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`subscriptions_highlights_order_idx\` ON \`subscriptions_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`subscriptions_highlights_parent_id_idx\` ON \`subscriptions_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`subscriptions_highlights_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`subscriptions_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`subscriptions_highlights_locales_locale_parent_id_unique\` ON \`subscriptions_highlights_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`subscriptions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`subscriptions_image_idx\` ON \`subscriptions\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`subscriptions_updated_at_idx\` ON \`subscriptions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`subscriptions_created_at_idx\` ON \`subscriptions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`subscriptions_locales\` (
  	\`title\` text NOT NULL,
  	\`summary\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`subscriptions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`subscriptions_locales_locale_parent_id_unique\` ON \`subscriptions_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`exceptional_hours\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`closed\` integer DEFAULT true,
  	\`opens_at\` text,
  	\`closes_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`exceptional_hours_updated_at_idx\` ON \`exceptional_hours\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`exceptional_hours_created_at_idx\` ON \`exceptional_hours\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`exceptional_hours_locales\` (
  	\`note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exceptional_hours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`exceptional_hours_locales_locale_parent_id_unique\` ON \`exceptional_hours_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`phone_href\` text NOT NULL,
  	\`email\` text,
  	\`maps_url\` text NOT NULL,
  	\`geo_lat\` numeric,
  	\`geo_lng\` numeric,
  	\`primary\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`locations_locales\` (
  	\`address\` text NOT NULL,
  	\`schedule\` text NOT NULL,
  	\`maps_embed_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_locales_locale_parent_id_unique\` ON \`locations_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`service_categories_id\` integer,
  	\`services_id\` integer,
  	\`reviews_id\` integer,
  	\`faqs_id\` integer,
  	\`subscriptions_id\` integer,
  	\`exceptional_hours_id\` integer,
  	\`locations_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`service_categories_id\`) REFERENCES \`service_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subscriptions_id\`) REFERENCES \`subscriptions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exceptional_hours_id\`) REFERENCES \`exceptional_hours\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_service_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`service_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscriptions_id_idx\` ON \`payload_locked_documents_rels\` (\`subscriptions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_exceptional_hours_id_idx\` ON \`payload_locked_documents_rels\` (\`exceptional_hours_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_config_header_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`class_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_header_links_order_idx\` ON \`site_config_header_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_header_links_parent_id_idx\` ON \`site_config_header_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_header_links_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_header_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_header_links_locales_locale_parent_id_unique\` ON \`site_config_header_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`class_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_footer_columns_links_order_idx\` ON \`site_config_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_footer_columns_links_parent_id_idx\` ON \`site_config_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_columns_links_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_footer_columns_links_locales_locale_parent_id_un\` ON \`site_config_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_footer_columns_order_idx\` ON \`site_config_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_footer_columns_parent_id_idx\` ON \`site_config_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_footer_columns_locales\` (
  	\`title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_footer_columns_locales_locale_parent_id_unique\` ON \`site_config_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`icon\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_config_social_links_order_idx\` ON \`site_config_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_config_social_links_parent_id_idx\` ON \`site_config_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_config\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`legal_name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`phone_href\` text NOT NULL,
  	\`whatsapp_url\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`booking_url\` text NOT NULL,
  	\`google_reviews_url\` text NOT NULL,
  	\`primary_action_href\` text NOT NULL,
  	\`announcement_enabled\` integer DEFAULT false,
  	\`announcement_link\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`site_config_locales\` (
  	\`tagline\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`copyright\` text NOT NULL,
  	\`primary_action_label\` text NOT NULL,
  	\`announcement_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_config_locales_locale_parent_id_unique\` ON \`site_config_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_subtitle\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_subtitle_order_idx\` ON \`homepage_hero_subtitle\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_subtitle_parent_id_idx\` ON \`homepage_hero_subtitle\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_subtitle_locales\` (
  	\`line\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_hero_subtitle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_hero_subtitle_locales_locale_parent_id_unique\` ON \`homepage_hero_subtitle_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_actions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`variant\` text DEFAULT 'primary',
  	\`icon\` text,
  	\`target\` text DEFAULT '_self',
  	\`class_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_actions_order_idx\` ON \`homepage_hero_actions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_actions_parent_id_idx\` ON \`homepage_hero_actions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_actions_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_hero_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_hero_actions_locales_locale_parent_id_unique\` ON \`homepage_hero_actions_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_about_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_about_bullets_order_idx\` ON \`homepage_about_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_about_bullets_parent_id_idx\` ON \`homepage_about_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_about_bullets_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_about_bullets\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_about_bullets_locales_locale_parent_id_unique\` ON \`homepage_about_bullets_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_subscription_disclaimer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_subscription_disclaimer_order_idx\` ON \`homepage_subscription_disclaimer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_subscription_disclaimer_parent_id_idx\` ON \`homepage_subscription_disclaimer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_subscription_disclaimer_locales\` (
  	\`line\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_subscription_disclaimer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_subscription_disclaimer_locales_locale_parent_id_un\` ON \`homepage_subscription_disclaimer_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_gift_card_description\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_description_order_idx\` ON \`homepage_gift_card_description\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_description_parent_id_idx\` ON \`homepage_gift_card_description\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_gift_card_description_locales\` (
  	\`paragraph\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_gift_card_description\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_gift_card_description_locales_locale_parent_id_uniq\` ON \`homepage_gift_card_description_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_gift_card_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_features_order_idx\` ON \`homepage_gift_card_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_features_parent_id_idx\` ON \`homepage_gift_card_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_gift_card_features_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_gift_card_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_gift_card_features_locales_locale_parent_id_unique\` ON \`homepage_gift_card_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_gift_card_disclaimer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_disclaimer_order_idx\` ON \`homepage_gift_card_disclaimer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_disclaimer_parent_id_idx\` ON \`homepage_gift_card_disclaimer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_gift_card_disclaimer_locales\` (
  	\`line\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_gift_card_disclaimer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_gift_card_disclaimer_locales_locale_parent_id_uniqu\` ON \`homepage_gift_card_disclaimer_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`handle\` text,
  	\`href\` text NOT NULL,
  	\`icon\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_social_links_order_idx\` ON \`homepage_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_social_links_parent_id_idx\` ON \`homepage_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer,
  	\`about_cta_href\` text NOT NULL,
  	\`about_cta_variant\` text DEFAULT 'primary',
  	\`about_cta_icon\` text,
  	\`about_cta_target\` text DEFAULT '_self',
  	\`about_cta_class_name\` text,
  	\`about_image_id\` integer,
  	\`services_cta_href\` text NOT NULL,
  	\`services_cta_variant\` text DEFAULT 'primary',
  	\`services_cta_icon\` text,
  	\`services_cta_target\` text DEFAULT '_self',
  	\`services_cta_class_name\` text,
  	\`subscription_action_href\` text NOT NULL,
  	\`subscription_action_variant\` text DEFAULT 'primary',
  	\`subscription_action_icon\` text,
  	\`subscription_action_target\` text DEFAULT '_self',
  	\`subscription_action_class_name\` text,
  	\`gift_card_cta_href\` text NOT NULL,
  	\`gift_card_cta_variant\` text DEFAULT 'primary',
  	\`gift_card_cta_icon\` text,
  	\`gift_card_cta_target\` text DEFAULT '_self',
  	\`gift_card_cta_class_name\` text,
  	\`gift_card_image_id\` integer,
  	\`cta_button_href\` text NOT NULL,
  	\`cta_button_variant\` text DEFAULT 'primary',
  	\`cta_button_icon\` text,
  	\`cta_button_target\` text DEFAULT '_self',
  	\`cta_button_class_name\` text,
  	\`location_email\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`about_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`gift_card_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_image_idx\` ON \`homepage\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_about_image_idx\` ON \`homepage\` (\`about_image_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_gift_card_image_idx\` ON \`homepage\` (\`gift_card_image_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_locales\` (
  	\`hero_title\` text NOT NULL,
  	\`hero_text\` text,
  	\`about_tagline\` text,
  	\`about_title\` text NOT NULL,
  	\`about_intro\` text NOT NULL,
  	\`about_cta_label\` text NOT NULL,
  	\`services_title\` text NOT NULL,
  	\`services_description\` text NOT NULL,
  	\`services_cta_label\` text NOT NULL,
  	\`subscription_action_label\` text NOT NULL,
  	\`gift_card_title\` text NOT NULL,
  	\`gift_card_cta_label\` text NOT NULL,
  	\`social_title\` text NOT NULL,
  	\`social_subtitle\` text,
  	\`cta_title\` text NOT NULL,
  	\`cta_subtitle\` text NOT NULL,
  	\`cta_button_label\` text NOT NULL,
  	\`location_title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_locales_locale_parent_id_unique\` ON \`homepage_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`service_categories\`;`)
  await db.run(sql`DROP TABLE \`service_categories_locales\`;`)
  await db.run(sql`DROP TABLE \`services_pricing\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`services_locales\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`subscriptions_highlights\`;`)
  await db.run(sql`DROP TABLE \`subscriptions_highlights_locales\`;`)
  await db.run(sql`DROP TABLE \`subscriptions\`;`)
  await db.run(sql`DROP TABLE \`subscriptions_locales\`;`)
  await db.run(sql`DROP TABLE \`exceptional_hours\`;`)
  await db.run(sql`DROP TABLE \`exceptional_hours_locales\`;`)
  await db.run(sql`DROP TABLE \`locations\`;`)
  await db.run(sql`DROP TABLE \`locations_locales\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_config_header_links\`;`)
  await db.run(sql`DROP TABLE \`site_config_header_links_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`site_config_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`site_config_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_config\`;`)
  await db.run(sql`DROP TABLE \`site_config_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_subtitle\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_subtitle_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_actions\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_actions_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_about_bullets\`;`)
  await db.run(sql`DROP TABLE \`homepage_about_bullets_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_subscription_disclaimer\`;`)
  await db.run(sql`DROP TABLE \`homepage_subscription_disclaimer_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_gift_card_description\`;`)
  await db.run(sql`DROP TABLE \`homepage_gift_card_description_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_gift_card_features\`;`)
  await db.run(sql`DROP TABLE \`homepage_gift_card_features_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_gift_card_disclaimer\`;`)
  await db.run(sql`DROP TABLE \`homepage_gift_card_disclaimer_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_social_links\`;`)
  await db.run(sql`DROP TABLE \`homepage\`;`)
  await db.run(sql`DROP TABLE \`homepage_locales\`;`)
}
