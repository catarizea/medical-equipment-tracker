ALTER TABLE "public"."patient_contact" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now();
