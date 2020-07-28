ALTER TABLE "public"."inventory" ADD COLUMN "current_location_id" uuid;
ALTER TABLE "public"."inventory" ALTER COLUMN "current_location_id" DROP NOT NULL;
