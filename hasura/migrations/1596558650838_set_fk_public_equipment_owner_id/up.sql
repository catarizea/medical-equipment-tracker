alter table "public"."equipment"
           add constraint "equipment_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."personnel"
           ("id") on update restrict on delete restrict;
