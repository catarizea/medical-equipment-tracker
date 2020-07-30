alter table "public"."inventory_movement" drop constraint "inventory_movement_patient_id_fkey",
             add constraint "inventory_movement_patient_admission_id_fkey"
             foreign key ("patient_admission_id")
             references "public"."patient_admission"
             ("id") on update restrict on delete restrict;
