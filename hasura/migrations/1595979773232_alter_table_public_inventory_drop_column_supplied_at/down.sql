ALTER TABLE "public"."inventory" ADD COLUMN "supplied_at" timestamptz;
ALTER TABLE "public"."inventory" ALTER COLUMN "supplied_at" DROP NOT NULL;
