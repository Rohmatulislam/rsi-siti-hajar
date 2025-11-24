-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.about_content (
  id bigint NOT NULL DEFAULT 1,
  history text,
  visi text,
  misi jsonb DEFAULT '[]'::jsonb,
  values jsonb DEFAULT '[]'::jsonb,
  commitment text,
  image_url text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT about_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.appointment_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  booking_payload jsonb DEFAULT '{}'::jsonb,
  payment_info jsonb DEFAULT '{}'::jsonb,
  insurance_info jsonb DEFAULT '{}'::jsonb,
  patient_notes text,
  internal_notes text,
  simrs_booking_id text,
  simrs_sync_status text CHECK (simrs_sync_status = ANY (ARRAY['pending'::text, 'synced'::text, 'failed'::text])),
  simrs_last_attempt timestamp with time zone,
  simrs_payload jsonb DEFAULT '{}'::jsonb,
  simrs_response jsonb DEFAULT '{}'::jsonb,
  retry_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT appointment_details_pkey PRIMARY KEY (id),
  CONSTRAINT appointment_details_appointment_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid,
  schedule_id uuid,
  appointment_date date NOT NULL,
  appointment_time time without time zone NOT NULL,
  status USER-DEFINED DEFAULT 'pending'::appointment_status,
  notes text,
  consultation_type text CHECK (consultation_type = ANY (ARRAY['online'::text, 'offline'::text])),
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  patient_id uuid NOT NULL,
  queue_number text,
  location text,
  fee numeric,
  duration_minutes integer,
  location_type text,
  location_details text,
  doctor_name text,
  department text,
  notes_internal text,
  notes_patient text,
  reminder_sent_at timestamp with time zone,
  created_by uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  cancelled_at timestamp with time zone,
  cancel_reason text,
  appointment_code text,
  patient_nik character varying,
  patient_user_id uuid,
  no_reg text,
  is_executive boolean,
  kd_dokter text,
  jam_reg time without time zone,
  tgl_registrasi date,
  stts text,
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT appointments_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id),
  CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient_profiles(id),
  CONSTRAINT fk_appointments_created_by_users FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.article_categories (
  article_id uuid NOT NULL,
  category_id uuid NOT NULL,
  CONSTRAINT article_categories_pkey PRIMARY KEY (article_id, category_id),
  CONSTRAINT article_categories_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id),
  CONSTRAINT article_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  image_url text,
  category text,
  author_id text,
  excerpt text,
  published boolean DEFAULT false,
  published_at timestamp with time zone,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.doctors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text UNIQUE,
  name text NOT NULL,
  specialty text NOT NULL,
  image_url text,
  description text,
  experience_years integer,
  education text,
  certifications ARRAY,
  consultation_fee numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  slug text UNIQUE,
  kd_dokter text UNIQUE,
  is_executive boolean,
  sip_number text,
  specialization text,
  bpjs boolean DEFAULT false,
  sip text,
  CONSTRAINT doctors_pkey PRIMARY KEY (id)
);
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  priority integer DEFAULT 0,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.founders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  role text,
  description text,
  photo_url text,
  parent_id bigint,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT founders_pkey PRIMARY KEY (id),
  CONSTRAINT founders_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.founders(id)
);
CREATE TABLE public.job_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  description text,
  requirements ARRAY,
  salary_range text,
  location text,
  employment_type USER-DEFINED,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'filled'::text, 'cancelled'::text])),
  application_deadline date,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT job_listings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lab_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  appointment_id uuid,
  test_type text NOT NULL,
  test_date date NOT NULL,
  results jsonb NOT NULL,
  notes text,
  status text DEFAULT 'completed'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lab_results_pkey PRIMARY KEY (id),
  CONSTRAINT lab_results_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient_profiles(id),
  CONSTRAINT lab_results_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.medical_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  appointment_id uuid,
  date date NOT NULL,
  diagnosis text NOT NULL,
  treatment text,
  notes text,
  prescription ARRAY,
  vital_signs jsonb,
  follow_up_date date,
  status text DEFAULT 'completed'::text CHECK (status = ANY (ARRAY['completed'::text, 'in-progress'::text, 'scheduled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT medical_records_pkey PRIMARY KEY (id),
  CONSTRAINT medical_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient_profiles(id),
  CONSTRAINT medical_records_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT medical_records_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.patient_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  birth_date date,
  gender text CHECK (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text])),
  phone text,
  address text,
  blood_type text,
  emergency_contact jsonb,
  nik character varying UNIQUE CHECK (nik::text ~ '^[0-9]{16}$'::text),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL,
  no_rkm_medis text UNIQUE,
  no_ktp text,
  email text,
  marital_status text,
  occupation text,
  religion text,
  CONSTRAINT patient_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_patient_profiles_user_id FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.radiology_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  appointment_id uuid,
  examination_type text NOT NULL,
  examination_date date NOT NULL,
  findings text NOT NULL,
  conclusion text NOT NULL,
  images ARRAY,
  status text DEFAULT 'completed'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT radiology_results_pkey PRIMARY KEY (id),
  CONSTRAINT radiology_results_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient_profiles(id),
  CONSTRAINT radiology_results_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id)
);
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_number text NOT NULL UNIQUE,
  room_type USER-DEFINED NOT NULL,
  status USER-DEFINED DEFAULT 'tersedia'::room_status,
  floor integer,
  capacity integer DEFAULT 1,
  price_per_day numeric,
  facilities ARRAY,
  description text,
  image_url text,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rooms_pkey PRIMARY KEY (id)
);
CREATE TABLE public.schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid,
  date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_executive boolean,
  day_of_week text,
  quota integer,
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT fk_schedules_doctor_id FOREIGN KEY (doctor_id) REFERENCES public.doctors(id)
);
CREATE TABLE public.service_categories (
  service_id uuid NOT NULL,
  category_id uuid NOT NULL,
  CONSTRAINT service_categories_pkey PRIMARY KEY (service_id, category_id),
  CONSTRAINT service_categories_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT service_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.service_doctors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_doctors_pkey PRIMARY KEY (id),
  CONSTRAINT service_doctors_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT service_doctors_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category text,
  title text NOT NULL,
  description text,
  image_url text,
  contact_info text,
  location text,
  operating_hours text,
  features ARRAY DEFAULT '{}'::text[],
  reviews ARRAY DEFAULT '{}'::text[],
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  full_name text,
  email text UNIQUE,
  phone text,
  role USER-DEFINED DEFAULT 'patient'::user_role,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);