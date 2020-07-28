CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."patient_contacts"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "first_name" text NOT NULL, "last_name" text NOT NULL, "phone" text NOT NULL, "email" text, PRIMARY KEY ("id") , UNIQUE ("id"));
