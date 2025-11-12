-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id text NOT NULL,
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
  CONSTRAINT appointments_pkey PRIMARY KEY (id),
  CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id),
  CONSTRAINT appointments_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id)
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
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id)
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