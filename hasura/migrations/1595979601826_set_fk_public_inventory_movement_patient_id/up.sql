alter table "public"."inventory_movement"
           add constraint "inventory_movement_patient_id_fkey"
           foreign key ("patient_id")
           references "public"."patient"
           ("id") on update restrict on delete restrict;
