import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1746700000000 implements MigrationInterface {
  name = 'InitSchema1746700000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // pgcrypto 확장 활성화 (gen_random_uuid() 사용)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)

    // users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"                   UUID         NOT NULL DEFAULT gen_random_uuid(),
        "email"                VARCHAR(320) NOT NULL,
        "name"                 VARCHAR(100) NOT NULL,
        "provider"             VARCHAR(20)  NOT NULL CHECK (provider IN ('google','kakao')),
        "provider_id"          VARCHAR(255) NOT NULL,
        "refresh_token_hash"   VARCHAR(255),
        "created_at"           TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at"           TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "deleted_at"           TIMESTAMPTZ,
        CONSTRAINT "pk_users" PRIMARY KEY ("id"),
        CONSTRAINT "uq_users_email" UNIQUE ("email"),
        CONSTRAINT "uq_users_provider" UNIQUE ("provider", "provider_id")
      )
    `)

    // ingredient_categories
    await queryRunner.query(`
      CREATE TABLE "ingredient_categories" (
        "id"                      SMALLINT     NOT NULL GENERATED ALWAYS AS IDENTITY,
        "name"                    VARCHAR(50)  NOT NULL,
        "icon_emoji"              VARCHAR(10)  NOT NULL,
        "default_expiry_days"     SMALLINT     NOT NULL CHECK (default_expiry_days > 0),
        "notification_lead_days"  SMALLINT     NOT NULL CHECK (notification_lead_days > 0),
        "can_freeze"              BOOLEAN      NOT NULL DEFAULT false,
        "frozen_expiry_days"      SMALLINT,
        "single_serving_unit"     VARCHAR(20)  NOT NULL,
        "created_at"              TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "pk_ingredient_categories" PRIMARY KEY ("id"),
        CONSTRAINT "uq_ingredient_categories_name" UNIQUE ("name")
      )
    `)

    // 시드 데이터
    await queryRunner.query(`
      INSERT INTO "ingredient_categories"
        ("name","icon_emoji","default_expiry_days","notification_lead_days","can_freeze","frozen_expiry_days","single_serving_unit")
      VALUES
        ('잎채소','🥬',3,2,false,NULL,'1줌'),
        ('두부·콩류','🫘',5,3,true,90,'1/2모'),
        ('육류','🥩',3,2,true,90,'150g'),
        ('근채류','🥕',10,4,false,NULL,'1/2개'),
        ('계란','🥚',14,4,false,NULL,'2개'),
        ('유제품','🥛',7,3,false,NULL,'200ml'),
        ('가공식품','🍜',90,7,false,NULL,'1개'),
        ('소스·양념','🌶',90,14,false,NULL,'1T')
    `)

    // ingredients
    await queryRunner.query(`
      CREATE TABLE "ingredients" (
        "id"              UUID           NOT NULL DEFAULT gen_random_uuid(),
        "user_id"         UUID           NOT NULL,
        "category_id"     SMALLINT       NOT NULL,
        "name"            VARCHAR(100)   NOT NULL,
        "quantity"        NUMERIC(8,2)   NOT NULL CHECK (quantity >= 0),
        "unit"            VARCHAR(20)    NOT NULL,
        "purchase_date"   DATE           NOT NULL,
        "expiry_date"     DATE           NOT NULL,
        "is_frozen"       BOOLEAN        NOT NULL DEFAULT false,
        "frozen_at"       DATE,
        "status"          VARCHAR(20)    NOT NULL DEFAULT 'active'
          CHECK (status IN ('active','consumed','expired','discarded')),
        "source"          VARCHAR(20)    NOT NULL DEFAULT 'manual'
          CHECK (source IN ('ocr','manual','digital')),
        "receipt_item_id" UUID,
        "created_at"      TIMESTAMPTZ    NOT NULL DEFAULT now(),
        "updated_at"      TIMESTAMPTZ    NOT NULL DEFAULT now(),
        CONSTRAINT "pk_ingredients" PRIMARY KEY ("id"),
        CONSTRAINT "chk_ingredients_frozen"
          CHECK (is_frozen = false OR (is_frozen = true AND frozen_at IS NOT NULL)),
        CONSTRAINT "chk_ingredients_expiry"
          CHECK (expiry_date >= purchase_date),
        CONSTRAINT "fk_ingredients_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_ingredients_category"
          FOREIGN KEY ("category_id") REFERENCES "ingredient_categories"("id")
      )
    `)

    // receipts
    await queryRunner.query(`
      CREATE TABLE "receipts" (
        "id"            UUID         NOT NULL DEFAULT gen_random_uuid(),
        "user_id"       UUID         NOT NULL,
        "image_url"     VARCHAR(500) NOT NULL,
        "ocr_raw_text"  TEXT,
        "status"        VARCHAR(20)  NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending','processing','completed','failed')),
        "error_message" TEXT,
        "scanned_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "completed_at"  TIMESTAMPTZ,
        CONSTRAINT "pk_receipts" PRIMARY KEY ("id"),
        CONSTRAINT "fk_receipts_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    // receipt_items
    await queryRunner.query(`
      CREATE TABLE "receipt_items" (
        "id"               UUID         NOT NULL DEFAULT gen_random_uuid(),
        "receipt_id"       UUID         NOT NULL,
        "raw_name"         VARCHAR(200) NOT NULL,
        "normalized_name"  VARCHAR(100),
        "quantity"         NUMERIC(8,2) NOT NULL DEFAULT 1,
        "unit"             VARCHAR(20)  NOT NULL DEFAULT '개',
        "is_confirmed"     BOOLEAN      NOT NULL DEFAULT false,
        "ingredient_id"    UUID,
        "created_at"       TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "pk_receipt_items" PRIMARY KEY ("id"),
        CONSTRAINT "fk_receipt_items_receipt"
          FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE
      )
    `)

    // recipes
    await queryRunner.query(`
      CREATE TABLE "recipes" (
        "id"                UUID         NOT NULL DEFAULT gen_random_uuid(),
        "external_id"       VARCHAR(100) NOT NULL,
        "source"            VARCHAR(30)  NOT NULL CHECK (source IN ('mangae','youtube','gpt')),
        "title"             VARCHAR(200) NOT NULL,
        "servings"          SMALLINT     NOT NULL DEFAULT 1 CHECK (servings >= 1),
        "cook_time_minutes" SMALLINT     CHECK (cook_time_minutes > 0),
        "thumbnail_url"     VARCHAR(500),
        "source_url"        VARCHAR(500),
        "youtube_url"       VARCHAR(500),
        "description"       TEXT,
        "cached_at"         TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "expires_at"        TIMESTAMPTZ  NOT NULL,
        CONSTRAINT "pk_recipes" PRIMARY KEY ("id"),
        CONSTRAINT "uq_recipes_external_id" UNIQUE ("external_id")
      )
    `)

    // recipe_ingredients
    await queryRunner.query(`
      CREATE TABLE "recipe_ingredients" (
        "id"              UUID         NOT NULL DEFAULT gen_random_uuid(),
        "recipe_id"       UUID         NOT NULL,
        "ingredient_name" VARCHAR(100) NOT NULL,
        "quantity"        NUMERIC(8,2) NOT NULL,
        "unit"            VARCHAR(20)  NOT NULL,
        "is_optional"     BOOLEAN      NOT NULL DEFAULT false,
        "is_seasoning"    BOOLEAN      NOT NULL DEFAULT false,
        CONSTRAINT "pk_recipe_ingredients" PRIMARY KEY ("id"),
        CONSTRAINT "fk_recipe_ingredients_recipe"
          FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE
      )
    `)

    // notification_settings
    await queryRunner.query(`
      CREATE TABLE "notification_settings" (
        "id"                       UUID         NOT NULL DEFAULT gen_random_uuid(),
        "user_id"                  UUID         NOT NULL,
        "web_push_enabled"         BOOLEAN      NOT NULL DEFAULT false,
        "web_push_token"           VARCHAR(500),
        "discord_enabled"          BOOLEAN      NOT NULL DEFAULT false,
        "discord_webhook_url_enc"  TEXT,
        "slack_enabled"            BOOLEAN      NOT NULL DEFAULT false,
        "slack_webhook_url_enc"    TEXT,
        "notify_time"              TIME         NOT NULL DEFAULT '09:00:00',
        "lead_days_override"       SMALLINT     CHECK (lead_days_override > 0),
        "created_at"               TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at"               TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "pk_notification_settings" PRIMARY KEY ("id"),
        CONSTRAINT "uq_notification_settings_user" UNIQUE ("user_id"),
        CONSTRAINT "chk_notification_web_push"
          CHECK (web_push_enabled = false OR web_push_token IS NOT NULL),
        CONSTRAINT "chk_notification_discord"
          CHECK (discord_enabled = false OR discord_webhook_url_enc IS NOT NULL),
        CONSTRAINT "chk_notification_slack"
          CHECK (slack_enabled = false OR slack_webhook_url_enc IS NOT NULL),
        CONSTRAINT "fk_notification_settings_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    // notification_logs
    await queryRunner.query(`
      CREATE TABLE "notification_logs" (
        "id"              UUID         NOT NULL DEFAULT gen_random_uuid(),
        "user_id"         UUID         NOT NULL,
        "ingredient_id"   UUID,
        "channel"         VARCHAR(20)  NOT NULL CHECK (channel IN ('web_push','discord','slack')),
        "message"         TEXT         NOT NULL,
        "status"          VARCHAR(20)  NOT NULL DEFAULT 'sent'
          CHECK (status IN ('sent','failed','retrying')),
        "error_message"   TEXT,
        "sent_at"         TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "retry_count"     SMALLINT     NOT NULL DEFAULT 0,
        CONSTRAINT "pk_notification_logs" PRIMARY KEY ("id"),
        CONSTRAINT "fk_notification_logs_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    // shopping_lists
    await queryRunner.query(`
      CREATE TABLE "shopping_lists" (
        "id"           UUID        NOT NULL DEFAULT gen_random_uuid(),
        "user_id"      UUID        NOT NULL,
        "is_active"    BOOLEAN     NOT NULL DEFAULT true,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "completed_at" TIMESTAMPTZ,
        CONSTRAINT "pk_shopping_lists" PRIMARY KEY ("id"),
        CONSTRAINT "fk_shopping_lists_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_shopping_lists_active_user"
        ON "shopping_lists" ("user_id")
        WHERE is_active = true
    `)

    // shopping_list_items
    await queryRunner.query(`
      CREATE TABLE "shopping_list_items" (
        "id"               UUID         NOT NULL DEFAULT gen_random_uuid(),
        "shopping_list_id" UUID         NOT NULL,
        "ingredient_name"  VARCHAR(100) NOT NULL,
        "quantity"         NUMERIC(8,2) NOT NULL CHECK (quantity > 0),
        "unit"             VARCHAR(20)  NOT NULL,
        "is_small_package" BOOLEAN      NOT NULL DEFAULT true,
        "commerce_url"     VARCHAR(500),
        "commerce_platform" VARCHAR(30) CHECK (commerce_platform IN ('coupang','kurly','bmart')),
        "source"           VARCHAR(20)  NOT NULL DEFAULT 'auto'
          CHECK (source IN ('auto','manual')),
        "is_purchased"     BOOLEAN      NOT NULL DEFAULT false,
        "created_at"       TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "pk_shopping_list_items" PRIMARY KEY ("id"),
        CONSTRAINT "fk_shopping_list_items_list"
          FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_lists"("id") ON DELETE CASCADE
      )
    `)

    // cooking_logs
    await queryRunner.query(`
      CREATE TABLE "cooking_logs" (
        "id"              UUID        NOT NULL DEFAULT gen_random_uuid(),
        "user_id"         UUID        NOT NULL,
        "recipe_id"       UUID,
        "servings_cooked" SMALLINT    NOT NULL DEFAULT 1 CHECK (servings_cooked >= 1),
        "cooked_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_cooking_logs" PRIMARY KEY ("id"),
        CONSTRAINT "fk_cooking_logs_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    // cooking_log_items
    await queryRunner.query(`
      CREATE TABLE "cooking_log_items" (
        "id"              UUID         NOT NULL DEFAULT gen_random_uuid(),
        "cooking_log_id"  UUID         NOT NULL,
        "ingredient_id"   UUID,
        "ingredient_name" VARCHAR(100) NOT NULL,
        "quantity_used"   NUMERIC(8,2) NOT NULL CHECK (quantity_used > 0),
        "unit"            VARCHAR(20)  NOT NULL,
        CONSTRAINT "pk_cooking_log_items" PRIMARY KEY ("id"),
        CONSTRAINT "fk_cooking_log_items_log"
          FOREIGN KEY ("cooking_log_id") REFERENCES "cooking_logs"("id") ON DELETE CASCADE
      )
    `)

    // ── 인덱스 ─────────────────────────────────────────────
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email")`)
    await queryRunner.query(
      `CREATE INDEX "idx_users_deleted_at" ON "users" ("deleted_at") WHERE deleted_at IS NULL`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_ingredients_user_status_expiry" ON "ingredients" ("user_id","status","expiry_date") WHERE status = 'active'`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_ingredients_expiry_status" ON "ingredients" ("expiry_date","status") WHERE status = 'active'`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_receipts_user_scanned" ON "receipts" ("user_id","scanned_at" DESC)`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_recipe_ingredients_name" ON "recipe_ingredients" ("ingredient_name")`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_notification_settings_notify_time" ON "notification_settings" ("notify_time") WHERE web_push_enabled = true OR discord_enabled = true OR slack_enabled = true`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_cooking_logs_user_cooked_at" ON "cooking_logs" ("user_id","cooked_at" DESC)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "cooking_log_items" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "cooking_logs" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "shopping_list_items" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "shopping_lists" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "notification_logs" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "notification_settings" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "recipe_ingredients" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "recipes" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "receipt_items" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "receipts" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "ingredients" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "ingredient_categories" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`)
    await queryRunner.query(`DROP EXTENSION IF EXISTS pgcrypto`)
  }
}
