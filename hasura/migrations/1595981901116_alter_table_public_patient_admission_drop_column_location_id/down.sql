ALTER TABLE "public"."patient_admission" ADD COLUMN "location_id" uuid;
ALTER TABLE "public"."patient_admission" ALTER COLUMN "location_id" DROP NOT NULL;
