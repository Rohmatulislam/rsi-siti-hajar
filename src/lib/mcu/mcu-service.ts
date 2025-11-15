// src/lib/mcu/mcu-service.ts
import { createClient } from '@supabase/supabase-js';
import { MCUPatient, MCUPackage, MCURegistration } from './mcu-types';

// Inisialisasi client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk mendapatkan data pasien MCU dari SIMRS
export async function getMCUPatient(identifier: string): Promise<MCUPatient> {
  try {
    // Menggunakan fungsi koneksi database yang terpisah untuk SIMRS
    const { executeKhanzaQuery } = await import('./mcu-db');

    // Query untuk mendapatkan data pasien berdasarkan no_rkm_medis atau no_ktp
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
      WHERE no_rkm_medis = ? OR no_ktp = ?
    `;

    const results: any[] = await executeKhanzaQuery(query, [identifier, identifier]);

    if (!results || (Array.isArray(results) && results.length === 0)) {
      throw new Error('Pasien tidak ditemukan');
    }

    const patient = Array.isArray(results) ? results[0] : results;
    return patient;
  } catch (error) {
    console.error('Error getting MCU patient:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar paket MCU
export async function getMCUPackages(): Promise<MCUPackage[]> {
  try {
    // Dalam implementasi asli, ini akan mengambil data paket MCU dari tabel yang sesuai di SIMRS
    // Untuk sekarang kita kembalikan data mock
    return [
      {
        id: 'basic',
        name: 'MCU Basic',
        price: 500000,
        description: 'Pemeriksaan dasar kesehatan secara menyeluruh',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium dasar',
          'EKG',
          'Rontgen Thorax'
        ],
        duration: '3-4 jam'
      },
      {
        id: 'silver',
        name: 'MCU Silver',
        price: 1200000,
        description: 'Pemeriksaan komprehensif dengan hasil lengkap',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium lengkap',
          'EKG & USG Abdomen',
          'Rontgen Thorax',
          'Konsultasi dokter spesialis'
        ],
        duration: '4-5 jam'
      },
      {
        id: 'gold',
        name: 'MCU Gold',
        price: 2500000,
        description: 'Pemeriksaan menyeluruh dengan hasil mendalam',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium lengkap',
          'EKG & USG Abdomen',
          'Rontgen Thorax',
          'Konsultasi dokter spesialis',
          'USG Jantung',
          'Spirometri'
        ],
        duration: '5-6 jam'
      },
      {
        id: 'executive',
        name: 'MCU Executive',
        price: 4500000,
        description: 'Pemeriksaan premium dengan hasil terlengkap',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium lengkap',
          'EKG & USG Abdomen',
          'Rontgen Thorax',
          'Konsultasi dokter spesialis',
          'USG Jantung',
          'Spirometri',
          'Endoskopi',
          'MRI (opsional)'
        ],
        duration: '6-8 jam'
      }
    ];
  } catch (error) {
    console.error('Error getting MCU packages:', error);
    throw error;
  }
}

// Fungsi untuk mendaftarkan pasien ke MCU
export async function registerMCUPatient(
  patientData: {
    no_rkm_medis: string;
    package_id: string;
    tanggal_mc: string;
    payment_method: string;
  }
): Promise<MCURegistration> {
  try {
    // Menggunakan fungsi koneksi database yang terpisah untuk SIMRS
    const { executeKhanzaQuery } = await import('./mcu-db');

    // 1. Validasi Pasien
    let patientQuery = 'SELECT * FROM pasien WHERE no_rkm_medis = ?';
    let patientResult: any[] = await executeKhanzaQuery(patientQuery, [patientData.no_rkm_medis]);

    if (!patientResult || (Array.isArray(patientResult) && patientResult.length === 0)) {
      throw new Error('Nomor Rekam Medis tidak ditemukan.');
    }

    // 2. Buat entry MCU di SIMRS (reg_periksa untuk MCU)
    const insertQuery = `
      INSERT INTO reg_periksa (
        no_rkm_medis, kd_poli, kd_dokter, tgl_registrasi,
        jam_reg, no_reg, stts_daftar, kd_pj, status_lanjut
      ) VALUES (?, 'MCU', 'MCU', ?, CURTIME(), ?, 'Baru', ?, 'Ralan')
    `;

    // Generate nomor antrian MCU
    const maxQueueQuery = `
      SELECT MAX(CAST(no_reg AS UNSIGNED)) as max_no_reg
      FROM reg_periksa
      WHERE kd_poli = 'MCU' AND tgl_registrasi = ?
    `;

    let maxQueueResult: any[] = await executeKhanzaQuery(maxQueueQuery, [patientData.tanggal_mc]);
    let nextQueueNumber = 1;

    if (maxQueueResult && Array.isArray(maxQueueResult) && maxQueueResult[0].max_no_reg) {
      nextQueueNumber = parseInt(maxQueueResult[0].max_no_reg) + 1;
    }

    const noReg = nextQueueNumber.toString().padStart(3, '0');

    await executeKhanzaQuery(insertQuery, [
      patientData.no_rkm_medis,
      patientData.tanggal_mc,
      noReg,
      patientData.payment_method === 'bpjs' ? 'BPJ' : 'UMUM'
    ]);

    // 3. Simpan ke Supabase sebagai backup
    const { data, error } = await supabase
      .from('mcu_registrations')
      .insert([{
        no_rkm_medis: patientData.no_rkm_medis,
        package_id: patientData.package_id,
        tanggal_mc: patientData.tanggal_mc,
        jam_reg: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        no_reg: noReg,
        status: 'registered',
        payment_method: patientData.payment_method,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving MCU registration to Supabase:', error);
      // Tetap lanjutkan karena data utama sudah disimpan di SIMRS
    }

    // 4. Return hasil pendaftaran
    return {
      booking_id: `MCU-${Date.now()}`,
      no_reg: noReg,
      no_rkm_medis: patientData.no_rkm_medis,
      package_id: patientData.package_id,
      tanggal_mc: patientData.tanggal_mc,
      jam_reg: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Berhasil Terdaftar'
    };
  } catch (error) {
    console.error('Error registering MCU patient:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail paket MCU
export async function getMCUPackageDetail(packageId: string): Promise<MCUPackage> {
  try {
    const packages = await getMCUPackages();
    const pkg = packages.find(p => p.id === packageId);
    
    if (!pkg) {
      throw new Error(`Paket MCU dengan ID ${packageId} tidak ditemukan`);
    }
    
    return pkg;
  } catch (error) {
    console.error('Error getting MCU package detail:', error);
    throw error;
  }
}

// Fungsi untuk membuat pasien baru di SIMRS
export async function createNewMCUPatient(
  patientInfo: {
    nm_pasien: string;
    jk: string;
    tmp_lahir: string;
    tgl_lahir: string;
    alamat: string;
    no_telp: string;
    pekerjaan: string;
    stts_nikah: string;
    no_ktp: string;
  }
): Promise<MCUPatient> {
  try {
    const { executeKhanzaQuery } = await import('./mcu-db');

    // Generate nomor rekam medis baru
    const maxRmQuery = 'SELECT MAX(CAST(no_rkm_medis AS UNSIGNED)) as max_no FROM pasien';
    const maxRmResult: any[] = await executeKhanzaQuery(maxRmQuery);
    let newRmNumber = 1;

    if (maxRmResult && Array.isArray(maxRmResult) && maxRmResult[0].max_no) {
      newRmNumber = parseInt(maxRmResult[0].max_no) + 1;
    }

    const newRm = newRmNumber.toString().padStart(6, '0');

    // Insert ke tabel pasien di SIMRS
    const insertQuery = `
      INSERT INTO pasien (
        no_rkm_medis, nm_pasien, jk, tmp_lahir, tgl_lahir, alamat, no_telp,
        pekerjaan, stts_nikah, no_ktp, kd_pj, no_peserta, tgl_daftar, umur,
        pnd, keluarga, png_jawab, almt_pj, hubunganpj, biaya_reg, stts_nikah,
        agama, ocupasi, shdk, shk, shs, gd, rh, nm_ibu, kd_prop, nm_prop,
        kd_kab, nm_kab, kd_kec, nm_kec, kd_kel, nm_kel, jk2, nm_saudara, 
        perusahaan_pasien, saben, kode_cacat, id_cacat, nip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UMUM', '', CURDATE(), '0', 
      '-', 'SAUDARA', ?, ?, ?, 0, ?, 'ISLAM', 'PEKERJA', 'ANAK', 'KANDUNG', 
      'SAUDARA', 'A', 'POS', 'IBU', '01', 'NUSA TENGGARA BARAT', '01', 
      'LOMBOK TENGAH', '01', 'PRAYA', '01', 'SELAPARANG', ?, ?, '', 0, 
      '', 0, '')
    `;

    await executeKhanzaQuery(insertQuery, [
      newRm,
      patientInfo.nm_pasien,
      patientInfo.jk === 'Laki-laki' ? 'L' : 'P',
      patientInfo.tmp_lahir,
      patientInfo.tgl_lahir,
      patientInfo.alamat,
      patientInfo.no_telp,
      patientInfo.pekerjaan,
      patientInfo.stts_nikah,
      patientInfo.no_ktp,
      patientInfo.nm_pasien, // png_jawab
      patientInfo.alamat, // almt_pj
      patientInfo.nm_pasien, // hubunganpj
      patientInfo.stts_nikah, // stts_nikah (ulang)
      'SELAPARANG' // nm_kel
    ]);

    // Return data pasien baru
    return {
      no_rkm_medis: newRm,
      nm_pasien: patientInfo.nm_pasien,
      jk: patientInfo.jk === 'Laki-laki' ? 'L' : 'P',
      tmp_lahir: patientInfo.tmp_lahir,
      tgl_lahir: patientInfo.tgl_lahir,
      alamat: patientInfo.alamat,
      no_telp: patientInfo.no_telp,
      pekerjaan: patientInfo.pekerjaan,
      stts_nikah: patientInfo.stts_nikah,
      kd_pj: 'UMUM'
    };
  } catch (error) {
    console.error('Error creating new MCU patient:', error);
    throw error;
  }
}