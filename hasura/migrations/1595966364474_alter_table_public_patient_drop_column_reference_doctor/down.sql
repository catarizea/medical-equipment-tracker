ALTER TABLE "public"."patient" ADD COLUMN "reference_doctor" uuid;
ALTER TABLE "public"."patient" ALTER COLUMN "reference_doctor" DROP NOT NULL;
ALTER TABLE "public"."patient" ADD CONSTRAINT patient_reference_doctor_fkey FOREIGN KEY (reference_doctor) REFERENCES "public"."personnel" (id) ON DELETE restrict ON UPDATE restrict;
