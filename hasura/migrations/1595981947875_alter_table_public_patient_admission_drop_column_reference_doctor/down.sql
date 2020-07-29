ALTER TABLE "public"."patient_admission" ADD COLUMN "reference_doctor" uuid;
ALTER TABLE "public"."patient_admission" ALTER COLUMN "reference_doctor" DROP NOT NULL;
ALTER TABLE "public"."patient_admission" ADD CONSTRAINT patient_admission_reference_doctor_fkey FOREIGN KEY (reference_doctor) REFERENCES "public"."personnel" (id) ON DELETE restrict ON UPDATE restrict;
