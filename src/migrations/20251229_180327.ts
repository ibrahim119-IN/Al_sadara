import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'manager', 'staff');
  CREATE TYPE "public"."enum_companies_company_type" AS ENUM('plastics', 'electronics', 'manufacturing', 'recycling');
  CREATE TYPE "public"."enum_companies_country" AS ENUM('egypt', 'saudi', 'uae');
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('cctv', 'access-control', 'intercom', 'pbx', 'nurse-call', 'fire-alarm', 'gps', 'raw-material');
  CREATE TYPE "public"."enum_products_cctv_specs_camera_type" AS ENUM('IP', 'AHD', 'TVI', 'CVI');
  CREATE TYPE "public"."enum_products_cctv_specs_indoor_outdoor" AS ENUM('indoor', 'outdoor', 'both');
  CREATE TYPE "public"."enum_products_raw_material_specs_material_type" AS ENUM('PP', 'PE', 'HDPE', 'LDPE', 'PVC', 'Other');
  CREATE TYPE "public"."enum_products_raw_material_specs_unit_of_measure" AS ENUM('kg', 'ton', 'bag');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_customers_customer_type" AS ENUM('individual', 'business');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('bank-transfer', 'vodafone-cash', 'card', 'cash-on-delivery');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
  CREATE TYPE "public"."enum_quotes_status" AS ENUM('pending', 'quoted', 'accepted', 'rejected');
  CREATE TYPE "public"."enum_ai_conversations_status" AS ENUM('active', 'archived', 'deleted');
  CREATE TYPE "public"."enum_ai_messages_role" AS ENUM('user', 'assistant', 'system');
  CREATE TYPE "public"."enum_product_embeddings_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_knowledge_base_type" AS ENUM('policy', 'faq', 'guide');
  CREATE TYPE "public"."enum_knowledge_base_locale" AS ENUM('ar', 'en');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'staff' NOT NULL,
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "companies_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"caption_ar" varchar
  );
  
  CREATE TABLE "companies_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar,
  	"is_whats_app" boolean
  );
  
  CREATE TABLE "companies_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "companies_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"value_ar" varchar,
  	"description" varchar,
  	"description_ar" varchar
  );
  
  CREATE TABLE "companies_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar,
  	"description" varchar,
  	"description_ar" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "companies_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar,
  	"logo_id" integer,
  	"year" numeric
  );
  
  CREATE TABLE "companies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar NOT NULL,
  	"short_name" varchar,
  	"short_name_ar" varchar,
  	"tagline" varchar,
  	"tagline_ar" varchar,
  	"description" varchar,
  	"description_ar" varchar,
  	"company_type" "enum_companies_company_type" NOT NULL,
  	"founded_year" numeric,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"hero_image_id" integer,
  	"primary_color" varchar,
  	"secondary_color" varchar,
  	"accent_color" varchar,
  	"background_color" varchar,
  	"country" "enum_companies_country" NOT NULL,
  	"city" varchar,
  	"city_ar" varchar,
  	"address" varchar,
  	"address_ar" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"google_maps_url" varchar,
  	"website" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar,
  	"social_links_youtube" varchar,
  	"business_hours_weekdays" varchar,
  	"business_hours_weekends" varchar,
  	"business_hours_note" varchar,
  	"business_hours_note_ar" varchar,
  	"vision" varchar,
  	"vision_ar" varchar,
  	"mission" varchar,
  	"mission_ar" varchar,
  	"meta_title" varchar,
  	"meta_title_ar" varchar,
  	"meta_description" varchar,
  	"meta_description_ar" varchar,
  	"og_image_id" integer,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"is_parent" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"show_in_main_nav" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"description_ar" varchar,
  	"image_id" integer,
  	"company_id" integer,
  	"parent_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"key_ar" varchar,
  	"value_ar" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"sku" varchar,
  	"description" jsonb,
  	"description_ar" jsonb,
  	"price" numeric NOT NULL,
  	"compare_at_price" numeric,
  	"cost_price" numeric,
  	"stock" numeric DEFAULT 0,
  	"low_stock_threshold" numeric DEFAULT 5,
  	"track_inventory" boolean DEFAULT true,
  	"company_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"brand" varchar,
  	"datasheet_id" integer,
  	"product_type" "enum_products_product_type" NOT NULL,
  	"cctv_specs_resolution" varchar,
  	"cctv_specs_camera_type" "enum_products_cctv_specs_camera_type",
  	"cctv_specs_night_vision" varchar,
  	"cctv_specs_indoor_outdoor" "enum_products_cctv_specs_indoor_outdoor",
  	"cctv_specs_poe" boolean,
  	"cctv_specs_audio_support" boolean,
  	"access_control_specs_max_users" numeric,
  	"access_control_specs_fingerprint_capacity" numeric,
  	"access_control_specs_face_capacity" numeric,
  	"access_control_specs_card_support" boolean,
  	"access_control_specs_wifi_support" boolean,
  	"access_control_specs_attendance_report" boolean,
  	"raw_material_specs_material_type" "enum_products_raw_material_specs_material_type",
  	"raw_material_specs_grade" varchar,
  	"raw_material_specs_mfi" varchar,
  	"raw_material_specs_min_order_quantity" numeric,
  	"raw_material_specs_unit_of_measure" "enum_products_raw_material_specs_unit_of_measure",
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"full_name" varchar,
  	"phone" varchar,
  	"address" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"governorate" varchar NOT NULL,
  	"is_default" boolean
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"company" varchar,
  	"customer_type" "enum_customers_customer_type" DEFAULT 'individual',
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
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"price_at_time" numeric NOT NULL,
  	"subtotal" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar,
  	"customer_id" integer NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"shipping_cost" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"shipping_address_full_name" varchar NOT NULL,
  	"shipping_address_phone" varchar NOT NULL,
  	"shipping_address_address" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_governorate" varchar NOT NULL,
  	"payment_method" "enum_orders_payment_method",
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending',
  	"payment_transaction_id" varchar,
  	"payment_paid_at" timestamp(3) with time zone,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"customer_notes" varchar,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quotes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"quantity" numeric NOT NULL,
  	"custom_request" varchar
  );
  
  CREATE TABLE "quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote_number" varchar,
  	"customer_id" integer,
  	"contact_name" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"company_name" varchar,
  	"message" varchar,
  	"status" "enum_quotes_status" DEFAULT 'pending' NOT NULL,
  	"quoted_price" numeric,
  	"admin_response" varchar,
  	"valid_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cart_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer,
  	"session_id" varchar,
  	"product_id" integer NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"customer_id" integer,
  	"title" varchar,
  	"status" "enum_ai_conversations_status" DEFAULT 'active' NOT NULL,
  	"metadata" jsonb,
  	"message_count" numeric DEFAULT 0,
  	"last_message_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"conversation_id" integer NOT NULL,
  	"role" "enum_ai_messages_role" NOT NULL,
  	"content" varchar NOT NULL,
  	"function_calls" jsonb,
  	"function_results" jsonb,
  	"metadata" jsonb,
  	"tokens_used" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_embeddings_embedding" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric
  );
  
  CREATE TABLE "product_embeddings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"text" varchar,
  	"locale" "enum_product_embeddings_locale" DEFAULT 'ar' NOT NULL,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "knowledge_base" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"type" "enum_knowledge_base_type" NOT NULL,
  	"category" varchar,
  	"embedding" jsonb,
  	"locale" "enum_knowledge_base_locale" DEFAULT 'ar' NOT NULL,
  	"metadata" jsonb,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"users_id" integer,
  	"media_id" integer,
  	"companies_id" integer,
  	"categories_id" integer,
  	"products_id" integer,
  	"customers_id" integer,
  	"orders_id" integer,
  	"quotes_id" integer,
  	"cart_items_id" integer,
  	"ai_conversations_id" integer,
  	"ai_messages_id" integer,
  	"product_embeddings_id" integer,
  	"knowledge_base_id" integer
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
  	"customers_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "group_settings_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar,
  	"flag" varchar
  );
  
  CREATE TABLE "group_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_name" varchar DEFAULT 'El Sayed Shehata Group for Trade and Industry' NOT NULL,
  	"group_name_ar" varchar DEFAULT 'مجموعة السيد شحاتة للتجارة والصناعة' NOT NULL,
  	"short_name" varchar DEFAULT 'ESS Group',
  	"short_name_ar" varchar DEFAULT 'مجموعة السيد شحاتة',
  	"slogan" varchar DEFAULT 'Leaders in Plastics and Building Systems in the Middle East',
  	"slogan_ar" varchar DEFAULT 'رواد صناعة وتجارة البلاستيك وأنظمة المباني في الشرق الأوسط',
  	"description" varchar,
  	"description_ar" varchar,
  	"founded_year" numeric DEFAULT 2005,
  	"main_domain" varchar DEFAULT 'alsadara.org',
  	"group_logo_id" integer,
  	"group_logo_dark_id" integer,
  	"hero_image_id" integer,
  	"favicon_id" integer,
  	"vision" varchar DEFAULT 'To be the most trusted partner in plastics and building systems across the Middle East and Africa by 2030.',
  	"vision_ar" varchar DEFAULT 'أن نكون الشريك الأكثر ثقة في صناعة وتجارة البلاستيك وأنظمة المباني في الشرق الأوسط وأفريقيا بحلول 2030.',
  	"mission" varchar DEFAULT 'Providing high-quality plastic raw materials and smart building solutions with competitive pricing and exceptional customer service.',
  	"mission_ar" varchar DEFAULT 'توفير خامات بلاستيك عالية الجودة وحلول مباني ذكية بأسعار تنافسية وخدمة عملاء استثنائية.',
  	"total_companies" numeric DEFAULT 6,
  	"countries_presence" numeric DEFAULT 3,
  	"total_employees" numeric,
  	"total_clients" numeric DEFAULT 1000,
  	"main_email" varchar,
  	"main_phone" varchar,
  	"whatsapp" varchar,
  	"headquarters_address" varchar,
  	"headquarters_address_ar" varchar,
  	"headquarters_city" varchar,
  	"headquarters_country" varchar,
  	"social_links_facebook" varchar,
  	"social_links_instagram" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar,
  	"social_links_youtube" varchar,
  	"meta_title" varchar DEFAULT 'El Sayed Shehata Group - Plastics & Building Systems',
  	"meta_title_ar" varchar DEFAULT 'مجموعة السيد شحاتة - خامات بلاستيك وأنظمة مباني',
  	"meta_description" varchar,
  	"meta_description_ar" varchar,
  	"og_image_id" integer,
  	"keywords" varchar,
  	"keywords_ar" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_gallery_images" ADD CONSTRAINT "companies_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies_gallery_images" ADD CONSTRAINT "companies_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_phones" ADD CONSTRAINT "companies_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_emails" ADD CONSTRAINT "companies_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_values" ADD CONSTRAINT "companies_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_services" ADD CONSTRAINT "companies_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_certifications" ADD CONSTRAINT "companies_certifications_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies_certifications" ADD CONSTRAINT "companies_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies" ADD CONSTRAINT "companies_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies" ADD CONSTRAINT "companies_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_datasheet_id_media_id_fk" FOREIGN KEY ("datasheet_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_addresses" ADD CONSTRAINT "customers_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quotes_items" ADD CONSTRAINT "quotes_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quotes_items" ADD CONSTRAINT "quotes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quotes" ADD CONSTRAINT "quotes_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversation_id_ai_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_embeddings_embedding" ADD CONSTRAINT "product_embeddings_embedding_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_embeddings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_embeddings" ADD CONSTRAINT "product_embeddings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cart_items_fk" FOREIGN KEY ("cart_items_id") REFERENCES "public"."cart_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_conversations_fk" FOREIGN KEY ("ai_conversations_id") REFERENCES "public"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_messages_fk" FOREIGN KEY ("ai_messages_id") REFERENCES "public"."ai_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_embeddings_fk" FOREIGN KEY ("product_embeddings_id") REFERENCES "public"."product_embeddings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_base_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "group_settings_countries" ADD CONSTRAINT "group_settings_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."group_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "group_settings" ADD CONSTRAINT "group_settings_group_logo_id_media_id_fk" FOREIGN KEY ("group_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "group_settings" ADD CONSTRAINT "group_settings_group_logo_dark_id_media_id_fk" FOREIGN KEY ("group_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "group_settings" ADD CONSTRAINT "group_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "group_settings" ADD CONSTRAINT "group_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "group_settings" ADD CONSTRAINT "group_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "companies_gallery_images_order_idx" ON "companies_gallery_images" USING btree ("_order");
  CREATE INDEX "companies_gallery_images_parent_id_idx" ON "companies_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "companies_gallery_images_image_idx" ON "companies_gallery_images" USING btree ("image_id");
  CREATE INDEX "companies_phones_order_idx" ON "companies_phones" USING btree ("_order");
  CREATE INDEX "companies_phones_parent_id_idx" ON "companies_phones" USING btree ("_parent_id");
  CREATE INDEX "companies_emails_order_idx" ON "companies_emails" USING btree ("_order");
  CREATE INDEX "companies_emails_parent_id_idx" ON "companies_emails" USING btree ("_parent_id");
  CREATE INDEX "companies_values_order_idx" ON "companies_values" USING btree ("_order");
  CREATE INDEX "companies_values_parent_id_idx" ON "companies_values" USING btree ("_parent_id");
  CREATE INDEX "companies_services_order_idx" ON "companies_services" USING btree ("_order");
  CREATE INDEX "companies_services_parent_id_idx" ON "companies_services" USING btree ("_parent_id");
  CREATE INDEX "companies_certifications_order_idx" ON "companies_certifications" USING btree ("_order");
  CREATE INDEX "companies_certifications_parent_id_idx" ON "companies_certifications" USING btree ("_parent_id");
  CREATE INDEX "companies_certifications_logo_idx" ON "companies_certifications" USING btree ("logo_id");
  CREATE INDEX "companies_logo_idx" ON "companies" USING btree ("logo_id");
  CREATE INDEX "companies_logo_dark_idx" ON "companies" USING btree ("logo_dark_id");
  CREATE INDEX "companies_hero_image_idx" ON "companies" USING btree ("hero_image_id");
  CREATE INDEX "companies_og_image_idx" ON "companies" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "companies_slug_idx" ON "companies" USING btree ("slug");
  CREATE INDEX "companies_updated_at_idx" ON "companies" USING btree ("updated_at");
  CREATE INDEX "companies_created_at_idx" ON "companies" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_company_idx" ON "categories" USING btree ("company_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "products_tags_order_idx" ON "products_tags" USING btree ("_order");
  CREATE INDEX "products_tags_parent_id_idx" ON "products_tags" USING btree ("_parent_id");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_company_idx" ON "products" USING btree ("company_id");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_datasheet_idx" ON "products" USING btree ("datasheet_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "customers_addresses_order_idx" ON "customers_addresses" USING btree ("_order");
  CREATE INDEX "customers_addresses_parent_id_idx" ON "customers_addresses" USING btree ("_parent_id");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "quotes_items_order_idx" ON "quotes_items" USING btree ("_order");
  CREATE INDEX "quotes_items_parent_id_idx" ON "quotes_items" USING btree ("_parent_id");
  CREATE INDEX "quotes_items_product_idx" ON "quotes_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "quotes_quote_number_idx" ON "quotes" USING btree ("quote_number");
  CREATE INDEX "quotes_customer_idx" ON "quotes" USING btree ("customer_id");
  CREATE INDEX "quotes_updated_at_idx" ON "quotes" USING btree ("updated_at");
  CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
  CREATE INDEX "cart_items_customer_idx" ON "cart_items" USING btree ("customer_id");
  CREATE INDEX "cart_items_product_idx" ON "cart_items" USING btree ("product_id");
  CREATE INDEX "cart_items_updated_at_idx" ON "cart_items" USING btree ("updated_at");
  CREATE INDEX "cart_items_created_at_idx" ON "cart_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "ai_conversations_session_id_idx" ON "ai_conversations" USING btree ("session_id");
  CREATE INDEX "ai_conversations_customer_idx" ON "ai_conversations" USING btree ("customer_id");
  CREATE INDEX "ai_conversations_status_idx" ON "ai_conversations" USING btree ("status");
  CREATE INDEX "ai_conversations_last_message_at_idx" ON "ai_conversations" USING btree ("last_message_at");
  CREATE INDEX "ai_conversations_updated_at_idx" ON "ai_conversations" USING btree ("updated_at");
  CREATE INDEX "ai_conversations_created_at_idx" ON "ai_conversations" USING btree ("created_at");
  CREATE INDEX "ai_messages_conversation_idx" ON "ai_messages" USING btree ("conversation_id");
  CREATE INDEX "ai_messages_role_idx" ON "ai_messages" USING btree ("role");
  CREATE INDEX "ai_messages_updated_at_idx" ON "ai_messages" USING btree ("updated_at");
  CREATE INDEX "ai_messages_created_at_idx" ON "ai_messages" USING btree ("created_at");
  CREATE INDEX "product_embeddings_embedding_order_idx" ON "product_embeddings_embedding" USING btree ("_order");
  CREATE INDEX "product_embeddings_embedding_parent_id_idx" ON "product_embeddings_embedding" USING btree ("_parent_id");
  CREATE INDEX "product_embeddings_product_idx" ON "product_embeddings" USING btree ("product_id");
  CREATE INDEX "product_embeddings_locale_idx" ON "product_embeddings" USING btree ("locale");
  CREATE INDEX "product_embeddings_updated_at_idx" ON "product_embeddings" USING btree ("updated_at");
  CREATE INDEX "product_embeddings_created_at_idx" ON "product_embeddings" USING btree ("created_at");
  CREATE UNIQUE INDEX "knowledge_base_slug_idx" ON "knowledge_base" USING btree ("slug");
  CREATE INDEX "knowledge_base_type_idx" ON "knowledge_base" USING btree ("type");
  CREATE INDEX "knowledge_base_category_idx" ON "knowledge_base" USING btree ("category");
  CREATE INDEX "knowledge_base_locale_idx" ON "knowledge_base" USING btree ("locale");
  CREATE INDEX "knowledge_base_is_active_idx" ON "knowledge_base" USING btree ("is_active");
  CREATE INDEX "knowledge_base_updated_at_idx" ON "knowledge_base" USING btree ("updated_at");
  CREATE INDEX "knowledge_base_created_at_idx" ON "knowledge_base" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_companies_id_idx" ON "payload_locked_documents_rels" USING btree ("companies_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("quotes_id");
  CREATE INDEX "payload_locked_documents_rels_cart_items_id_idx" ON "payload_locked_documents_rels" USING btree ("cart_items_id");
  CREATE INDEX "payload_locked_documents_rels_ai_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_conversations_id");
  CREATE INDEX "payload_locked_documents_rels_ai_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_messages_id");
  CREATE INDEX "payload_locked_documents_rels_product_embeddings_id_idx" ON "payload_locked_documents_rels" USING btree ("product_embeddings_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_base_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_base_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "group_settings_countries_order_idx" ON "group_settings_countries" USING btree ("_order");
  CREATE INDEX "group_settings_countries_parent_id_idx" ON "group_settings_countries" USING btree ("_parent_id");
  CREATE INDEX "group_settings_group_logo_idx" ON "group_settings" USING btree ("group_logo_id");
  CREATE INDEX "group_settings_group_logo_dark_idx" ON "group_settings" USING btree ("group_logo_dark_id");
  CREATE INDEX "group_settings_hero_image_idx" ON "group_settings" USING btree ("hero_image_id");
  CREATE INDEX "group_settings_favicon_idx" ON "group_settings" USING btree ("favicon_id");
  CREATE INDEX "group_settings_og_image_idx" ON "group_settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "companies_gallery_images" CASCADE;
  DROP TABLE "companies_phones" CASCADE;
  DROP TABLE "companies_emails" CASCADE;
  DROP TABLE "companies_values" CASCADE;
  DROP TABLE "companies_services" CASCADE;
  DROP TABLE "companies_certifications" CASCADE;
  DROP TABLE "companies" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "products_tags" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "customers_addresses" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "quotes_items" CASCADE;
  DROP TABLE "quotes" CASCADE;
  DROP TABLE "cart_items" CASCADE;
  DROP TABLE "ai_conversations" CASCADE;
  DROP TABLE "ai_messages" CASCADE;
  DROP TABLE "product_embeddings_embedding" CASCADE;
  DROP TABLE "product_embeddings" CASCADE;
  DROP TABLE "knowledge_base" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "group_settings_countries" CASCADE;
  DROP TABLE "group_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_companies_company_type";
  DROP TYPE "public"."enum_companies_country";
  DROP TYPE "public"."enum_products_product_type";
  DROP TYPE "public"."enum_products_cctv_specs_camera_type";
  DROP TYPE "public"."enum_products_cctv_specs_indoor_outdoor";
  DROP TYPE "public"."enum_products_raw_material_specs_material_type";
  DROP TYPE "public"."enum_products_raw_material_specs_unit_of_measure";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_customers_customer_type";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_quotes_status";
  DROP TYPE "public"."enum_ai_conversations_status";
  DROP TYPE "public"."enum_ai_messages_role";
  DROP TYPE "public"."enum_product_embeddings_locale";
  DROP TYPE "public"."enum_knowledge_base_type";
  DROP TYPE "public"."enum_knowledge_base_locale";`)
}
