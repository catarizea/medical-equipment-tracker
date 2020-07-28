alter table "public"."patient"
           add constraint "patient_reference_doctor_fkey"
           foreign key ("reference_doctor")
           references "public"."personnel"
           ("id") on update restrict on delete restrict;
