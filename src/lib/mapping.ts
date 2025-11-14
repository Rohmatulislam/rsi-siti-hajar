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