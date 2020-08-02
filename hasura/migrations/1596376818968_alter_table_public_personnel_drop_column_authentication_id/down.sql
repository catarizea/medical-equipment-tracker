ALTER TABLE "public"."personnel" ADD COLUMN "authentication_id" int4;
ALTER TABLE "public"."personnel" ALTER COLUMN "authentication_id" DROP NOT NULL;
ALTER TABLE "public"."personnel" ADD CONSTRAINT personnel_authentication_id_key UNIQUE (authentication_id);
