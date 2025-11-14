// Konfigurasi untuk koneksi dan integrasi SIMRS Khanza
export const KHANZA_CONFIG = {
  // Informasi koneksi database SIMRS Khanza
  db: {
    host: process.env.KHANZA_DB_HOST || 'localhost',
    port: parseInt(process.env.KHANZA_DB_PORT || '3306'),
    database: process.env.KHANZA_DB_NAME || 'khanza',
    user: process.env.KHANZA_DB_USER || 'root',
    password: process.env.KHANZA_DB_PASSWORD || '',
  },

  // URL dasar untuk API SIMRS Khanza (jika menggunakan modul bridging)
  BASE_URL: process.env.KHANZA_BASE_URL || '',

  // Endpoint untuk berbagai fungsi SIMRS (jika menggunakan modul bridging)
  ENDPOINTS: {
    // Endpoint pasien
    PATIENT: '/api/pasien',
    PATIENT_SEARCH: '/api/pasien/search',

    // Endpoint registrasi rawat jalan
    REGISTRATION: '/api/booking_registrasi',
    REGISTRATION_AVAILABLE: '/api/booking_registrasi/available',

    // Endpoint antrian
    QUEUE: '/api/antrian',

    // Endpoint dokter
    DOCTOR_SCHEDULES: '/api/jadwal_dokter',

    // Endpoint poliklinik
    POLYCLINIC: '/api/poliklinik',
  },

  // Header otorisasi (jika menggunakan modul bridging)
  HEADERS: {
    'Content-Type': 'application/json',
  },

  // Timeout untuk permintaan (dalam milidetik)
  TIMEOUT: 30000, // 30 detik

  // Mapping untuk berbagai kode dalam SIMRS Khanza
  GENDER: {
    'L': 'L',
    'P': 'P',
    'Laki-laki': 'L',
    'Perempuan': 'P',
  },

  MARITAL_STATUS: {
    'BELUM_KAWIN': 'BELUM KAWIN',
    'KAWIN': 'KAWIN',
    'JANDA': 'JANDA',
    'DUDHA': 'DUDHA',
    'JOMBLO': 'JOMBLO',
  },

  PAYOR: {
    'UMUM': 'UMUM',
    'BPJS': 'BPJ',
    'ASURANSI_LAIN': 'TAT',
  },

  DOCTOR: {
    // Contoh: mapping nama dokter ke kode dokter dalam SIMRS
    // Ini harus disesuaikan dengan kode dokter di SIMRS Anda
  },

  POLYCLINIC: {
    // Contoh: mapping nama poliklinik ke kode poliklinik dalam SIMRS
    // Ini harus disesuaikan dengan kode poliklinik di SIMRS Anda
    'UMUM': 'UMUM',
    'PENYAKIT_INERNAL': 'INT',
    'KESEHATAN_JIWA': 'JIWA',
    'KEBIDANAN': 'KBD',
    'KELUARGA_BERENCANA': 'KBR',
    'MATA': 'MAT',
    'MULUT_DAN_GIGI': 'MGG',
    'THT': 'THT',
    'KULIT_DAN_KELAMIN': 'KDK',
    'PARU_PARU': 'PRU',
    'JANTUNG': 'JNT',
    'GINEKOLOGI': 'GIG',
  },

  // Fitur-fitur konfigurasi
  features: {
    // Aktifkan caching untuk permintaan yang sering digunakan
    enableCache: process.env.KHANZA_ENABLE_CACHE === 'true' || false,

    // Durasi cache dalam detik (default: 5 menit)
    cacheDuration: parseInt(process.env.KHANZA_CACHE_DURATION || '300'),
  },
};

// Fungsi untuk membuat URL lengkap untuk endpoint API
export function createApiUrl(endpoint: string): string {
  if (!KHANZA_CONFIG.BASE_URL) {
    throw new Error('KHANZA_BASE_URL environment variable is required for API requests');
  }
  return `${KHANZA_CONFIG.BASE_URL}${endpoint}`;
}

// Fungsi untuk mendapatkan headers lengkap untuk permintaan API
export function getApiHeaders(): Record<string, string> {
  return {
    ...KHANZA_CONFIG.HEADERS,
    // Tambahkan header lain jika diperlukan
  };
}