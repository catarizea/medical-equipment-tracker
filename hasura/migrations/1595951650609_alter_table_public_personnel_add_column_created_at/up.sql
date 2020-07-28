ALTER TABLE "public"."personnel" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now();
