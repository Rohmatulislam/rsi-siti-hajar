// src/lib/executive/executive-cron.ts
import { syncAllExecutiveDataToSupabase } from './executive-sync-manager';

// Fungsi sederhana untuk menyinkronkan data secara berkala
let syncInterval: NodeJS.Timeout | null = null;

// Fungsi untuk memulai cron job
export function startExecutiveSyncCron() {
  if (syncInterval) {
    console.log('Executive sync cron job sudah berjalan');
    return;
  }

  console.log('Memulai executive sync cron job...');

  // Jalankan sinkronisasi setiap 30 menit (30 * 60 * 1000 = 30 menit dalam milidetik)
  syncInterval = setInterval(async () => {
    try {
      console.log('Menjalankan sinkronisasi data eksekutif ke Supabase...');
      await syncAllExecutiveDataToSupabase();
      console.log('Sinkronisasi data eksekutif selesai');
    } catch (error) {
      console.error('Error dalam cron job sinkronisasi executive:', error);
    }
  }, 30 * 60 * 1000); // 30 menit sekali

  console.log('Executive sync cron job berjalan setiap 30 menit');
}

// Fungsi untuk menghentikan cron job
export function stopExecutiveSyncCron() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('Executive sync cron job dihentikan');
  }
}

// Fungsi untuk memastikan hanya satu instance cron yang berjalan
export function ensureOnlyOneCronInstance() {
  if (typeof window === 'undefined') { // Hanya di sisi server
    // Atur variabel global untuk mencegah instance ganda
    const globalWithCron = global as typeof globalThis & {
      executiveSyncCronStarted?: boolean;
    };

    if (!globalWithCron.executiveSyncCronStarted) {
      startExecutiveSyncCron();
      globalWithCron.executiveSyncCronStarted = true;
    }
  }
}