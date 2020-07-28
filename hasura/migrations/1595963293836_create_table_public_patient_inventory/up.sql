CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."patient_inventory"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "allocated_at" Date NOT NULL, "allocated_by" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT 1, "inventory_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_patient_inventory_updated_at"
BEFORE UPDATE ON "public"."patient_inventory"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_patient_inventory_updated_at" ON "public"."patient_inventory" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
