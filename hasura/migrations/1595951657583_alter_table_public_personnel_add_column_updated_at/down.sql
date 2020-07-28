DROP TRIGGER IF EXISTS "set_public_personnel_updated_at" ON "public"."personnel";
ALTER TABLE "public"."personnel" DROP COLUMN "updated_at";
