-- RSI Siti Hajar Mataram Hospital Application Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for application-specific values
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');

-- Create users table to store user information linked to Clerk Auth
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- Clerk Auth user ID (sub)
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role user_role DEFAULT 'patient',
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table to store doctor information
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE, -- Reference to users table for doctor accounts
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  experience_years INTEGER,
  education TEXT,
  certifications TEXT[],
  consultation_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table for doctor availability
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- Specific date in YYYY-MM-DD format
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table for booking system
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id TEXT NOT NULL,  -- Clerk Auth ID
  doctor_id UUID REFERENCES public.doctors(id),
  schedule_id UUID REFERENCES public.schedules(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status DEFAULT 'pending',
  notes TEXT,
  consultation_type TEXT CHECK (consultation_type IN ('online', 'offline')), -- online or offline consultation
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table for health information and news
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  image_url TEXT,
  category TEXT,
  author_id TEXT, -- Clerk user ID of the author (admin)
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table for health services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT, -- e.g., 'instalasi', 'unggulan'
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  contact_info TEXT,
  location TEXT,
  operating_hours TEXT,
  features TEXT[],
  reviews TEXT[], -- Storing review data as JSON
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table for AI assistant
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk Auth ID
  messages JSONB DEFAULT '[]',
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table for frequently asked questions
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  priority INTEGER DEFAULT 0, -- For ordering
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_listings table for job opportunities
CREATE TABLE IF NOT EXISTS public.job_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  description TEXT,
  requirements TEXT[],
  salary_range TEXT,
  location TEXT,
  employment_type employment_type,
  status TEXT CHECK (status IN ('active', 'filled', 'cancelled')) DEFAULT 'active',
  application_deadline DATE,
  deleted_at TIMESTAMP WITH TIME ZONE NULL, -- For soft deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for doctors table
CREATE POLICY "Service role can manage all doctors" ON public.doctors
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage all doctors" ON public.doctors
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

-- RLS Policies for appointments table
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.jwt() ->> 'sub' = patient_id);

CREATE POLICY "Users can create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = patient_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (auth.jwt() ->> 'sub' = patient_id);

CREATE POLICY "Users can delete own appointments" ON public.appointments
  FOR DELETE USING (auth.jwt() ->> 'sub' = patient_id);

-- RLS Policies for chat_sessions table
CREATE POLICY "Users can access own chat sessions" ON public.chat_sessions
  FOR ALL USING (auth.jwt() ->> 'sub' = user_id);

-- Admin policies (for users with admin role)
CREATE POLICY "Admin can manage all data" ON public.users
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

CREATE POLICY "Admin can manage all appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

CREATE POLICY "Admin can manage all articles" ON public.articles
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

CREATE POLICY "Admin can manage all services" ON public.services
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

CREATE POLICY "Public can view all services" ON public.services
  FOR SELECT TO authenticated, anon
  USING (
    deleted_at IS NULL
  );

CREATE POLICY "Admin can manage all FAQs" ON public.faqs
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

CREATE POLICY "Admin can manage all job listings" ON public.job_listings
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

-- Doctor-specific policies
CREATE POLICY "Doctors can view their appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'doctor'
    AND doctor_id IN (
      SELECT d.id FROM public.doctors d 
      WHERE d.id = appointments.doctor_id
    )
  );

-- Additional policies for schedules table
CREATE POLICY "Service role can manage all schedules" ON public.schedules
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage all schedules" ON public.schedules
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_id ON public.schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON public.schedules(date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();