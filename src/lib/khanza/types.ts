// src/lib/khanza/types.ts

// Interface untuk data pasien dari SIMRS Khanza
export interface KhanzaPatient {
  no_rkm_medis: string;
  nm_pasien: string;
  no_ktp: string;
  jk: string;
  tmp_lahir: string;
  tgl_lahir: string;
  alamat: string;
  no_tlp: string;
  pekerjaan: string;
  stts_nikah: string;
  kd_pj: string;
  no_peserta: string;
  umur: string;
  pnd: string;
  keluarga: string;
  namakeluarga: string;
  tgl_daftar: string;
}

// Interface untuk jadwal dokter dari SIMRS Khanza
export interface KhanzaDoctorSchedule {
  doctor_name: string;
  doctor_code: string;
  polyclinic_code: string;
  polyclinic_name: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  current_patients: number;
  day_of_week: string;
  schedule_date: string;
}

// Interface untuk jadwal dokter dalam format yang digunakan di frontend
export interface KhanzaSchedule {
  id: string;
  doctor_id: string;
  clinic_id: string;
  day: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  available_slots: number;
}

// Interface untuk dokter aktif dari SIMRS Khanza
export interface KhanzaActiveDoctor {
  doctor_code: string;
  doctor_name: string;
  address: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  blood_type: string;
  religion: string;
  specialty: string;
  practice_address: string;
}

// Interface untuk data pendapatan obat dari SIMRS Khanza
export interface KhanzaDrugRevenue {
  id: string;
  drug_name: string;
  quantity_sold: number;
  unit_price: number;
  total_revenue: number;
  cost_price: number;
  total_cost: number;
  profit: number;
  profit_margin: number;
  transaction_source: string;
  patient_id: string;
  prescription_id: string;
  date: string;
  created_at: string;
}

// Interface untuk laporan lanjutan pendapatan obat
export interface AdvancedDrugRevenueReport {
  topSellingDrugs: Array<{
    drug_name: string;
    total_quantity: number;
    total_revenue: number;
    total_profit: number;
    profit_margin: number;
    transaction_source: string;
  }>;
  revenueByUnit: Array<{
    unit: string;
    total_revenue: number;
    total_profit: number;
    profit_margin: number;
    transaction_source: string;
  }>;
  dailyRevenueTrend: Array<{
    date: string;
    total_revenue: number;
    total_profit: number;
    transaction_source: string;
  }>;
  monthlyRevenueSummary: Array<{
    month: string;
    total_revenue: number;
    total_profit: number;
    profit_margin: number;
    transaction_source: string;
  }>;
}

// Interface untuk data jurnal dari SIMRS Khanza
export interface KhanzaJournal {
  account_code: string;
  account_name: string;
  date: string;
  journal_number: string;
  description: string;
  debit: number;
  credit: number;
  created_at: string;
}

// Interface untuk data keuangan dari SIMRS Khanza
export interface KhanzaFinancialData {
  date: string;
  description: string;
  type: string;
  amount: number;
  account_code: string;
  account_name: string;
  reference_number: string;
  created_at: string;
}

// Interface untuk data laporan dari SIMRS Khanza
export interface KhanzaReport {
  date: string;
  title: string;
  category: string;
  value: number;
  description: string;
  code: string;
  data_source: string;
  created_at: string;
}

// Interface untuk hasil koneksi ke SIMRS Khanza
export interface KhanzaConnectionResult {
  success: boolean;
  message: string;
  version?: string;
  tables?: string[];
}