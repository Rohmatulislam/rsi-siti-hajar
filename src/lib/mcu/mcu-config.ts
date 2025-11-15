// src/lib/mcu/mcu-config.ts

// Konfigurasi untuk layanan MCU
export const MCUSystemConfig = {
  // Waktu operasional MCU
  operationalHours: {
    start: '07:00',
    end: '15:00',
    days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  },
  
  // Lokasi layanan MCU
  location: {
    name: 'Layanan MCU',
    floor: 'Lantai 2',
    building: 'RSI Siti Hajar Mataram'
  },
  
  // Kebijakan dan persyaratan MCU
  policies: {
    fastingHours: 8, // Jam puasa minimum sebelum MCU
    arrivalTime: 30, // Menit sebelum jadwal MCU harus datang
    requiredDocuments: [
      'Kartu identitas (KTP/SIM)',
      'Kartu BPJS (jika menggunakan BPJS)',
      'Hasil pemeriksaan sebelumnya (jika ada)'
    ]
  },
  
  // Pembayaran
  paymentMethods: [
    { id: 'cash', name: 'Tunai' },
    { id: 'transfer', name: 'Transfer Bank' },
    { id: 'bpjs', name: 'BPJS' },
    { id: 'credit_card', name: 'Kartu Kredit' },
    { id: 'debit_card', name: 'Kartu Debit' }
  ],
  
  // Tipe pasien
  patientTypes: [
    { id: 'existing', label: 'Pasien Lama' },
    { id: 'new', label: 'Pasien Baru' }
  ],
  
  // Kode poli MCU di SIMRS
  mcuPoliCode: 'MCU',
  
  // Kode dokter MCU di SIMRS
  mcuDoctorCode: 'MCU',
  
  // Kode penjamin default untuk MCU
  defaultPaymentCode: 'UMUM',
  
  // Format nomor antrian MCU
  queueNumberFormat: 'MCU-{number}',
  
  // Jadwal default MCU (jika diperlukan)
  defaultSchedules: [
    { day: 'Senin', time: '07:00-11:00' },
    { day: 'Selasa', time: '07:00-11:00' },
    { day: 'Rabu', time: '07:00-11:00' },
    { day: 'Kamis', time: '07:00-11:00' },
    { day: 'Jumat', time: '07:00-11:00' },
    { day: 'Sabtu', time: '07:00-11:00' }
  ]
};

// Fungsi untuk mendapatkan jam operasional dalam format tertentu
export function getOperationalHoursString(): string {
  return `${MCUSystemConfig.operationalHours.start} - ${MCUSystemConfig.operationalHours.end} WITA`;
}

// Fungsi untuk mendapatkan hari operasional dalam format tertentu
export function getOperationalDaysString(): string {
  return MCUSystemConfig.operationalHours.days.join(', ');
}

// Fungsi untuk memeriksa apakah MCU sedang buka
export function isMCUOpen(): boolean {
  const now = new Date();
  const currentDay = now.toLocaleDateString('id-ID', { weekday: 'long' });
  const currentTime = now.toTimeString().substring(0, 5);
  
  // Periksa apakah hari ini dalam daftar hari operasional
  const isOpenDay = MCUSystemConfig.operationalHours.days.includes(currentDay);
  
  // Periksa apakah waktu sekarang dalam rentang operasional
  const startTime = MCUSystemConfig.operationalHours.start;
  const endTime = MCUSystemConfig.operationalHours.end;
  
  const isWithinTime = currentTime >= startTime && currentTime <= endTime;
  
  return isOpenDay && isWithinTime;
}