ALTER TABLE "public"."personnel" ADD COLUMN "position" text;
ALTER TABLE "public"."personnel" ALTER COLUMN "position" DROP NOT NULL;
