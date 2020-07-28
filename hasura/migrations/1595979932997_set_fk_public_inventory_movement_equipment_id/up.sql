alter table "public"."inventory_movement"
           add constraint "inventory_movement_equipment_id_fkey"
           foreign key ("equipment_id")
           references "public"."equipment"
           ("id") on update restrict on delete restrict;
