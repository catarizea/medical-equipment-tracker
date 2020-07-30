alter table "public"."personnel"
           add constraint "personnel_position_id_fkey"
           foreign key ("position_id")
           references "public"."position"
           ("id") on update restrict on delete restrict;
