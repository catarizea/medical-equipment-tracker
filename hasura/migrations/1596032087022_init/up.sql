CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.division (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    manager_id uuid
);
CREATE TABLE public.equipment (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    inventory_system_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    owner_id uuid NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    retired_at timestamp with time zone,
    retired_by uuid,
    comment text,
    has_everything boolean DEFAULT true NOT NULL
);
CREATE TABLE public.equipment_maintenance (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    equipment_id uuid NOT NULL,
    type integer DEFAULT 1 NOT NULL,
    started_at timestamp with time zone NOT NULL,
    finished_at timestamp with time zone,
    done_internally boolean DEFAULT true NOT NULL,
    issue text NOT NULL,
    solution text,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    handled_by uuid NOT NULL
);
CREATE TABLE public.equipment_movement (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    equipment_id uuid NOT NULL,
    location_id uuid NOT NULL,
    moved_by uuid NOT NULL,
    movement_type integer DEFAULT 1 NOT NULL,
    moved_at timestamp with time zone NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    comment text NOT NULL
);
CREATE TABLE public.inventory (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    inventory_system_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    unit text NOT NULL,
    comment text
);
CREATE TABLE public.inventory_movement (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    movement_type integer DEFAULT 1 NOT NULL,
    location_id uuid NOT NULL,
    inventory_id uuid NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    moved_at timestamp with time zone NOT NULL,
    moved_by uuid NOT NULL,
    comment text,
    patient_id uuid,
    equipment_id uuid
);
CREATE TABLE public.location (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    division_id uuid NOT NULL,
    manager_id uuid NOT NULL,
    comment text
);
CREATE TABLE public.patient (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birthday date NOT NULL,
    gender boolean NOT NULL,
    identity_card_ssn text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    address text,
    occupation text,
    guardian_name text,
    is_anonymous boolean DEFAULT false NOT NULL,
    comment text
);
CREATE TABLE public.patient_admission (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    patient_id uuid NOT NULL,
    admited_at timestamp with time zone NOT NULL,
    admited_by uuid NOT NULL,
    discharged_at timestamp with time zone,
    discharged_by uuid,
    comment text
);
CREATE TABLE public.patient_contact (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    email text,
    patient_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    related_how text NOT NULL
);
CREATE TABLE public.patient_movement (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    patient_admission_id uuid NOT NULL,
    movement_type integer DEFAULT 1 NOT NULL,
    moved_at timestamp with time zone NOT NULL,
    moved_by uuid NOT NULL,
    location_id uuid NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    reference_doctor uuid NOT NULL,
    patient_id uuid NOT NULL,
    deceased_at_location boolean DEFAULT false NOT NULL,
    deceased_at timestamp with time zone
);
CREATE TABLE public.personnel (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    "position" text NOT NULL,
    title text,
    authentication_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    phone text,
    is_employed boolean DEFAULT true NOT NULL,
    division_id uuid NOT NULL,
    employed_at date NOT NULL,
    cancellation_at date,
    superior_id uuid,
    comment text
);
ALTER TABLE ONLY public.division
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.equipment_maintenance
    ADD CONSTRAINT equipment_maintenance_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.equipment_movement
    ADD CONSTRAINT equipment_movement_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_id_key UNIQUE (id);
ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_inventory_system_id_key UNIQUE (inventory_system_id);
ALTER TABLE ONLY public.inventory_movement
    ADD CONSTRAINT inventory_movement_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.patient_admission
    ADD CONSTRAINT patient_admission_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.patient_contact
    ADD CONSTRAINT patient_contact_patient_id_key UNIQUE (patient_id);
ALTER TABLE ONLY public.patient_contact
    ADD CONSTRAINT patient_contacts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_identity_card_ssn_key UNIQUE (identity_card_ssn);
ALTER TABLE ONLY public.patient_movement
    ADD CONSTRAINT patient_movement_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_authentication_id_key UNIQUE (authentication_id);
ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_id_key UNIQUE (id);
ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_pkey PRIMARY KEY (id, authentication_id);
CREATE TRIGGER set_public_division_updated_at BEFORE UPDATE ON public.division FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_division_updated_at ON public.division IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_equipment_maintenance_updated_at BEFORE UPDATE ON public.equipment_maintenance FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_equipment_maintenance_updated_at ON public.equipment_maintenance IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_equipment_movement_updated_at BEFORE UPDATE ON public.equipment_movement FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_equipment_movement_updated_at ON public.equipment_movement IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_equipment_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_equipment_updated_at ON public.equipment IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_inventory_movement_updated_at BEFORE UPDATE ON public.inventory_movement FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_inventory_movement_updated_at ON public.inventory_movement IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_inventory_updated_at ON public.inventory IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_location_updated_at BEFORE UPDATE ON public.location FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_location_updated_at ON public.location IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_patient_contact_updated_at BEFORE UPDATE ON public.patient_contact FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_patient_contact_updated_at ON public.patient_contact IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_patient_movement_updated_at BEFORE UPDATE ON public.patient_movement FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_patient_movement_updated_at ON public.patient_movement IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_patient_updated_at BEFORE UPDATE ON public.patient FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_patient_updated_at ON public.patient IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_personnel_updated_at BEFORE UPDATE ON public.personnel FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_personnel_updated_at ON public.personnel IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.equipment_maintenance
    ADD CONSTRAINT equipment_maintenance_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.equipment_maintenance
    ADD CONSTRAINT equipment_maintenance_handled_by_fkey FOREIGN KEY (handled_by) REFERENCES public.personnel(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.equipment_movement
    ADD CONSTRAINT equipment_movement_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.equipment_movement
    ADD CONSTRAINT equipment_movement_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.equipment_movement
    ADD CONSTRAINT equipment_movement_moved_by_fkey FOREIGN KEY (moved_by) REFERENCES public.personnel(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_movement
    ADD CONSTRAINT inventory_movement_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_movement
    ADD CONSTRAINT inventory_movement_inventory_id_fkey FOREIGN KEY (inventory_id) REFERENCES public.inventory(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_movement
    ADD CONSTRAINT inventory_movement_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_movement
    ADD CONSTRAINT inventory_movement_moved_by_fkey FOREIGN KEY (moved_by) REFERENCES public.personnel(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.inventory_movement
    ADD CONSTRAINT inventory_movement_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.division(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.patient_admission
    ADD CONSTRAINT patient_admission_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.patient_contact
    ADD CONSTRAINT patient_contact_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.patient_movement
    ADD CONSTRAINT patient_movement_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.patient_movement
    ADD CONSTRAINT patient_movement_moved_by_fkey FOREIGN KEY (moved_by) REFERENCES public.personnel(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.patient_movement
    ADD CONSTRAINT patient_movement_patient_admission_id_fkey FOREIGN KEY (patient_admission_id) REFERENCES public.patient_admission(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.division(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
