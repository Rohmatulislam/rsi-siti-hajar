// File tipe data untuk modul admin

export interface User {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: 'patient' | 'doctor' | 'admin';
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  hospital: string;
  id: string;
  user_id: string | null;
  name: string;
  specialty: string;
  image_url: string | null;
  description: string | null;
  experience_years: number | null;
  education: string | null;
  certifications: string[] | null;
  consultation_fee: number | null;
  clinic_address: string | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
  // Kolom tambahan untuk sistem Poli Eksekutif
  is_executive?: boolean;
  kd_dokter?: string;  // Kode dokter dari SIMRS Khanza
  sip?: string;        // Surat Izin Praktik
  bpjs?: boolean;
}

export interface Schedule {
  id: string;
  doctor_id: string;
  date: string;  // Changed from day_of_week to date to store specific date in YYYY-MM-DD format
  start_time: string;
  end_time: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  max_patients?: number;  // Jumlah maksimal pasien yang bisa mendaftar
  current_patients?: number;  // Jumlah pasien yang sudah mendaftar
  doctors?: {
    name: string;
    specialty: string;
  };
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'scheduled' | 'in-progress' | 'arrived';
  notes: string | null;
  consultation_type: 'online' | 'offline';
  location: string;
  fee: number;
  queue_number: string;
  created_at: string;
  updated_at: string;
  doctors?: {
    name: string;
    specialty: string;
    image_url: string | null;
  };
  users?: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  category: string | null;
  author_id: string | null;
  excerpt: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category: string | null;
  title: string;
  description: string;
  image_url: string | null;
  contact_info: string | null;
  location: string | null;
  operating_hours: string | null;
  features: string[] | null;
  reviews: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: string;
  title: string;
  department: string | null;
  description: string | null;
  requirements: string[] | null;
  salary_range: string | null;
  location: string | null;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship' | null;
  status: 'active' | 'filled' | 'cancelled';
  application_deadline: string | null;
  created_at: string;
  updated_at: string;
}
// Tipe data dokter dengan jadwal terintegrasi
export interface DoctorWithSchedules extends Doctor {
  schedules?: Schedule[];
}
