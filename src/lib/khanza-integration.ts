import { PatientFormData, AppointmentFormData } from '@/lib/patient-service';
import { KHANZA_CONFIG, KHANZA_MAPPING } from '@/lib/khanza-config';

// Interface untuk data pasien dalam format SIMRS Khanza
export interface KhanzaPatientData {
  no_rkm_medis: string; // Nomor rekam medis
  nm_pasien: string; // Nama pasien
  no_ktp: string; // Nomor KTP (NIK)
  jk: 'L' | 'P'; // Jenis kelamin (L=Pria, P=Perempuan)
  tmp_lahir: string; // Tempat lahir
  tgl_lahir: string; // Tanggal lahir
  alamat: string; // Alamat
  no_tlp: string; // Nomor telepon
  pekerjaan: string; // Pekerjaan
  stts_nikah: string; // Status pernikahan
  kd_pj: string; // Kode penjamin
  no_peserta: string; // Nomor peserta BPJS (jika ada)
  umur: string; // Umur
  pnd: string; // Pendidikan
  keluarga: string; // Hubungan keluarga
  namakeluarga: string; // Nama keluarga
  tgllahir: string; // Tanggal lahir
}

// Interface untuk data pendaftaran rawat jalan
export interface KhanzaRegistrationData {
  no_rkm_medis: string; // Nomor rekam medis
  kd_dokter: string; // Kode dokter
  kd_poli: string; // Kode poli
  tgl_registrasi: string; // Tanggal registrasi
  jam_reg: string; // Jam registrasi
  no_urut: string; // Nomor urut
  kd_pj: string; // Kode penjamin
  no_reg: string; // Nomor registrasi
  status_lanjut: string; // Status lanjut
  kd_dpjp: string; // Kode DPJP
  stts: string; // Status
  stts_daftar: string; // Status daftar
  prioritas: string; // Prioritas
  no_rujukan: string; // Nomor rujukan
  kd_penyakit: string; // Kode penyakit
  kd_prosedur: string; // Kode prosedur
  status_pulang: string; // Status pulang
}

// Fungsi untuk mengkonversi data pasien dari formulir kita ke format SIMRS Khanza
export function convertToKhanzaPatient(patientData: Omit<PatientFormData, 'medicalRecordNumber'>): KhanzaPatientData {
  // Konversi jenis kelamin
  const genderCode = KHANZA_MAPPING.GENDER;
  
  // Menghitung umur dari tanggal lahir
  const birthDate = patientData.birthDate ? new Date(patientData.birthDate) : new Date();
  const today = new Date();
  const age = patientData.birthDate 
    ? Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  return {
    no_rkm_medis: '', // Akan di-generate oleh SIMRS Khanza
    nm_pasien: patientData.name || 'Nama Tidak Tersedia',
    no_ktp: patientData.nik || '',
    jk: patientData.gender === 'Laki-laki' ? 'L' : 'P', // Konversi ke format SIMRS Khanza
    tmp_lahir: '', // Tidak ada di formulir kita, dapat diisi nanti
    tgl_lahir: patientData.birthDate || new Date().toISOString().split('T')[0], // Tanggal lahir default ke hari ini jika tidak tersedia
    alamat: patientData.address || 'Alamat Tidak Tersedia',
    no_tlp: patientData.phone || '',
    pekerjaan: '', // Tidak ada di formulir kita
    stts_nikah: KHANZA_MAPPING.MARITAL_STATUS['BELUM_KAWIN'], // Default, bisa diupdate nanti
    kd_pj: KHANZA_MAPPING.PAYOR['UMUM'], // Default, bisa diupdate nanti
    no_peserta: '', // Jika punya BPJS
    umur: `${age} Th`,
    pnd: '', // Pendidikan, tidak ada di formulir
    keluarga: 'WARGA', // Hubungan keluarga default
    namakeluarga: patientData.name || 'Nama Keluarga Tidak Tersedia', // Nama keluarga default
    tgllahir: patientData.birthDate || new Date().toISOString().split('T')[0],
  };
}

// Fungsi untuk mengkonversi data appointment ke format SIMRS Khanza
export function convertToKhanzaRegistration(appointmentData: AppointmentFormData, medicalRecordNumber: string): KhanzaRegistrationData {
  const now = new Date();
  const timeString = now.toTimeString().substring(0, 8); // Format HH:MM:SS

  return {
    no_rkm_medis: medicalRecordNumber,
    kd_dokter: (KHANZA_MAPPING.DOCTOR as Record<string, string>)[appointmentData.doctor] || 'DR001', // Default dokter
    kd_poli: (KHANZA_MAPPING.POLYCLINIC as Record<string, string>)[appointmentData.polyclinic] || 'UMUM', // Default poli
    tgl_registrasi: now.toISOString().split('T')[0], // Format YYYY-MM-DD
    jam_reg: timeString,
    no_urut: '1', // Akan di-generate oleh SIMRS Khanza
    kd_pj: (KHANZA_MAPPING.PAYOR as Record<string, string>)['UMUM'], // Default penjamin
    no_reg: '', // Akan di-generate oleh SIMRS Khanza
    status_lanjut: 'Baru', // Baru atau Lama
    kd_dpjp: (KHANZA_MAPPING.DOCTOR as Record<string, string>)[appointmentData.doctor] || 'DR001', // Default DPJP
    stts: 'Belum', // Status pemeriksaan
    stts_daftar: 'Lama', // Status daftar
    prioritas: '0', // Default prioritas
    no_rujukan: '', // Jika ada rujukan
    kd_penyakit: '', // Kode penyakit
    kd_prosedur: '', // Kode prosedur
    status_pulang: '', // Status pulang
  };
}

// Fungsi untuk menghubungi SIMRS Khanza melalui akses database langsung atau modul bridging
export async function registerToKhanza(patientData: PatientFormData, appointmentData: AppointmentFormData) {
  const hasBridgingUrl = !!process.env.KHANZA_BASE_URL;
  const hasDatabaseConfig = !!(process.env.KHANZA_DB_HOST && process.env.KHANZA_DB_USER && process.env.KHANZA_DB_NAME);

  // Cek apakah kita bisa menggunakan akses database langsung
  if (hasDatabaseConfig) {
    return await registerToKhanzaViaDatabase(patientData, appointmentData);
  } 
  // Jika tidak ada akses database, cek apakah kita bisa menggunakan modul bridging
  else if (hasBridgingUrl) {
    return await registerToKhanzaViaBridging(patientData, appointmentData);
  } else {
    // Jika tidak ada metode integrasi yang tersedia, hanya simpan di sistem lokal
    console.warn('Tidak ada metode integrasi SIMRS Khanza tersedia, hanya menyimpan di sistem lokal');

    // Kembalikan data dengan nomor antrian lokal
    return {
      khanzaPatientResult: { no_rkm_medis: null }, // Hasil minimal
      khanzaRegistrationResult: null, // Hasil registrasi
      // Data tambahan yang bisa digunakan dalam sistem kita
      localMedicalRecordNumber: null,
      queueNumber: 'LCL-' + Math.floor(1000 + Math.random() * 9000), // Nomor antrian lokal
      appointmentDate: new Date().toISOString().split('T')[0],
    };
  }
}

// Fungsi untuk registrasi melalui akses database langsung
async function registerToKhanzaViaDatabase(patientData: PatientFormData, appointmentData: AppointmentFormData) {
  // Impor fungsi dari modul khanza-db-integration
  const {
    findPatientByNIKInKhanza,
    addPatientToKhanza,
    registerPatientToKhanzaOutpatient
  } = await import('./khanza-db-integration');

  try {
    // Langkah 1: Cek apakah pasien sudah terdaftar di SIMRS Khanza berdasarkan NIK
    console.log('Mengecek keberadaan pasien di database SIMRS Khanza...');
    
    if (!patientData.nik) {
      throw new Error('NIK pasien tidak tersedia. Silakan lengkapi informasi pasien terlebih dahulu.');
    }
    
    let khanzaPatient = await findPatientByNIKInKhanza(patientData.nik);
    let medicalRecordNumber = '';
    
    if (khanzaPatient) {
      // Jika pasien sudah ada, gunakan nomor rekam medis yang ada
      medicalRecordNumber = khanzaPatient.no_rkm_medis;
      console.log(`Pasien ditemukan di SIMRS Khanza dengan nomor rekam medis: ${medicalRecordNumber}`);
    } else {
      console.log('Mendaftarkan pasien baru ke database SIMRS Khanza...');
      
      // Validasi data pasien sebelum konversi
      if (!patientData.name) {
        throw new Error('Nama pasien tidak boleh kosong');
      }
      
      if (!patientData.phone) {
        throw new Error('Nomor telepon pasien tidak boleh kosong');
      }
      
      // Konversi data pasien ke format SIMRS Khanza
      const khanzaPatientData = convertToKhanzaPatient(patientData);
      
      // Tambahkan pasien baru ke database SIMRS Khanza
      medicalRecordNumber = await addPatientToKhanza(khanzaPatientData);
      
      if (!medicalRecordNumber) {
        throw new Error('SIMRS Khanza tidak mengembalikan nomor rekam medis');
      }
      
      console.log(`Pasien baru berhasil didaftarkan dengan nomor rekam medis: ${medicalRecordNumber}`);
    }

    // Langkah 2: Registrasi rawat jalan
    console.log('Mendaftarkan rawat jalan ke database SIMRS Khanza...');
    
    // Convert polyclinic and doctor to Khanza codes
    const polyclinicCode = (KHANZA_MAPPING.POLYCLINIC as Record<string, string>)[appointmentData.polyclinic] || appointmentData.polyclinic;
    const doctorCode = (KHANZA_MAPPING.DOCTOR as Record<string, string>)[appointmentData.doctor] || appointmentData.doctor;
    
    const registrationNumber = await registerPatientToKhanzaOutpatient(
      medicalRecordNumber,
      polyclinicCode as string,
      doctorCode as string
    );

    // Kembalikan hasil untuk digunakan dalam sistem kita
    return {
      khanzaPatientResult: { no_rkm_medis: medicalRecordNumber }, // Hasil minimal
      khanzaRegistrationResult: { no_reg: registrationNumber }, // Hasil registrasi
      // Data tambahan yang bisa digunakan dalam sistem kita
      localMedicalRecordNumber: medicalRecordNumber,
      queueNumber: registrationNumber,
      appointmentDate: new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error dalam proses registrasi ke SIMRS Khanza via database:', error);
    throw new Error(`Registrasi SIMRS Khanza via database gagal: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  }
}

// Fungsi untuk registrasi melalui modul bridging (jika tersedia)
async function registerToKhanzaViaBridging(patientData: PatientFormData, appointmentData: AppointmentFormData) {
  const khanzaApiKey = process.env.KHANZA_BRIDGING_API_KEY; // Jika menggunakan bridging dengan otentikasi
  const khanzaBaseUrl = process.env.KHANZA_BASE_URL || KHANZA_CONFIG.BASE_URL;

  // Validasi data pasien sebelum konversi
  if (!patientData.nik) {
    throw new Error('NIK pasien tidak boleh kosong');
  }
  
  if (!patientData.name) {
    throw new Error('Nama pasien tidak boleh kosong');
  }
  
  if (!patientData.phone) {
    throw new Error('Nomor telepon pasien tidak boleh kosong');
  }
  
  // Konversi data ke format SIMRS Khanza
  const khanzaPatient = convertToKhanzaPatient(patientData);
  let khanzaRegistration = convertToKhanzaRegistration(appointmentData, '');

  try {
    // Langkah 1: Cek apakah pasien sudah terdaftar di SIMRS Khanza berdasarkan NIK
    console.log('Mengecek keberadaan pasien di SIMRS Khanza melalui bridging...');
    
    // Tambahkan header otentikasi jika API Key tersedia
    const headers: Record<string, string> = {
      ...KHANZA_CONFIG.HEADERS,
    };
    
    if (khanzaApiKey) {
      headers['Authorization'] = `Bearer ${khanzaApiKey}`;
    }

    // Cek keberadaan pasien (menggunakan modul bridging jika tersedia)
    let medicalRecordNumber = '';
    
    if (!patientData.nik) {
      throw new Error('NIK pasien tidak tersedia. Silakan lengkapi informasi pasien terlebih dahulu.');
    }
    
    if (khanzaBaseUrl) {
      const checkResponse = await fetch(`${khanzaBaseUrl}${KHANZA_CONFIG.ENDPOINTS.PATIENT_SEARCH}?no_ktp=${patientData.nik}`, {
        method: 'GET',
        headers: headers,
      });

      if (checkResponse.ok) {
        const existingPatient = await checkResponse.json();
        if (existingPatient && existingPatient.no_rkm_medis) {
          // Jika pasien sudah ada, gunakan nomor rekam medis yang ada
          medicalRecordNumber = existingPatient.no_rkm_medis;
          console.log(`Pasien ditemukan di SIMRS Khanza dengan nomor rekam medis: ${medicalRecordNumber}`);
        }
      }
    }

    // Jika pasien belum terdaftar di SIMRS Khanza melalui bridging, coba daftarkan pasien baru
    if (!medicalRecordNumber) {
      console.log('Mendaftarkan pasien baru ke SIMRS Khanza...');
      
      let response = await fetch(`${khanzaBaseUrl}${KHANZA_CONFIG.ENDPOINTS.PATIENT}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(khanzaPatient),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response dari SIMRS Khanza:', error);
        throw new Error(`Gagal mendaftarkan pasien ke SIMRS Khanza: ${error.message || response.statusText}`);
      }

      const patientResult = await response.json();
      medicalRecordNumber = patientResult.no_rkm_medis || patientResult.data?.no_rkm_medis;
      
      if (!medicalRecordNumber) {
        throw new Error('SIMRS Khanza tidak mengembalikan nomor rekam medis');
      }
      
      console.log(`Pasien baru berhasil didaftarkan dengan nomor rekam medis: ${medicalRecordNumber}`);
    } else {
      console.log('Memperbarui data pasien yang sudah ada di SIMRS Khanza...');
      // Jika pasien sudah ada, kita bisa memperbarui data jika perlu
      await updatePatientInKhanza(medicalRecordNumber, khanzaPatient);
    }

    // Persiapkan data registrasi dengan nomor rekam medis yang valid
    khanzaRegistration = {
      ...khanzaRegistration,
      no_rkm_medis: medicalRecordNumber
    };

    // Langkah 2: Registrasi rawat jalan
    console.log('Mendaftarkan rawat jalan ke SIMRS Khanza...');
    const registrationResponse = await fetch(`${khanzaBaseUrl}${KHANZA_CONFIG.ENDPOINTS.REGISTRATION}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(khanzaRegistration),
    });

    if (!registrationResponse.ok) {
      const error = await registrationResponse.json();
      console.error('Error registrasi rawat jalan dari SIMRS Khanza:', error);
      throw new Error(`Gagal mendaftarkan rawat jalan ke SIMRS Khanza: ${error.message || registrationResponse.statusText}`);
    }

    const registrationResult = await registrationResponse.json();
    
    // Kembalikan hasil untuk digunakan dalam sistem kita
    return {
      khanzaPatientResult: { no_rkm_medis: medicalRecordNumber }, // Hasil minimal
      khanzaRegistrationResult: registrationResult, // Hasil registrasi
      // Data tambahan yang bisa digunakan dalam sistem kita
      localMedicalRecordNumber: medicalRecordNumber,
      queueNumber: registrationResult.no_reg || registrationResult.no_urut || '001',
      appointmentDate: khanzaRegistration.tgl_registrasi,
    };
  } catch (error) {
    console.error('Error dalam proses registrasi ke SIMRS Khanza:', error);
    throw new Error(`Registrasi SIMRS Khanza gagal: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
  }
}

// Fungsi untuk mengambil jadwal dokter dari SIMRS Khanza
export async function getDoctorSchedulesFromKhanza(doctorCode?: string, date?: string) {
  // Impor fungsi dari modul khanza-db-integration
  const { getDoctorSchedulesFromKhanza: getKhanzaSchedules } = await import('./khanza-db-integration');

  try {
    const schedules = await getKhanzaSchedules(doctorCode, date);
    return schedules;
  } catch (error) {
    console.error('Error dalam pengambilan jadwal dokter dari SIMRS Khanza:', error);
    throw error;
  }
}

// Fungsi untuk mengambil daftar dokter aktif dari SIMRS Khanza
export async function getActiveDoctorsFromKhanza() {
  // Impor fungsi dari modul khanza-db-integration
  const { getActiveDoctorsFromKhanza: getKhanzaDoctors } = await import('./khanza-db-integration');

  try {
    const doctors = await getKhanzaDoctors();
    return doctors;
  } catch (error) {
    console.error('Error dalam pengambilan daftar dokter dari SIMRS Khanza:', error);
    throw error;
  }
}

// Fungsi bantu untuk memperbarui data pasien yang sudah ada
async function updatePatientInKhanza(medicalRecordNumber: string, patientData: KhanzaPatientData) {
  const khanzaApiKey = process.env.KHANZA_BRIDGING_API_KEY;
  const khanzaBaseUrl = process.env.KHANZA_BASE_URL || KHANZA_CONFIG.BASE_URL;

  if (!khanzaBaseUrl) {
    console.warn('URL bridging SIMRS Khanza tidak tersedia, tidak bisa memperbarui data pasien');
    return;
  }

  // Tambahkan header otentikasi jika API Key tersedia
  const headers: Record<string, string> = {
    ...KHANZA_CONFIG.HEADERS,
  };
  
  if (khanzaApiKey) {
    headers['Authorization'] = `Bearer ${khanzaApiKey}`;
  }

  try {
    const response = await fetch(`${khanzaBaseUrl}${KHANZA_CONFIG.ENDPOINTS.PATIENT}/${medicalRecordNumber}`, {
      method: 'PUT', // atau 'PATCH' tergantung implementasi SIMRS
      headers: headers,
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      console.warn(`Gagal memperbarui data pasien di SIMRS Khanza: ${response.statusText}`);
      // Tidak melempar error karena ini hanya pembaruan opsional
    } else {
      console.log(`Data pasien berhasil diperbarui di SIMRS Khanza`);
    }
  } catch (error) {
    console.warn('Gagal memperbarui data pasien di SIMRS Khanza:', error);
    // Tidak melempar error karena ini hanya pembaruan opsional
  }
}

// Fungsi untuk cek ketersediaan antrian di SIMRS Khanza
export async function checkAvailableAppointments(date: string, polyclinic: string, doctor?: string) {
  const khanzaApiKey = process.env.KHANZA_BRIDGING_API_KEY;
  const khanzaBaseUrl = process.env.KHANZA_BASE_URL || KHANZA_CONFIG.BASE_URL;

  if (!khanzaBaseUrl) {
    throw new Error('URL bridging SIMRS Khanza tidak tersedia');
  }

  try {
    // Tambahkan header otentikasi jika API Key tersedia
    const headers: Record<string, string> = {
      ...KHANZA_CONFIG.HEADERS,
    };
    
    if (khanzaApiKey) {
      headers['Authorization'] = `Bearer ${khanzaApiKey}`;
    }

    let url = `${khanzaBaseUrl}${KHANZA_CONFIG.ENDPOINTS.REGISTRATION_AVAILABLE}?tanggal=${date}&kd_poli=${(KHANZA_MAPPING.POLYCLINIC as Record<string, string>)[polyclinic] || polyclinic}`;
    if (doctor) {
      url += `&kd_dokter=${(KHANZA_MAPPING.DOCTOR as Record<string, string>)[doctor] || doctor}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data ketersediaan antrian: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error dalam cek ketersediaan antrian ke SIMRS Khanza:', error);
    throw error;
  }
}