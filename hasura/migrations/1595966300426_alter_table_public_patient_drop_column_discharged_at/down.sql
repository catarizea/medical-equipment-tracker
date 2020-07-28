ALTER TABLE "public"."patient" ADD COLUMN "discharged_at" timestamptz;
ALTER TABLE "public"."patient" ALTER COLUMN "discharged_at" DROP NOT NULL;
