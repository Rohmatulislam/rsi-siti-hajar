import mysql from 'mysql2/promise';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { KHANZA_CONFIG } from './khanza-config';

// Interface untuk koneksi database SIMRS Khanza
interface KhanzaDbConnection {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Fungsi untuk membuat koneksi ke database SIMRS Khanza
export async function createKhanzaDbConnection(): Promise<Connection> {
  const connectionConfig: KhanzaDbConnection = {
    host: process.env.KHANZA_DB_HOST || KHANZA_CONFIG.DB_HOST,
    port: parseInt(process.env.KHANZA_DB_PORT || KHANZA_CONFIG.DB_PORT.toString()),
    user: process.env.KHANZA_DB_USER || KHANZA_CONFIG.DB_USER,
    password: process.env.KHANZA_DB_PASSWORD || KHANZA_CONFIG.DB_PASSWORD || '',
    database: process.env.KHANZA_DB_NAME || KHANZA_CONFIG.DB_NAME,
  };

  // Validasi bahwa semua kredensial telah disediakan
  if (!connectionConfig.host || !connectionConfig.user || !connectionConfig.database) {
    throw new Error(
      'Kredensial database SIMRS Khanza tidak lengkap. Harap atur KHANZA_DB_HOST, KHANZA_DB_USER, KHANZA_DB_PASSWORD, dan KHANZA_DB_NAME di environment variables'
    );
  }

  const connection = await mysql.createConnection(connectionConfig);
  return connection;
}

// Fungsi untuk mencari pasien di database SIMRS Khanza berdasarkan NIK
export async function findPatientByNIKInKhanza(nik: string): Promise<any | null> {
  let connection: Connection | null = null;
  
  try {
    connection = await createKhanzaDbConnection();
    
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM pasien WHERE no_ktp = ? LIMIT 1',
      [nik]
    );
    
    const patients = Array.isArray(rows) ? rows : [];
    
    if (patients.length > 0) {
      return patients[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error saat mencari pasien di database SIMRS Khanza:', error);
    throw new Error(`Gagal mencari pasien di SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Fungsi untuk mencari pasien di database SIMRS Khanza berdasarkan nomor rekam medis
export async function findPatientByMedicalRecordNumberInKhanza(mrn: string): Promise<any | null> {
  let connection: Connection | null = null;
  
  try {
    connection = await createKhanzaDbConnection();
    
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM pasien WHERE no_rkm_medis = ? LIMIT 1',
      [mrn]
    );
    
    const patients = Array.isArray(rows) ? rows : [];
    
    if (patients.length > 0) {
      return patients[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error saat mencari pasien di database SIMRS Khanza berdasarkan nomor rekam medis:', error);
    throw new Error(`Gagal mencari pasien di SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Fungsi untuk menambahkan pasien baru ke database SIMRS Khanza
export async function addPatientToKhanza(patientData: any): Promise<string> {
  let connection: Connection | null = null;
  
  try {
    connection = await createKhanzaDbConnection();
    
    // Periksa apakah pasien sudah ada
    const existingPatient = await findPatientByNIKInKhanza(patientData.no_ktp);
    if (existingPatient) {
      // Jika pasien sudah ada, kembalikan nomor rekam medis yang ada
      return existingPatient.no_rkm_medis;
    }
    
    // Jika pasien belum ada, tambahkan pasien baru
    const {
      nm_pasien,
      no_ktp,
      jk,
      tmp_lahir,
      tgl_lahir,
      alamat,
      no_tlp,
      pekerjaan,
      stts_nikah,
      kd_pj,
      no_peserta,
      umur,
      pnd,
      keluarga,
      namakeluarga
    } = patientData;
    
    const [result] = await connection.execute<mysql.OkPacket>(
      `INSERT INTO pasien (
        nm_pasien, no_ktp, jk, tmp_lahir, tgl_lahir, alamat, no_tlp, 
        pekerjaan, stts_nikah, kd_pj, no_peserta, umur, pnd, keluarga, namakeluarga,
        tgl_daftar, kd_kec, kd_kab, kd_prop, no_ibu, nip, anamnesa, kd_dokter, 
        kd_penandai, generik, status, prioritas_keluarga, no_peserta_sebelumnya, 
        penerima_bpjs, no_urut_registrasi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), '', '', '', '', '', '', '', '', '0', '')`,
      [
        nm_pasien, no_ktp, jk, tmp_lahir, tgl_lahir, alamat, no_tlp,
        pekerjaan, stts_nikah, kd_pj, no_peserta, umur, pnd, keluarga, namakeluarga
      ]
    );
    
    // Karena SIMRS Khanza biasanya auto-generate nomor rekam medis, 
    // kita perlu dapatkan kembali data pasien yang baru dibuat
    const newPatient = await findPatientByNIKInKhanza(no_ktp);
    
    return newPatient ? newPatient.no_rkm_medis : '';
  } catch (error) {
    console.error('Error saat menambahkan pasien ke database SIMRS Khanza:', error);
    throw new Error(`Gagal menambahkan pasien ke SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Fungsi untuk mendaftarkan pasien ke rawat jalan di SIMRS Khanza
export async function registerPatientToKhanzaOutpatient(
  medicalRecordNumber: string, 
  polyclinicCode: string, 
  doctorCode: string
): Promise<string> {
  let connection: Connection | null = null;
  
  try {
    connection = await createKhanzaDbConnection();
    
    // Dapatkan nomor urut terakhir untuk poliklinik ini
    const [lastQueueResult] = await connection.execute<mysql.RowDataPacket[]>( // Gunakan RowDataPacket[]
      `SELECT MAX(CONVERT(SUBSTRING(no_reg, 2), UNSIGNED)) as last_queue 
       FROM reg_periksa 
       WHERE kd_poli = ? AND tgl_registrasi = CURDATE()`,
      [polyclinicCode]
    );
    
    // Pastikan lastQueueResult adalah array sebelum mengakses index
    const lastQueue = Array.isArray(lastQueueResult) && lastQueueResult.length > 0 
      ? (lastQueueResult[0] as any).last_queue || 0 // Type assertion ke 'any' untuk mengakses properti
      : 0;
    const newQueueNumber = String(lastQueue + 1).padStart(3, '0');
    const registrationNumber = `${polyclinicCode.substring(0, 3)}${newQueueNumber}`;
    
    // Tambahkan registrasi rawat jalan
    await connection.execute(
      `INSERT INTO reg_periksa (
        no_reg, no_rawat, no_rkm_medis, kd_dokter, kd_poli, 
        tgl_registrasi, jam_reg, kd_pj, stts, stts_daftar, 
        prioritas, no_rujukan, kd_penyakit, kd_prosedur, 
        status_pulang
      ) VALUES (?, '', ?, ?, ?, CURDATE(), CURTIME(), ?, 'Belum', 'Lama', 0, '', '', '', '')`,
      [
        registrationNumber,
        medicalRecordNumber,
        doctorCode,
        polyclinicCode,
        'UMUM' // Default penjamin
      ]
    );
    
    return registrationNumber;
  } catch (error) {
    console.error('Error saat mendaftarkan pasien ke rawat jalan SIMRS Khanza:', error);
    throw new Error(`Gagal mendaftarkan pasien ke rawat jalan SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Fungsi untuk sinkronisasi data pasien dari SIMRS Khanza ke sistem lokal
export async function syncPatientDataFromKhanza(nik: string): Promise<any | null> {
  try {
    const khanzaPatient = await findPatientByNIKInKhanza(nik);
    
    if (khanzaPatient) {
      // Format data untuk disinkronkan ke sistem lokal
      const syncData = {
        nik: khanzaPatient.no_ktp,
        name: khanzaPatient.nm_pasien,
        gender: khanzaPatient.jk === 'L' ? 'Laki-laki' : 'Perempuan',
        birthDate: khanzaPatient.tgl_lahir,
        address: khanzaPatient.alamat,
        phone: khanzaPatient.no_tlp,
        medicalRecordNumber: khanzaPatient.no_rkm_medis,
        patientType: 'lama', // Karena data diambil dari SIMRS yang berarti pasien sudah terdaftar
      };
      
      return syncData;
    }
    
    return null;
  } catch (error) {
    console.error('Error saat menyinkronkan data pasien dari SIMRS Khanza:', error);
    throw new Error(`Gagal menyinkronkan data pasien dari SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  }
}

// Fungsi untuk mendapatkan jadwal dokter dari SIMRS Khanza
export async function getDoctorSchedulesFromKhanza(doctorCode?: string, date?: string): Promise<any[]> {
  let connection;
  
  try {
    connection = await createKhanzaDbConnection();
    
    let query = `
      SELECT 
        d.nm_dokter as doctor_name,
        d.kd_dokter as doctor_code,
        s.kd_poli as polyclinic_code,
        p.nm_poli as polyclinic_name,
        s.jam_mulai as start_time,
        s.jam_selesai as end_time,
        s.kuota as max_patients,
        s.jumlah as current_patients,
        s.hari as day_of_week,
        s.tanggal as schedule_date
      FROM jadwal s
      JOIN dokter d ON s.kd_dokter = d.kd_dokter
      JOIN poliklinik p ON s.kd_poli = p.kd_poli
      WHERE s.jadwal = '1'  -- Jadwal aktif
    `;
    
    const params: any[] = [];
    
    if (doctorCode) {
      query += ` AND d.kd_dokter = ?`;
      params.push(doctorCode);
    }
    
    if (date) {
      query += ` AND s.tanggal = ?`;
      params.push(date);
    }
    
    query += ` ORDER BY s.kd_poli, d.nm_dokter, s.jam_mulai`;
    
    const [rows] = await connection.execute(query, params);
    
    // Konversi hasil ke format array jika perlu
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Error saat mengambil jadwal dokter dari SIMRS Khanza:', error);
    throw new Error(`Gagal mengambil jadwal dokter dari SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Fungsi untuk mendapatkan daftar dokter aktif dari SIMRS Khanza
export async function getActiveDoctorsFromKhanza(): Promise<any[]> {
  let connection;
  
  try {
    connection = await createKhanzaDbConnection();
    
    const query = `
      SELECT 
        d.kd_dokter as doctor_code,
        d.nm_dokter as doctor_name,
        d.almt as address,
        d.jk as gender,
        d.tmp_lahir as birth_place,
        d.tgl_lahir as birth_date,
        d.gol_drh as blood_type,
        d.agama as religion,
        d.nm_sps as specialty,
        d.almt_tgl as practice_address
      FROM dokter d
      WHERE d.status = '1'  -- Dokter aktif
      ORDER BY d.nm_dokter
    `;
    
    const [rows] = await connection.execute(query);
    
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Error saat mengambil daftar dokter dari SIMRS Khanza:', error);
    throw new Error(`Gagal mengambil daftar dokter dari SIMRS Khanza: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Fungsi untuk menguji koneksi ke database SIMRS Khanza
 */
export async function testKhanzaConnection(): Promise<{ 
  success: boolean; 
  message: string; 
  version?: string;
  tables?: string[];
}> {
  let connection;
  
  try {
    console.log('Mencoba membuat koneksi ke database SIMRS Khanza...');
    
    // Buat koneksi ke database SIMRS
    connection = await createKhanzaDbConnection();
    
    console.log('Koneksi berhasil dibuat. Mengambil informasi database...');
    
    // Uji koneksi dengan mengambil versi database
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    const version = Array.isArray(versionResult) && versionResult[0] 
      ? (versionResult[0] as any).version 
      : 'Unknown';
    
    // Ambil beberapa nama tabel untuk verifikasi
    const [tablesResult] = await connection.execute(
      "SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() LIMIT 10"
    );
    
    const tables = Array.isArray(tablesResult) 
      ? tablesResult.map((row: any) => row.name) 
      : [];
    
    // Coba akses tabel pasien untuk verifikasi struktur
    try {
      const [patientTable] = await connection.execute("SHOW COLUMNS FROM pasien");
      if (!Array.isArray(patientTable) || patientTable.length === 0) {
        throw new Error("Tabel 'pasien' tidak ditemukan atau tidak dapat diakses");
      }
    } catch (tableError) {
      console.warn("Peringatan: Tidak dapat mengakses tabel 'pasien':", tableError);
    }
    
    console.log('Koneksi ke database SIMRS Khanza berhasil!');
    
    return {
      success: true,
      message: `Terhubung ke database SIMRS Khanza. Versi: ${version}`,
      version,
      tables
    };
  } catch (error) {
    console.error('Error saat menguji koneksi ke database SIMRS Khanza:', error);
    
    if (error instanceof Error) {
      let message = error.message;
      
      if (message.includes('ECONNREFUSED')) {
        message = 'Tidak dapat terhubung ke server database. Pastikan host dan port benar serta server database aktif.';
      } else if (message.includes('Access denied')) {
        message = 'Akses ke database ditolak. Periksa username dan password.';
      } else if (message.includes('Unknown database')) {
        message = 'Database tidak ditemukan. Periksa nama database.';
      } else if (message.includes('getaddrinfo ENOTFOUND')) {
        message = 'Alamat host tidak ditemukan. Periksa konfigurasi host.';
      }
      
      return {
        success: false,
        message: `Koneksi gagal: ${message}`
      };
    }
    
    return {
      success: false,
      message: 'Koneksi gagal: Kesalahan tidak dikenal'
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Koneksi database ditutup.');
      } catch (closeError) {
        console.error('Error saat menutup koneksi:', closeError);
      }
    }
  }
}