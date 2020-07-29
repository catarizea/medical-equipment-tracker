ALTER TABLE "public"."equipment" ADD COLUMN "owner_location_id" uuid;
ALTER TABLE "public"."equipment" ALTER COLUMN "owner_location_id" DROP NOT NULL;
