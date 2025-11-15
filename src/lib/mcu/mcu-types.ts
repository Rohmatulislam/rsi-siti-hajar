// src/lib/mcu/mcu-types.ts

// Interface untuk data pasien MCU
export interface MCUPatient {
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

// Interface untuk paket MCU
export interface MCUPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  duration: string;
  details?: {
    dokter: string[];
    laboratorium: string[];
    radiologi: string[];
    penunjang: string[];
    persiapan: string[];
    catatan: string[];
  };
}

// Interface untuk registrasi MCU
export interface MCURegistration {
  booking_id: string;
  no_reg: string;
  no_rkm_medis: string;
  package_id: string;
  tanggal_mc: string;
  jam_reg: string;
  status: string;
}