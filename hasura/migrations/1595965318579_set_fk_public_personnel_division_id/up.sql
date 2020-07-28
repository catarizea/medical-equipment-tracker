alter table "public"."personnel"
           add constraint "personnel_division_id_fkey"
           foreign key ("division_id")
           references "public"."division"
           ("id") on update restrict on delete restrict;
