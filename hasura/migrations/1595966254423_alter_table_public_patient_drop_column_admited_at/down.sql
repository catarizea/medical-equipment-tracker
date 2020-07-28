ALTER TABLE "public"."patient" ADD COLUMN "admited_at" timestamptz;
ALTER TABLE "public"."patient" ALTER COLUMN "admited_at" DROP NOT NULL;
