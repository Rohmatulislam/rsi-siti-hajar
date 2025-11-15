// src/lib/executive/executive-sync-manager.ts
import {
  getExecutiveDoctorsForSync,
  getExecutivePatientsForSync,
  getExecutiveRegistrationsForSync
} from './executive-service';
import {
  syncExecutiveDoctorsToSupabase,
  syncExecutivePatientsToSupabase,
  syncExecutiveRegistrationsToSupabase
} from './executive-sync-service';

// Fungsi untuk sinkronisasi semua data eksekutif ke Supabase
export async function syncAllExecutiveDataToSupabase() {
  try {
    console.log('Memulai sinkronisasi data eksekutif ke Supabase...');

    // Ambil semua data dari SIMRS
    const [doctors, patients, registrations] = await Promise.all([
      getExecutiveDoctorsForSync(),
      getExecutivePatientsForSync(),
      getExecutiveRegistrationsForSync()
    ]);

    console.log(`Data dokter ditemukan: ${doctors.length}`);
    console.log(`Data pasien ditemukan: ${patients.length}`);
    console.log(`Data registrasi ditemukan: ${registrations.length}`);

    // Sinkronkan dokter
    if (doctors.length > 0) {
      await syncExecutiveDoctorsToSupabase(doctors);
      console.log('Sinkronisasi dokter selesai');
    }

    // Sinkronkan pasien
    if (patients.length > 0) {
      await syncExecutivePatientsToSupabase(patients);
      console.log('Sinkronisasi pasien selesai');
    }

    // Sinkronkan registrasi
    if (registrations.length > 0) {
      await syncExecutiveRegistrationsToSupabase(registrations);
      console.log('Sinkronisasi registrasi selesai');
    }

    console.log('Sinkronisasi semua data eksekutif ke Supabase selesai');
  } catch (error) {
    console.error('Error dalam sinkronisasi data eksekutif ke Supabase:', error);
    throw error;
  }
}

// Fungsi untuk sinkronisasi data dokter saja
export async function syncExecutiveDoctorsOnly() {
  try {
    console.log('Memulai sinkronisasi data dokter eksekutif ke Supabase...');

    const doctors = await getExecutiveDoctorsForSync();
    console.log(`Data dokter ditemukan: ${doctors.length}`);

    if (doctors.length > 0) {
      await syncExecutiveDoctorsToSupabase(doctors);
      console.log('Sinkronisasi dokter eksekutif ke Supabase selesai');
    }

    return { success: true, count: doctors.length };
  } catch (error) {
    console.error('Error dalam sinkronisasi dokter eksekutif ke Supabase:', error);
    return { success: false, error: (error as Error).message };
  }
}