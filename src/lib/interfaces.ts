// Import types dari file types.ts untuk Khanza
import {
  KhanzaDrugRevenue,
  AdvancedDrugRevenueReport
} from './khanza/types';

// Ekspor types untuk digunakan di seluruh aplikasi
export type {
  KhanzaDrugRevenue,
  AdvancedDrugRevenueReport
};

// Definisi interface lain yang mungkin digunakan oleh aplikasi
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  published_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at: string;
}