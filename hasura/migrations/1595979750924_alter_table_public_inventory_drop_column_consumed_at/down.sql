ALTER TABLE "public"."inventory" ADD COLUMN "consumed_at" timestamptz;
ALTER TABLE "public"."inventory" ALTER COLUMN "consumed_at" DROP NOT NULL;
