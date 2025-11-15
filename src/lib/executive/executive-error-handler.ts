// src/lib/executive/executive-error-handler.ts

// Interface untuk error executive
export interface ExecutiveError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Kelas untuk menangani error executive
export class ExecutiveErrorHandler {
  static handle(error: any, context: string = 'executive'): ExecutiveError {
    // Log error ke konsol
    console.error(`[${context.toUpperCase()} ERROR]`, error);

    // Tentukan kode error berdasarkan jenis error
    let errorCode = 'EXECUTIVE_UNKNOWN_ERROR';
    let message = 'Terjadi kesalahan yang tidak terduga';

    if (error instanceof Error) {
      message = error.message;

      // Periksa jenis error
      if (error.message.includes('dokter tidak praktik')) {
        errorCode = 'EXECUTIVE_DOCTOR_NOT_AVAILABLE';
        message = 'Dokter tidak praktik hari ini atau jadwal tidak ditemukan';
      } else if (error.message.includes('kuota konsultasi')) {
        errorCode = 'EXECUTIVE_QUOTA_FULL';
        message = 'Kuota konsultasi hari ini telah penuh';
      } else if (error.message.includes('Rekam Medis tidak ditemukan')) {
        errorCode = 'EXECUTIVE_PATIENT_NOT_FOUND';
        message = 'Nomor Rekam Medis tidak ditemukan';
      } else if (error.message.includes('Koneksi database')) {
        errorCode = 'EXECUTIVE_DATABASE_CONNECTION_ERROR';
        message = 'Gagal terhubung ke database SIMRS';
      } else if (error.message.includes('validasi')) {
        errorCode = 'EXECUTIVE_VALIDATION_ERROR';
        message = error.message;
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    // Buat error object
    const executiveError: ExecutiveError = {
      code: errorCode,
      message,
      details: error instanceof Error ? error.stack : error,
      timestamp: new Date().toISOString()
    };

    return executiveError;
  }

  // Fungsi untuk menangani error query database
  static handleDbError(error: any): ExecutiveError {
    return this.handle(error, 'database');
  }

  // Fungsi untuk menangani error registrasi
  static handleRegistrationError(error: any): ExecutiveError {
    return this.handle(error, 'registration');
  }

  // Fungsi untuk menangani error validasi
  static handleValidationError(error: any): ExecutiveError {
    return this.handle(error, 'validation');
  }
}

// Fungsi helper untuk membuat error executive
export function createExecutiveError(code: string, message: string, details?: any): ExecutiveError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };
}