# Sistem Poli Eksekutif RSI Siti Hajar

## Overview
Sistem Poli Eksekutif adalah modul dalam aplikasi RSI Siti Hajar yang bertujuan untuk menyediakan layanan pendaftaran dan informasi untuk pasien yang ingin menggunakan layanan poli eksekutif. Sistem ini diintegrasikan dengan database SIMRS Khanza melalui wrapper Supabase dengan pendekatan terintegrasi menggunakan tabel-tabel yang sudah ada.

## Arsitektur Sistem

### 1. Integrasi Database
- Sistem ini mengakses database SIMRS Khanza (MySQL) secara langsung
- Data dari SIMRS disinkronkan ke Supabase untuk backup dan analisis
- Wrapper Supabase digunakan sebagai interface database
- Pendekatan terintegrasi: menggunakan tabel-tabel yang sudah ada dengan kolom tambahan

### 2. Flow Data
1. Data dokter, jadwal, pasien, dan registrasi diambil dari SIMRS Khanza
2. Data tersebut disinkronkan ke Supabase setiap 30 menit
3. Aplikasi frontend mengakses data melalui API routes
4. Pendaftaran pasien dilakukan langsung ke SIMRS, dengan backup ke Supabase (menggunakan kolom is_executive = true)

## Komponen Utama

### API Routes
- `POST /api/executive/register` - untuk mendaftar pasien ke poli eksekutif
- `GET /api/executive/doctors` - untuk mendapatkan daftar dokter
- `GET /api/executive/patients/[id]` - untuk mendapatkan detail pasien

### Fungsi Utama
- `getExecutiveDoctors()` - mendapatkan daftar dokter spesialis
- `getExecutivePatient()` - mendapatkan detail pasien
- `registerExecutivePatient()` - mendaftarkan pasien ke poli eksekutif
- `saveExecutiveRegistrationToSupabase()` - menyimpan data registrasi ke Supabase

## Sinkronisasi Data
- Dilakukan secara otomatis setiap 30 menit melalui cron job
- Data utama tetap disimpan di SIMRS Khanza
- Supabase digunakan sebagai backup dan analisis
- Cron job diinisialisasi saat service dijalankan

## Struktur Tabel Supabase (Pendekatan Terintegrasi)

### Tabel doctors (diperluas)
Kolom tambahan:
- `is_executive`: BOOLEAN DEFAULT FALSE - Menandai apakah dokter tersedia untuk poli eksekutif
- `kd_dokter`: TEXT UNIQUE - Kode dokter sesuai SIMRS
- `sip_number`: TEXT - Nomor SIP dokter
- `specialization`: TEXT - Spesialisasi dokter
- `education`: TEXT - Riwayat pendidikan dokter

### Tabel schedules (diperluas)
Kolom tambahan:
- `is_executive`: BOOLEAN DEFAULT FALSE - Menandai apakah jadwal untuk poli eksekutif
- `day_of_week`: TEXT - Hari dalam seminggu
- `quota`: INTEGER DEFAULT 5 - Kuota pasien harian

### Tabel patient_profiles (diperluas)
Kolom tambahan:
- `no_rkm_medis`: TEXT UNIQUE - Nomor rekam medis pasien
- `no_ktp`: TEXT - Nomor KTP pasien

### Tabel appointments (diperluas)
Kolom tambahan:
- `is_executive`: BOOLEAN DEFAULT FALSE - Menandai apakah janji untuk poli eksekutif
- `no_reg`: TEXT UNIQUE - Nomor registrasi
- `kd_dokter`: TEXT - Kode dokter
- `jam_reg`: TIME - Jam registrasi
- `tgl_registrasi`: DATE DEFAULT CURRENT_DATE - Tanggal registrasi
- `stts`: TEXT DEFAULT 'Belum' - Status pendaftaran

## Validasi dan Aturan Bisnis
- Pasien hanya bisa mendaftar sekali per hari untuk poli yang sama
- Validasi ketersediaan dokter di jadwal
- Validasi kuota maksimal pasien per dokter per hari
- Pemeriksaan duplikat pendaftaran

## Error Handling
- Penanganan kesalahan koneksi database
- Penanganan kesalahan transaksi
- Logging error untuk debugging
- Respon API konsisten untuk error

## UI Components
- ExecutiveRegistrationPage - formulir pendaftaran pasien
- ExecutiveSuccessPage - halaman konfirmasi pendaftaran
- ExecutiveDoctorDetailPage - detail informasi dokter
- SpecializationList - daftar spesialisasi