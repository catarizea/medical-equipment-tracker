alter table "public"."patient_contact"
           add constraint "patient_contact_patient_id_fkey"
           foreign key ("patient_id")
           references "public"."patient"
           ("id") on update restrict on delete restrict;
