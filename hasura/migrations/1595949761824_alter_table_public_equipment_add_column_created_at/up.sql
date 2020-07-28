ALTER TABLE "public"."equipment" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();
