ALTER TABLE "public"."patient" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now();
