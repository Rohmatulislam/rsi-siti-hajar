// src/lib/executive/executive-sync-service.ts
import { createClient } from '@supabase/supabase-js';
import { ExecutiveDoctor, ExecutivePatient, ExecutiveRegistration } from './executive-service';

// Inisialisasi client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk menyinkronkan dokter ke Supabase
export async function syncExecutiveDoctorsToSupabase(doctors: any[]) {
  try {
    // Format ulang data agar sesuai dengan skema Supabase
    const formattedDoctors = doctors.map(doctor => ({
      kd_dokter: typeof doctor === 'object' ? doctor.id || doctor.kd_dokter : doctor.kd_dokter,
      name: typeof doctor === 'object' ? doctor.name || doctor.nm_dokter : doctor.nm_dokter,
      is_executive: true, // Tandai bahwa dokter ini tersedia untuk poli eksekutif
      sip_number: typeof doctor === 'object' ? doctor.sip || doctor.no_ijn_praktek : doctor.no_ijn_praktek,
      specialization: typeof doctor === 'object' ? doctor.specialization || doctor.sps : doctor.sps,
      education: typeof doctor === 'object' ? doctor.education || doctor.alumni : doctor.alumni,
    }));

    const { data, error } = await supabase
      .from('doctors')
      .upsert(formattedDoctors, { onConflict: 'kd_dokter' });

    if (error) {
      console.error('Error syncing executive doctors to Supabase:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in syncExecutiveDoctorsToSupabase:', error);
    throw error;
  }
}

// Fungsi untuk menyinkronkan pasien ke Supabase
export async function syncExecutivePatientsToSupabase(patients: any[]) {
  try {
    // Format ulang data agar sesuai dengan skema Supabase
    const formattedPatients = patients.map(patient => {
      // Jika data dari SIMRS, struktur mungkin berbeda
      const isFromSimrs = !patient.user_id && patient.no_rkm_medis;

      return {
        no_rkm_medis: typeof patient === 'object' ? patient.no_rkm_medis : patient.no_rkm_medis,
        full_name: typeof patient === 'object' ? patient.nm_pasien || patient.full_name : patient.nm_pasien,
        no_ktp: typeof patient === 'object' ? patient.no_ktp || patient.no_telp : patient.no_telp, // Menggunakan no_telp sebagai pengganti no_ktp sementara
        is_executive: true, // Tandai bahwa pasien ini terdaftar untuk poli eksekutif
      };
    });

    const { data, error } = await supabase
      .from('patient_profiles')
      .upsert(formattedPatients, { onConflict: 'no_rkm_medis' });

    if (error) {
      console.error('Error syncing executive patients to Supabase:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in syncExecutivePatientsToSupabase:', error);
    throw error;
  }
}

// Fungsi untuk menyinkronkan pendaftaran ke Supabase
export async function syncExecutiveRegistrationsToSupabase(registrations: any[]) {
  try {
    // Format ulang data agar sesuai dengan skema Supabase
    const formattedRegistrations = registrations.map(registration => ({
      no_reg: typeof registration === 'object' ? registration.no_reg : registration.no_reg,
      no_rkm_medis: typeof registration === 'object' ? registration.no_rkm_medis : registration.no_rkm_medis,
      kd_dokter: typeof registration === 'object' ? registration.kd_dokter : registration.kd_dokter,
      jam_reg: typeof registration === 'object' ? registration.jam || registration.jam_reg : registration.jam_reg,
      tgl_registrasi: typeof registration === 'object' ? registration.tanggal || registration.tgl_registrasi : registration.tgl_registrasi,
      stts: typeof registration === 'object' ? registration.stts || 'Belum' : 'Belum',
      is_executive: true, // Tandai bahwa ini adalah registrasi untuk poli eksekutif
      status: 'pending', // Status untuk tabel appointments
    }));

    const { data, error } = await supabase
      .from('appointments')
      .upsert(formattedRegistrations, { onConflict: 'no_reg' });

    if (error) {
      console.error('Error syncing executive registrations to Supabase:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in syncExecutiveRegistrationsToSupabase:', error);
    throw error;
  }
}