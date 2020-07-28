alter table "public"."patient_inventory"
           add constraint "patient_inventory_allocated_by_fkey"
           foreign key ("allocated_by")
           references "public"."personnel"
           ("id") on update restrict on delete restrict;
