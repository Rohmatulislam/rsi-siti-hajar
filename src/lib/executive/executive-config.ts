// src/lib/executive/executive-config.ts

// Konfigurasi sistem Poli Eksekutif

export const EXECUTIVE_CONFIG = {
  // Kode poli eksekutif di SIMRS Khanza
  POLI_KODE: 'EKS',
  
  // Waktu expired pendaftaran (dalam milidetik)
  REGISTRATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 jam
  
  // Maksimum jumlah antrian per dokter per hari
  MAX_QUEUE_PER_DOCTOR: 30,
  
  // Interval sinkronisasi data ke Supabase (dalam milidetik)
  SYNC_INTERVAL: 30 * 60 * 1000, // 30 menit
  
  // Hari operasional
  OPERATIONAL_DAYS: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  
  // Jam operasional poli eksekutif
  OPERATIONAL_HOURS: {
    start: '07:00',
    end: '16:00'
  },
  
  // Prefix nomor antrian eksekutif
  QUEUE_PREFIX: 'EKS-',
  
  // Waktu sebelum jadwal dokter untuk membatalkan antrian (dalam jam)
  CANCELLATION_THRESHOLD: 2
};

// Fungsi untuk mendapatkan nama hari dalam bahasa Indonesia
export function getIndonesianDayName(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

// Fungsi untuk mengecek apakah hari ini hari operasional
export function isOperationalDay(date: Date = new Date()): boolean {
  const day = getIndonesianDayName(date);
  return EXECUTIVE_CONFIG.OPERATIONAL_DAYS.includes(day);
}

// Fungsi untuk mengecek apakah jam saat ini dalam jam operasional
export function isOperationalHour(time: string = new Date().toTimeString().substring(0, 5)): boolean {
  const [startHour, startMinute] = EXECUTIVE_CONFIG.OPERATIONAL_HOURS.start.split(':').map(Number);
  const [endHour, endMinute] = EXECUTIVE_CONFIG.OPERATIONAL_HOURS.end.split(':').map(Number);
  
  const [currentHour, currentMinute] = time.split(':').map(Number);
  
  const currentMinutes = currentHour * 60 + currentMinute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}