ALTER TABLE "public"."patient_admission" ADD COLUMN "is_transferred" bool;
ALTER TABLE "public"."patient_admission" ALTER COLUMN "is_transferred" DROP NOT NULL;
ALTER TABLE "public"."patient_admission" ALTER COLUMN "is_transferred" SET DEFAULT false;
