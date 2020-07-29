ALTER TABLE "public"."equipment" ADD COLUMN "current_user_id" uuid;
ALTER TABLE "public"."equipment" ALTER COLUMN "current_user_id" DROP NOT NULL;
