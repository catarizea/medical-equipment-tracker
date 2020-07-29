ALTER TABLE "public"."patient_admission" ADD COLUMN "transferred_at" timestamptz;
ALTER TABLE "public"."patient_admission" ALTER COLUMN "transferred_at" DROP NOT NULL;
