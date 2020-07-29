CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."equipment_maintenance"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "equipment_id" uuid NOT NULL, "type" integer NOT NULL DEFAULT 1, "started_at" timestamptz NOT NULL, "finished_at" timestamptz, "done_internally" boolean NOT NULL DEFAULT true, "issue" text NOT NULL, "solution" text, "comment" text, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "handled_by" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("handled_by") REFERENCES "public"."personnel"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_equipment_maintenance_updated_at"
BEFORE UPDATE ON "public"."equipment_maintenance"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_equipment_maintenance_updated_at" ON "public"."equipment_maintenance" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
