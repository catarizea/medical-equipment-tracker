DROP TRIGGER IF EXISTS "set_public_patient_contact_updated_at" ON "public"."patient_contact";
ALTER TABLE "public"."patient_contact" DROP COLUMN "updated_at";
