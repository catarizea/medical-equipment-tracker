ALTER TABLE "public"."patient" ADD COLUMN "admited_by" uuid;
ALTER TABLE "public"."patient" ALTER COLUMN "admited_by" DROP NOT NULL;
