alter table "public"."inventory" drop constraint "inventory_pkey";
alter table "public"."inventory"
    add constraint "inventory_pkey" 
    primary key ( "inventory_system_id", "id" );
