// Konfigurasi untuk koneksi ke SIMRS Khanza Desktop
export const KHANZA_CONFIG = {
  // Informasi koneksi database SIMRS Khanza
  DB_HOST: process.env.KHANZA_DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.KHANZA_DB_PORT || '3306'),
  DB_NAME: process.env.KHANZA_DB_NAME || 'khanza',
  DB_USER: process.env.KHANZA_DB_USER || 'root',
  DB_PASSWORD: process.env.KHANZA_DB_PASSWORD || '',
  
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
};

// Mapping antara format dalam aplikasi kita dengan SIMRS Khanza
export const KHANZA_MAPPING = {
  // Mapping poliklinik
  POLYCLINIC: {
    'penyakit-dalam': 'INT', // Internal Medicine
    'bedah': 'BEDAH', 
    'anak': 'ANAK',
    'kandungan': 'KANDUNGAN',
    'mata': 'MATA',
    'kulit-dan-kelamin': 'KULIT',
    'saraf': 'SARAF',
    'orthopedi': 'ORTO',
    'gigi': 'GIGI',
    'telinga-hidung-tenggorokan': 'THT',
    'umum': 'UMUM',
  },
  
  // Mapping dokter - ini harus sesuai dengan data di SIMRS Khanza
  DOCTOR: {
    'dr-andi-s': 'DR001',
    'dr-budi-h': 'DR002',
    'dr-citra-m': 'DR003',
    'dr-dedi-k': 'DR004',
    'dr-era-n': 'DR005',
    // Tambahkan mapping dokter sesuai dengan yang ada di SIMRS Khanza
  },
  
  // Mapping jenis kelamin
  GENDER: {
    'Laki-laki': 'L',
    'Perempuan': 'P',
  },
  
  // Mapping status pernikahan
  MARITAL_STATUS: {
    'BELUM_KAWIN': 'BELUM_KAWIN',
    'KAWIN': 'KAWIN',
    'JANDA': 'JANDA',
    'DUDHA': 'DUDHA',
  },
  
  // Mapping pendidikan
  EDUCATION: {
    'SD': 'SD',
    'SMP': 'SMP',
    'SMA': 'SMA',
    'D3': 'D3',
    'S1': 'S1',
    'S2': 'S2',
    'S3': 'S3',
    'TIDAK_SEKOLAH': 'TIDAK_SEKOLAH',
  },
  
  // Mapping penjamin
  PAYOR: {
    'UMUM': 'UMUM',
    'BPJS_KESEHATAN': 'BPJ',
    'BPJS_KETENAGAKERJAAN': 'BPJS-TK',
    // Tambahkan penjamin lain sesuai kebutuhan
  },
};