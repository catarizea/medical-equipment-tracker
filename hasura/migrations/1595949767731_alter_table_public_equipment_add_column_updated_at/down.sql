DROP TRIGGER IF EXISTS "set_public_equipment_updated_at" ON "public"."equipment";
ALTER TABLE "public"."equipment" DROP COLUMN "updated_at";
