// src/lib/executive/executive-init.ts
import { ensureOnlyOneCronInstance } from './executive-cron';

// Fungsi untuk menginisialisasi sistem executive
export function initializeExecutiveSystem() {
  console.log('Initializing Executive System...');

  // Mulai cron job untuk sinkronisasi data
  ensureOnlyOneCronInstance();

  console.log('Executive System initialized successfully');
}

// Hanya jalankan inisialisasi dalam lingkungan produksi atau jika secara eksplisit dipanggil
// Hindari menjalankan cron otomatis saat modul dimuat untuk mencegah masalah di lingkungan development