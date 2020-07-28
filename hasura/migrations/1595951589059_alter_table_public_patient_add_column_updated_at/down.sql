DROP TRIGGER IF EXISTS "set_public_patient_updated_at" ON "public"."patient";
ALTER TABLE "public"."patient" DROP COLUMN "updated_at";
