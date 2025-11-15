// src/lib/executive/executive-validation.ts

// Interface untuk hasil validasi
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Fungsi untuk memvalidasi nomor rekam medis
export function validateNoRkmMedis(noRkmMedis: string): ValidationResult {
  const errors: string[] = [];
  
  if (!noRkmMedis) {
    errors.push('Nomor rekam medis harus diisi');
  } else if (noRkmMedis.length < 6 || noRkmMedis.length > 10) {
    errors.push('Nomor rekam medis harus terdiri dari 6-10 karakter');
  } else if (!/^[a-zA-Z0-9]+$/.test(noRkmMedis)) {
    errors.push('Nomor rekam medis hanya boleh terdiri dari huruf dan angka');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Fungsi untuk memvalidasi kode dokter
export function validateKdDokter(kdDokter: string): ValidationResult {
  const errors: string[] = [];
  
  if (!kdDokter) {
    errors.push('Kode dokter harus diisi');
  } else if (!/^DR\d{3,6}$/.test(kdDokter)) {
    // Format kode dokter bisa bervariasi tergantung SIMRS, ini hanya contoh
    errors.push('Format kode dokter tidak valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Fungsi untuk memvalidasi data pendaftaran
export function validateRegistrationData(
  noRkmMedis: string, 
  kdDokter: string
): ValidationResult {
  const errors: string[] = [];
  
  // Validasi nomor rekam medis
  const noRkmMedisValidation = validateNoRkmMedis(noRkmMedis);
  if (!noRkmMedisValidation.isValid) {
    errors.push(...noRkmMedisValidation.errors);
  }
  
  // Validasi kode dokter
  const kdDokterValidation = validateKdDokter(kdDokter);
  if (!kdDokterValidation.isValid) {
    errors.push(...kdDokterValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Fungsi untuk memvalidasi tanggal konsultasi
export function validateConsultationDate(dateString: string): ValidationResult {
  const errors: string[] = [];
  
  if (!dateString) {
    errors.push('Tanggal konsultasi harus diisi');
    return {
      isValid: false,
      errors
    };
  }
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Cek apakah tanggal valid
  if (isNaN(date.getTime())) {
    errors.push('Format tanggal tidak valid');
  } else if (date < today) {
    errors.push('Tanggal konsultasi tidak boleh di masa lalu');
  } else if (date.getDate() === today.getDate() && 
             date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear()) {
    // Jika tanggal sama dengan hari ini, cek apakah masih dalam jam operasional
    const currentHour = new Date().getHours();
    if (currentHour >= 16) { // Setelah jam 4 sore, tidak bisa daftar hari ini
      errors.push('Pendaftaran untuk hari ini sudah ditutup');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}