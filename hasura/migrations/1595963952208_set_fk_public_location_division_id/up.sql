alter table "public"."location"
           add constraint "location_division_id_fkey"
           foreign key ("division_id")
           references "public"."division"
           ("id") on update restrict on delete restrict;
