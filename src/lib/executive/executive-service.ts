// src/lib/executive/executive-service.ts
import { createClient } from '@supabase/supabase-js';
import { ExecutiveErrorHandler } from './executive-error-handler';

// Inisialisasi client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface untuk data dokter
export interface ExecutiveDoctor {
  id: string;
  name: string;
  specialization: string;
  education?: string;
  sip?: string;
  schedules: {
    day: string;
    startTime: string;
    endTime: string;
    quota?: number;
  }[];
}

// Interface untuk data pasien
export interface ExecutivePatient {
  no_rkm_medis: string;
  nm_pasien: string;
  jk: string;
  tmp_lahir: string;
  tgl_lahir: string;
  alamat: string;
  no_telp: string;
  pekerjaan: string;
  stts_nikah: string;
  kd_pj: string;
}

// Interface untuk data pendaftaran
export interface ExecutiveRegistration {
  no_reg: string;
  no_rkm_medis: string;
  kd_dokter: string;
  dokter: string;
  poli: string;
  tanggal: string;
  jam: string;
}

// Fungsi untuk mendapatkan data dokter eksekutif
export async function getExecutiveDoctors(): Promise<ExecutiveDoctor[]> {
  try {
    // Menggunakan fungsi koneksi database yang terpisah
    const { executeKhanzaQuery } = await import('./executive-db');

    // Query untuk mendapatkan data dokter eksekutif
    const query = `
      SELECT
        d.kd_dokter,
        d.nm_dokter,
        d.alumni,
        d.no_ijn_praktek,
        s.nm_sps as spesialisasi,
        j.hari_kerja,
        j.jam_mulai,
        j.jam_selesai,
        j.kuota
      FROM dokter d
      LEFT JOIN spesialis s ON d.kd_sps = s.kd_sps
      LEFT JOIN jadwal j ON d.kd_dokter = j.kd_dokter
      WHERE j.kd_poli = 'EKS'
      ORDER BY
        CASE j.hari_kerja
          WHEN 'Senin' THEN 1
          WHEN 'Selasa' THEN 2
          WHEN 'Rabu' THEN 3
          WHEN 'Kamis' THEN 4
          WHEN 'Jumat' THEN 5
          WHEN 'Sabtu' THEN 6
          WHEN 'Minggu' THEN 7
        END,
        j.jam_mulai
    `;

    const results: any[] = await executeKhanzaQuery(query);

    // Format data agar sesuai dengan kebutuhan frontend
    const doctors: ExecutiveDoctor[] = [];
    const doctorMap = new Map();

    if (Array.isArray(results)) {
      results.forEach((row: any) => {
        const doctorId = row.kd_dokter;

        if (!doctorMap.has(doctorId)) {
          doctorMap.set(doctorId, {
            id: doctorId,
            name: row.nm_dokter,
            specialization: row.spesialisasi,
            education: row.alumni,
            sip: row.no_ijn_praktek,
            schedules: []
          });
        }

        if (row.hari_kerja) {
          const doctor = doctorMap.get(doctorId);
          doctor.schedules.push({
            day: row.hari_kerja,
            startTime: row.jam_mulai,
            endTime: row.jam_selesai,
            quota: row.kuota
          });
        }
      });

      doctors.push(...Array.from(doctorMap.values()));
    }

    return doctors;
  } catch (error) {
    console.error('Error getting executive doctors:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan data pasien berdasarkan nomor rekam medis
export async function getExecutivePatient(noRkmMedis: string): Promise<ExecutivePatient> {
  try {
    // Menggunakan fungsi koneksi database yang terpisah
    const { executeKhanzaQuery } = await import('./executive-db');

    // Query untuk mendapatkan data pasien
    const query = `
      SELECT
        no_rkm_medis,
        nm_pasien,
        jk,
        tmp_lahir,
        tgl_lahir,
        alamat,
        no_telp,
        pekerjaan,
        stts_nikah,
        kd_pj
      FROM pasien
      WHERE no_rkm_medis = ?
    `;

    const results: any[] = await executeKhanzaQuery(query, [noRkmMedis]);

    if (!results || (Array.isArray(results) && results.length === 0)) {
      throw new Error('Pasien tidak ditemukan');
    }

    const patient = Array.isArray(results) ? results[0] : results;
    return patient;
  } catch (error) {
    console.error('Error getting executive patient:', error);
    throw error;
  }
}

// Fungsi untuk mendaftarkan pasien ke poli eksekutif
export async function registerExecutivePatient(
  noRkmMedis: string,
  kdDokter: string
): Promise<ExecutiveRegistration> {
  try {
    // Menggunakan fungsi koneksi database yang terpisah
    const { executeKhanzaQuery } = await import('./executive-db');

    // 1. Validasi Pasien
    let patientQuery = 'SELECT * FROM pasien WHERE no_rkm_medis = ?';
    let patientResult: any[] = await executeKhanzaQuery(patientQuery, [noRkmMedis]);

    if (!patientResult || (Array.isArray(patientResult) && patientResult.length === 0)) {
      throw new Error('Nomor Rekam Medis tidak ditemukan.');
    }

    // 2. Validasi Jadwal Dokter
    let scheduleQuery = `
      SELECT j.*, d.nm_dokter, p.nm_poli
      FROM jadwal j
      JOIN dokter d ON j.kd_dokter = d.kd_dokter
      JOIN poliklinik p ON j.kd_poli = p.kd_poli
      WHERE j.kd_dokter = ? AND j.hari_kerja = DAYNAME(CURDATE())
      AND p.kd_poli = 'EKS'
      AND j.jam_mulai <= TIME(CURDATE())
      AND j.jam_selesai >= TIME(CURDATE())
    `;

    let scheduleResult: any[] = await executeKhanzaQuery(scheduleQuery, [kdDokter]);

    if (!scheduleResult || (Array.isArray(scheduleResult) && scheduleResult.length === 0)) {
      throw new Error('Dokter tidak praktik hari ini atau jadwal tidak ditemukan.');
    }

    const schedule = Array.isArray(scheduleResult) ? scheduleResult[0] : scheduleResult;

    // 3. Validasi kuota
    if (schedule.kuota) {
      let queueCountQuery = `
        SELECT COUNT(*) as count
        FROM reg_periksa
        WHERE kd_dokter = ?
        AND tgl_registrasi = CURDATE()
        AND kd_poli = ?
      `;

      let queueCountResult: any[] = await executeKhanzaQuery(queueCountQuery, [kdDokter, schedule.kd_poli]);
      const queueCount = Array.isArray(queueCountResult) ? queueCountResult[0].count : queueCountResult[0].count;

      if (queueCount >= schedule.kuota) {
        throw new Error('Kuota konsultasi hari ini telah penuh.');
      }
    }

    // 4. Generate Nomor Antrian
    let maxQueueQuery = `
      SELECT MAX(CAST(no_reg AS UNSIGNED)) as max_no_reg
      FROM reg_periksa
      WHERE kd_poli = ? AND tgl_registrasi = CURDATE()
    `;

    let maxQueueResult: any[] = await executeKhanzaQuery(maxQueueQuery, [schedule.kd_poli]);
    let nextQueueNumber = 1;

    if (maxQueueResult && Array.isArray(maxQueueResult) && maxQueueResult[0].max_no_reg) {
      nextQueueNumber = parseInt(maxQueueResult[0].max_no_reg) + 1;
    }

    const noReg = nextQueueNumber.toString().padStart(3, '0');

    // 5. Insert ke SIMRS (reg_periksa)
    const insertQuery = `
      INSERT INTO reg_periksa (
        no_rkm_medis, kd_poli, kd_dokter, tgl_registrasi,
        jam_reg, no_reg, stts_daftar, kd_pj
      ) VALUES (?, ?, ?, CURDATE(), CURTIME(), ?, 'Baru', 'UMUM')
    `;

    await executeKhanzaQuery(insertQuery, [
      noRkmMedis,
      schedule.kd_poli,
      kdDokter,
      noReg
    ]);

    // 6. Return hasil pendaftaran
    return {
      no_reg: noReg,
      no_rkm_medis: noRkmMedis,
      kd_dokter: kdDokter,
      dokter: schedule.nm_dokter,
      poli: schedule.nm_poli,
      tanggal: new Date().toISOString().split('T')[0],
      jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Error registering executive patient:', error);
    throw error;
  }
}

// Fungsi untuk menyimpan data pendaftaran ke Supabase sebagai backup
export async function saveExecutiveRegistrationToSupabase(registration: ExecutiveRegistration) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        no_reg: registration.no_reg,
        no_rkm_medis: registration.no_rkm_medis,
        kd_dokter: registration.kd_dokter,
        jam_reg: registration.jam,
        tgl_registrasi: registration.tanggal,
        stts: 'Belum',
        is_executive: true, // Tandai bahwa ini adalah registrasi untuk poli eksekutif
        status: 'pending', // Status untuk tabel appointments
        appointment_date: registration.tanggal, // Tambahkan tanggal janji
        appointment_time: registration.jam, // Tambahkan waktu janji
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving registration to Supabase:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in saveExecutiveRegistrationToSupabase:', error);
    throw error;
  }
}

// Fungsi tambahan untuk keperluan sinkronisasi
export async function getExecutiveDoctorsForSync() {
  return await getExecutiveDoctors();
}

// Fungsi untuk mendapatkan data pendaftaran untuk sinkronisasi
export async function getExecutiveRegistrationsForSync() {
  // Dalam implementasi sebenarnya, ini akan mengambil data registrasi dari SIMRS
  // Untuk sekarang kita kembalikan array kosong
  return [];
}

// Fungsi untuk mendapatkan data pasien untuk sinkronisasi
export async function getExecutivePatientsForSync() {
  // Dalam implementasi sebenarnya, ini akan mengambil data pasien dari SIMRS
  // Untuk sekarang kita kembalikan array kosong
  return [];
}

