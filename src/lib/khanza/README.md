# Struktur Folder: Integrasi SIMRS Khanza

Folder ini berisi semua file terkait integrasi dengan sistem informasi manajemen rumah sakit (SIMRS) Khanza.

## File-file Utama

### 1. khanza-integration-final.ts
File utama yang berisi semua fungsi untuk berinteraksi dengan database SIMRS Khanza, termasuk:
- Fungsi deteksi otomatis struktur tabel:
  - `detectKhanzaTableStructure()` - Mendeteksi struktur tabel SIMRS Khanza
  - `createKhanzaDbConnection()` - Membuat koneksi ke database SIMRS Khanza
- Fungsi manajemen pasien:
  - `findPatientByNIKInKhanza()` - Mencari pasien berdasarkan NIK
  - `findPatientByMedicalRecordNumberInKhanza()` - Mencari pasien berdasarkan nomor rekam medis
  - `getPatientsFromKhanza()` - Mendapatkan data pasien
- Fungsi untuk laporan keuangan:
  - `getDrugRevenueFromKhanza()` - Mendapatkan data pendapatan obat dengan auto-detection struktur
  - `getJournalDataFromKhanza()` - Mendapatkan data jurnal keuangan
  - `getFinancialDataFromKhanza()` - Mendapatkan data keuangan
  - `getReportsFromKhanza()` - Mendapatkan laporan keuangan
- Fungsi utilitas:
  - `testKhanzaConnection()` - Menguji koneksi ke database SIMRS Khanza
  - `executeQueryWithCache()` - Fungsi eksekusi query dengan caching

### 2. khanza-service.ts
File yang berisi class layanan untuk mengelola integrasi SIMRS Khanza:
- `KhanzaIntegrationService` - Class yang menyediakan metode-metode untuk mengakses semua fungsi integrasi

### 3. khanza-config.ts
File konfigurasi untuk koneksi dan pengaturan SIMRS Khanza:
- `KHANZA_CONFIG` - Konfigurasi koneksi database dan fitur-fitur lainnya

### 4. khanza-constants.ts
File yang berisi konstanta-konstanta untuk integrasi SIMRS Khanza:
- `KHANZA_TABLE_MAPPINGS` - Mapping struktur tabel SIMRS Khanza
- `DATE_COLUMN_NAMES`, `DESCRIPTION_COLUMN_NAMES`, dll - Daftar kemungkinan nama kolom
- `TRANSACTION_SOURCE_MAPPING` - Mapping sumber transaksi
- `FALLBACK_QUERIES` - Query-query fallback yang umum digunakan
- `DEFAULT_CACHE_CONFIG` - Konfigurasi cache default

### 5. khanza-registration.ts
File yang berisi fungsi-fungsi khusus untuk registrasi pasien:
- `registerToKhanza()` - Registrasi pasien ke SIMRS Khanza
- `convertToKhanzaPatient()` - Konversi data pasien ke format SIMRS Khanza
- `convertToKhanzaRegistration()` - Konversi data registrasi ke format SIMRS Khanza

### 6. types.ts
File yang berisi interface TypeScript untuk integrasi:
- Interface-interface untuk data pasien, jadwal dokter, dan laporan keuangan