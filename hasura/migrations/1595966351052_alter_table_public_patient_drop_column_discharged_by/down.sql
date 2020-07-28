ALTER TABLE "public"."patient" ADD COLUMN "discharged_by" uuid;
ALTER TABLE "public"."patient" ALTER COLUMN "discharged_by" DROP NOT NULL;
