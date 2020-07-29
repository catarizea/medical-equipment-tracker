CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."patient_movement"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "patient_admission_id" uuid NOT NULL, "movement_type" integer NOT NULL DEFAULT 1, "moved_at" timestamptz NOT NULL, "moved_by" uuid NOT NULL, "location_id" uuid NOT NULL, "comment" text, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "is_locked" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("patient_admission_id") REFERENCES "public"."patient_admission"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("moved_by") REFERENCES "public"."personnel"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_patient_movement_updated_at"
BEFORE UPDATE ON "public"."patient_movement"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_patient_movement_updated_at" ON "public"."patient_movement" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
