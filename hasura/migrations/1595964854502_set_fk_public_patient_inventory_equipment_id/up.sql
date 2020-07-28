alter table "public"."patient_inventory"
           add constraint "patient_inventory_equipment_id_fkey"
           foreign key ("equipment_id")
           references "public"."equipment"
           ("id") on update restrict on delete restrict;
