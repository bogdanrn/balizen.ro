import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ro', 'en');
  CREATE TYPE "public"."enum_homepage_hero_actions_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_hero_actions_target" AS ENUM('_self', '_blank');
  CREATE TYPE "public"."enum_homepage_about_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_about_cta_target" AS ENUM('_self', '_blank');
  CREATE TYPE "public"."enum_homepage_services_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_services_cta_target" AS ENUM('_self', '_blank');
  CREATE TYPE "public"."enum_homepage_subscription_action_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_subscription_action_target" AS ENUM('_self', '_blank');
  CREATE TYPE "public"."enum_homepage_gift_card_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_gift_card_cta_target" AS ENUM('_self', '_blank');
  CREATE TYPE "public"."enum_homepage_cta_button_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_cta_button_target" AS ENUM('_self', '_blank');
  CREATE TABLE "services_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"duration" numeric NOT NULL,
  	"price" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"category_id" integer NOT NULL,
  	"image_id" integer,
  	"modified_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "service_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "subscriptions_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "subscriptions_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscriptions_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"variants" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"phone_href" varchar NOT NULL,
  	"email" varchar,
  	"maps_url" varchar NOT NULL,
  	"geo_lat" numeric,
  	"geo_lng" numeric,
  	"primary" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations_locales" (
  	"address" varchar NOT NULL,
  	"schedule" varchar NOT NULL,
  	"maps_embed_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "exceptional_hours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"closed" boolean DEFAULT true,
  	"opens_at" varchar,
  	"closes_at" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exceptional_hours_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"services_find" boolean DEFAULT false,
  	"services_create" boolean DEFAULT false,
  	"services_update" boolean DEFAULT false,
  	"services_delete" boolean DEFAULT false,
  	"service_categories_find" boolean DEFAULT false,
  	"service_categories_create" boolean DEFAULT false,
  	"service_categories_update" boolean DEFAULT false,
  	"service_categories_delete" boolean DEFAULT false,
  	"subscriptions_find" boolean DEFAULT false,
  	"subscriptions_create" boolean DEFAULT false,
  	"subscriptions_update" boolean DEFAULT false,
  	"subscriptions_delete" boolean DEFAULT false,
  	"reviews_find" boolean DEFAULT false,
  	"reviews_create" boolean DEFAULT false,
  	"reviews_update" boolean DEFAULT false,
  	"reviews_delete" boolean DEFAULT false,
  	"faqs_find" boolean DEFAULT false,
  	"faqs_create" boolean DEFAULT false,
  	"faqs_update" boolean DEFAULT false,
  	"faqs_delete" boolean DEFAULT false,
  	"locations_find" boolean DEFAULT false,
  	"locations_create" boolean DEFAULT false,
  	"locations_update" boolean DEFAULT false,
  	"locations_delete" boolean DEFAULT false,
  	"exceptional_hours_find" boolean DEFAULT false,
  	"exceptional_hours_create" boolean DEFAULT false,
  	"exceptional_hours_update" boolean DEFAULT false,
  	"exceptional_hours_delete" boolean DEFAULT false,
  	"media_find" boolean DEFAULT false,
  	"homepage_find" boolean DEFAULT false,
  	"homepage_update" boolean DEFAULT false,
  	"site_config_find" boolean DEFAULT false,
  	"site_config_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"service_categories_id" integer,
  	"subscriptions_id" integer,
  	"reviews_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"locations_id" integer,
  	"exceptional_hours_id" integer,
  	"users_id" integer,
  	"payload_mcp_api_keys_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"payload_mcp_api_keys_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_hero_subtitle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_hero_subtitle_locales" (
  	"line" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "enum_homepage_hero_actions_variant" DEFAULT 'primary',
  	"icon" varchar,
  	"target" "enum_homepage_hero_actions_target" DEFAULT '_self',
  	"class_name" varchar
  );
  
  CREATE TABLE "homepage_hero_actions_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_about_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_about_bullets_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_subscription_disclaimer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_subscription_disclaimer_locales" (
  	"line" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_gift_card_description" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_gift_card_description_locales" (
  	"paragraph" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_gift_card_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_gift_card_features_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_gift_card_disclaimer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_gift_card_disclaimer_locales" (
  	"line" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"handle" varchar,
  	"href" varchar NOT NULL,
  	"icon" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"about_cta_href" varchar NOT NULL,
  	"about_cta_variant" "enum_homepage_about_cta_variant" DEFAULT 'primary',
  	"about_cta_icon" varchar,
  	"about_cta_target" "enum_homepage_about_cta_target" DEFAULT '_self',
  	"about_cta_class_name" varchar,
  	"about_image_id" integer,
  	"services_cta_href" varchar NOT NULL,
  	"services_cta_variant" "enum_homepage_services_cta_variant" DEFAULT 'primary',
  	"services_cta_icon" varchar,
  	"services_cta_target" "enum_homepage_services_cta_target" DEFAULT '_self',
  	"services_cta_class_name" varchar,
  	"subscription_action_href" varchar NOT NULL,
  	"subscription_action_variant" "enum_homepage_subscription_action_variant" DEFAULT 'primary',
  	"subscription_action_icon" varchar,
  	"subscription_action_target" "enum_homepage_subscription_action_target" DEFAULT '_self',
  	"subscription_action_class_name" varchar,
  	"gift_card_cta_href" varchar NOT NULL,
  	"gift_card_cta_variant" "enum_homepage_gift_card_cta_variant" DEFAULT 'primary',
  	"gift_card_cta_icon" varchar,
  	"gift_card_cta_target" "enum_homepage_gift_card_cta_target" DEFAULT '_self',
  	"gift_card_cta_class_name" varchar,
  	"gift_card_image_id" integer,
  	"cta_button_href" varchar NOT NULL,
  	"cta_button_variant" "enum_homepage_cta_button_variant" DEFAULT 'primary',
  	"cta_button_icon" varchar,
  	"cta_button_target" "enum_homepage_cta_button_target" DEFAULT '_self',
  	"cta_button_class_name" varchar,
  	"location_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"about_tagline" varchar,
  	"about_title" varchar NOT NULL,
  	"about_intro" varchar NOT NULL,
  	"about_cta_label" varchar NOT NULL,
  	"services_title" varchar NOT NULL,
  	"services_description" varchar NOT NULL,
  	"services_cta_label" varchar NOT NULL,
  	"subscription_action_label" varchar NOT NULL,
  	"gift_card_title" varchar NOT NULL,
  	"gift_card_cta_label" varchar NOT NULL,
  	"social_title" varchar NOT NULL,
  	"social_subtitle" varchar,
  	"cta_title" varchar NOT NULL,
  	"cta_subtitle" varchar NOT NULL,
  	"cta_button_label" varchar NOT NULL,
  	"location_title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "announcement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "announcement_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_config_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"class_name" varchar
  );
  
  CREATE TABLE "site_config_header_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_config_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"class_name" varchar
  );
  
  CREATE TABLE "site_config_footer_columns_links_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_config_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_config_footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_config_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"icon" varchar NOT NULL
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"legal_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"phone_href" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"whatsapp_url" varchar NOT NULL,
  	"booking_url" varchar NOT NULL,
  	"google_reviews_url" varchar NOT NULL,
  	"primary_action_href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_config_locales" (
  	"tagline" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"copyright" varchar NOT NULL,
  	"primary_action_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "services_pricing" ADD CONSTRAINT "services_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_categories_locales" ADD CONSTRAINT "service_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions_highlights" ADD CONSTRAINT "subscriptions_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions_highlights_locales" ADD CONSTRAINT "subscriptions_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subscriptions_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions_locales" ADD CONSTRAINT "subscriptions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_locales" ADD CONSTRAINT "locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exceptional_hours_locales" ADD CONSTRAINT "exceptional_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exceptional_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_categories_fk" FOREIGN KEY ("service_categories_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exceptional_hours_fk" FOREIGN KEY ("exceptional_hours_id") REFERENCES "public"."exceptional_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_subtitle" ADD CONSTRAINT "homepage_hero_subtitle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_subtitle_locales" ADD CONSTRAINT "homepage_hero_subtitle_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_hero_subtitle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_actions" ADD CONSTRAINT "homepage_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_actions_locales" ADD CONSTRAINT "homepage_hero_actions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_hero_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_about_bullets" ADD CONSTRAINT "homepage_about_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_about_bullets_locales" ADD CONSTRAINT "homepage_about_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_about_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_subscription_disclaimer" ADD CONSTRAINT "homepage_subscription_disclaimer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_subscription_disclaimer_locales" ADD CONSTRAINT "homepage_subscription_disclaimer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_subscription_disclaimer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gift_card_description" ADD CONSTRAINT "homepage_gift_card_description_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gift_card_description_locales" ADD CONSTRAINT "homepage_gift_card_description_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_gift_card_description"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gift_card_features" ADD CONSTRAINT "homepage_gift_card_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gift_card_features_locales" ADD CONSTRAINT "homepage_gift_card_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_gift_card_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gift_card_disclaimer" ADD CONSTRAINT "homepage_gift_card_disclaimer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gift_card_disclaimer_locales" ADD CONSTRAINT "homepage_gift_card_disclaimer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_gift_card_disclaimer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_social_links" ADD CONSTRAINT "homepage_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_gift_card_image_id_media_id_fk" FOREIGN KEY ("gift_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_locales" ADD CONSTRAINT "announcement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_header_links" ADD CONSTRAINT "site_config_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_header_links_locales" ADD CONSTRAINT "site_config_header_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config_header_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_footer_columns_links" ADD CONSTRAINT "site_config_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_footer_columns_links_locales" ADD CONSTRAINT "site_config_footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config_footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_footer_columns" ADD CONSTRAINT "site_config_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_footer_columns_locales" ADD CONSTRAINT "site_config_footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_social_links" ADD CONSTRAINT "site_config_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_locales" ADD CONSTRAINT "site_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_pricing_order_idx" ON "services_pricing" USING btree ("_order");
  CREATE INDEX "services_pricing_parent_id_idx" ON "services_pricing" USING btree ("_parent_id");
  CREATE INDEX "services__order_idx" ON "services" USING btree ("_order");
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_categories__order_idx" ON "service_categories" USING btree ("_order");
  CREATE INDEX "service_categories_updated_at_idx" ON "service_categories" USING btree ("updated_at");
  CREATE INDEX "service_categories_created_at_idx" ON "service_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "service_categories_locales_locale_parent_id_unique" ON "service_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "subscriptions_highlights_order_idx" ON "subscriptions_highlights" USING btree ("_order");
  CREATE INDEX "subscriptions_highlights_parent_id_idx" ON "subscriptions_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "subscriptions_highlights_locales_locale_parent_id_unique" ON "subscriptions_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "subscriptions__order_idx" ON "subscriptions" USING btree ("_order");
  CREATE INDEX "subscriptions_image_idx" ON "subscriptions" USING btree ("image_id");
  CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscriptions_locales_locale_parent_id_unique" ON "subscriptions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "faqs__order_idx" ON "faqs" USING btree ("_order");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "locations__order_idx" ON "locations" USING btree ("_order");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE UNIQUE INDEX "locations_locales_locale_parent_id_unique" ON "locations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "exceptional_hours_updated_at_idx" ON "exceptional_hours" USING btree ("updated_at");
  CREATE INDEX "exceptional_hours_created_at_idx" ON "exceptional_hours" USING btree ("created_at");
  CREATE UNIQUE INDEX "exceptional_hours_locales_locale_parent_id_unique" ON "exceptional_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_service_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("service_categories_id");
  CREATE INDEX "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_exceptional_hours_id_idx" ON "payload_locked_documents_rels" USING btree ("exceptional_hours_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_hero_subtitle_order_idx" ON "homepage_hero_subtitle" USING btree ("_order");
  CREATE INDEX "homepage_hero_subtitle_parent_id_idx" ON "homepage_hero_subtitle" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_hero_subtitle_locales_locale_parent_id_unique" ON "homepage_hero_subtitle_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_hero_actions_order_idx" ON "homepage_hero_actions" USING btree ("_order");
  CREATE INDEX "homepage_hero_actions_parent_id_idx" ON "homepage_hero_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_hero_actions_locales_locale_parent_id_unique" ON "homepage_hero_actions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_about_bullets_order_idx" ON "homepage_about_bullets" USING btree ("_order");
  CREATE INDEX "homepage_about_bullets_parent_id_idx" ON "homepage_about_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_about_bullets_locales_locale_parent_id_unique" ON "homepage_about_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_subscription_disclaimer_order_idx" ON "homepage_subscription_disclaimer" USING btree ("_order");
  CREATE INDEX "homepage_subscription_disclaimer_parent_id_idx" ON "homepage_subscription_disclaimer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_subscription_disclaimer_locales_locale_parent_id_un" ON "homepage_subscription_disclaimer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_gift_card_description_order_idx" ON "homepage_gift_card_description" USING btree ("_order");
  CREATE INDEX "homepage_gift_card_description_parent_id_idx" ON "homepage_gift_card_description" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_gift_card_description_locales_locale_parent_id_uniq" ON "homepage_gift_card_description_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_gift_card_features_order_idx" ON "homepage_gift_card_features" USING btree ("_order");
  CREATE INDEX "homepage_gift_card_features_parent_id_idx" ON "homepage_gift_card_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_gift_card_features_locales_locale_parent_id_unique" ON "homepage_gift_card_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_gift_card_disclaimer_order_idx" ON "homepage_gift_card_disclaimer" USING btree ("_order");
  CREATE INDEX "homepage_gift_card_disclaimer_parent_id_idx" ON "homepage_gift_card_disclaimer" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_gift_card_disclaimer_locales_locale_parent_id_uniqu" ON "homepage_gift_card_disclaimer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_social_links_order_idx" ON "homepage_social_links" USING btree ("_order");
  CREATE INDEX "homepage_social_links_parent_id_idx" ON "homepage_social_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_about_image_idx" ON "homepage" USING btree ("about_image_id");
  CREATE INDEX "homepage_gift_card_image_idx" ON "homepage" USING btree ("gift_card_image_id");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "announcement_locales_locale_parent_id_unique" ON "announcement_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_config_header_links_order_idx" ON "site_config_header_links" USING btree ("_order");
  CREATE INDEX "site_config_header_links_parent_id_idx" ON "site_config_header_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_header_links_locales_locale_parent_id_unique" ON "site_config_header_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_config_footer_columns_links_order_idx" ON "site_config_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_config_footer_columns_links_parent_id_idx" ON "site_config_footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_footer_columns_links_locales_locale_parent_id_un" ON "site_config_footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_config_footer_columns_order_idx" ON "site_config_footer_columns" USING btree ("_order");
  CREATE INDEX "site_config_footer_columns_parent_id_idx" ON "site_config_footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_footer_columns_locales_locale_parent_id_unique" ON "site_config_footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_config_social_links_order_idx" ON "site_config_social_links" USING btree ("_order");
  CREATE INDEX "site_config_social_links_parent_id_idx" ON "site_config_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_locales_locale_parent_id_unique" ON "site_config_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_pricing" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "service_categories" CASCADE;
  DROP TABLE "service_categories_locales" CASCADE;
  DROP TABLE "subscriptions_highlights" CASCADE;
  DROP TABLE "subscriptions_highlights_locales" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "subscriptions_locales" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_locales" CASCADE;
  DROP TABLE "exceptional_hours" CASCADE;
  DROP TABLE "exceptional_hours_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_mcp_api_keys" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_hero_subtitle" CASCADE;
  DROP TABLE "homepage_hero_subtitle_locales" CASCADE;
  DROP TABLE "homepage_hero_actions" CASCADE;
  DROP TABLE "homepage_hero_actions_locales" CASCADE;
  DROP TABLE "homepage_about_bullets" CASCADE;
  DROP TABLE "homepage_about_bullets_locales" CASCADE;
  DROP TABLE "homepage_subscription_disclaimer" CASCADE;
  DROP TABLE "homepage_subscription_disclaimer_locales" CASCADE;
  DROP TABLE "homepage_gift_card_description" CASCADE;
  DROP TABLE "homepage_gift_card_description_locales" CASCADE;
  DROP TABLE "homepage_gift_card_features" CASCADE;
  DROP TABLE "homepage_gift_card_features_locales" CASCADE;
  DROP TABLE "homepage_gift_card_disclaimer" CASCADE;
  DROP TABLE "homepage_gift_card_disclaimer_locales" CASCADE;
  DROP TABLE "homepage_social_links" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "announcement" CASCADE;
  DROP TABLE "announcement_locales" CASCADE;
  DROP TABLE "site_config_header_links" CASCADE;
  DROP TABLE "site_config_header_links_locales" CASCADE;
  DROP TABLE "site_config_footer_columns_links" CASCADE;
  DROP TABLE "site_config_footer_columns_links_locales" CASCADE;
  DROP TABLE "site_config_footer_columns" CASCADE;
  DROP TABLE "site_config_footer_columns_locales" CASCADE;
  DROP TABLE "site_config_social_links" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TABLE "site_config_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_homepage_hero_actions_variant";
  DROP TYPE "public"."enum_homepage_hero_actions_target";
  DROP TYPE "public"."enum_homepage_about_cta_variant";
  DROP TYPE "public"."enum_homepage_about_cta_target";
  DROP TYPE "public"."enum_homepage_services_cta_variant";
  DROP TYPE "public"."enum_homepage_services_cta_target";
  DROP TYPE "public"."enum_homepage_subscription_action_variant";
  DROP TYPE "public"."enum_homepage_subscription_action_target";
  DROP TYPE "public"."enum_homepage_gift_card_cta_variant";
  DROP TYPE "public"."enum_homepage_gift_card_cta_target";
  DROP TYPE "public"."enum_homepage_cta_button_variant";
  DROP TYPE "public"."enum_homepage_cta_button_target";`)
}
