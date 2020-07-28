CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."patient_admission"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "patient_id" uuid NOT NULL, "admited_at" Timestamp NOT NULL, "admited_by" uuid NOT NULL, "discharged_at" timestamptz NOT NULL, "discharged_by" uuid NOT NULL, "reference_doctor" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("reference_doctor") REFERENCES "public"."personnel"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));