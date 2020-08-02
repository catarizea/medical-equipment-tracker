alter table "public"."personnel" drop constraint "personnel_pkey";
alter table "public"."personnel"
    add constraint "personnel_pkey" 
    primary key ( "authentication_id", "id" );
