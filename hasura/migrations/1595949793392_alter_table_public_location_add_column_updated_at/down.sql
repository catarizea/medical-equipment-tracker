DROP TRIGGER IF EXISTS "set_public_location_updated_at" ON "public"."location";
ALTER TABLE "public"."location" DROP COLUMN "updated_at";
