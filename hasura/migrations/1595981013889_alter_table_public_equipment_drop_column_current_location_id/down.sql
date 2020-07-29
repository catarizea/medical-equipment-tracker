ALTER TABLE "public"."equipment" ADD COLUMN "current_location_id" uuid;
ALTER TABLE "public"."equipment" ALTER COLUMN "current_location_id" DROP NOT NULL;
