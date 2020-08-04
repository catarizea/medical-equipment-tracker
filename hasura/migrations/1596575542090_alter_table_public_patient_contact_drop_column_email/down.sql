ALTER TABLE "public"."patient_contact" ADD COLUMN "email" text;
ALTER TABLE "public"."patient_contact" ALTER COLUMN "email" DROP NOT NULL;
