alter table "public"."division"
           add constraint "division_manager_id_fkey"
           foreign key ("manager_id")
           references "public"."personnel"
           ("id") on update restrict on delete restrict;
