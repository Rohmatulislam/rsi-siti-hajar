# Sistem Poli Eksekutif RSI Siti Hajar

## Ringkasan
Sistem ini adalah implementasi lengkap untuk Poli Eksekutif RSI Siti Hajar yang terintegrasi langsung dengan database SIMRS Khanza (MySQL) tanpa API, dengan wrapper Supabase sebagai interface database untuk backup dan analisis data, serta menyediakan UI/UX premium dengan tema emerald hijau. Sistem menggunakan pendekatan terintegrasi dengan menambahkan kolom-kolom spesifik untuk poli eksekutif ke tabel-tabel yang sudah ada.

## Struktur File

### Frontend
- `src/app/services/featured/executive/page.tsx` - Halaman utama Poli Eksekutif
- `src/app/services/featured/executive/specializations/page.tsx` - Daftar spesialisasi
- `src/app/services/featured/executive/specializations/[id]/page.tsx` - Halaman detail spesialisasi
- `src/app/services/featured/executive/doctors/[id]/page.tsx` - Halaman detail dokter
- `src/app/services/featured/executive/register/page.tsx` - Halaman registrasi
- `src/app/services/featured/executive/success/page.tsx` - Halaman konfirmasi pendaftaran

### API Routes
- `src/app/api/executive/register/route.ts` - API untuk pendaftaran pasien
- `src/app/api/executive/doctors/route.ts` - API untuk mendapatkan data dokter
- `src/app/api/executive/patients/[id]/route.ts` - API untuk mendapatkan data pasien

### Layanan Backend
- `src/lib/executive/executive-service.ts` - Fungsi-fungsi utama akses SIMRS
- `src/lib/executive/executive-db.ts` - Fungsi koneksi database
- `src/lib/executive/executive-validation.ts` - Fungsi validasi data
- `src/lib/executive/executive-error-handler.ts` - Penanganan error
- `src/lib/executive/executive-sync-service.ts` - Fungsi sinkronisasi ke Supabase
- `src/lib/executive/executive-sync-manager.ts` - Pengelola sinkronisasi
- `src/lib/executive/executive-cron.ts` - Cron job untuk sinkronisasi
- `src/lib/executive/executive-config.ts` - Konfigurasi sistem
- `src/lib/executive/executive-init.ts` - Inisialisasi sistem
- `src/lib/executive/executive-documentation.md` - Dokumentasi sistem
- `src/lib/executive/executive-supabase-schema.sql` - Skema tabel Supabase
- `src/lib/executive/executive-supabase-rls.sql` - Konfigurasi RLS Supabase

## Struktur Database (Pendekatan Terintegrasi)

Sistem ini menggunakan pendekatan terintegrasi dengan menambahkan kolom-kolom spesifik untuk poli eksekutif ke tabel-tabel yang sudah ada di Supabase:

### Tabel doctors (diperluas)
Kolom tambahan:
- `is_executive`: BOOLEAN DEFAULT FALSE - Menandai apakah dokter tersedia untuk poli eksekutif
- `kd_dokter`: TEXT UNIQUE - Kode dokter sesuai SIMRS
- `sip`: TEXT - Nomor Surat Izin Praktik dokter
- `bpjs`: BOOLEAN DEFAULT FALSE - Menandai apakah dokter melayani pasien BPJS

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

## Fitur Utama

1. **Integrasi Langsung ke SIMRS Khanza** - Akses database SIMRS secara langsung menggunakan mysql2/promise
2. **Wrapper Supabase** - Sebagai interface database untuk backup dan analisis
3. **Sinkronisasi Otomatis** - Data disinkronkan ke Supabase setiap 30 menit melalui cron job
4. **Validasi Lengkap** - Cek duplikat, ketersediaan dokter, dan kuota pasien
5. **UI/UX Premium** - Dengan tema emerald hijau dan antarmuka yang elegan
6. **Pendaftaran Real-time** - Transaksi pendaftaran langsung di SIMRS dengan backup ke Supabase
7. **Pendekatan Terintegrasi** - Menggunakan tabel-tabel yang sudah ada dengan kolom tambahan

## Alur Pendaftaran
1. Pasien memilih spesialisasi dan dokter
2. Sistem mengambil data dokter dari SIMRS Khanza
3. Pasien memasukkan nomor rekam medis
4. Sistem memvalidasi data pasien di SIMRS
5. Sistem memvalidasi ketersediaan dokter dan kuota
6. Sistem membuat nomor antrian dan menyimpan ke SIMRS
7. Data juga disimpan ke Supabase sebagai backup (dengan kolom is_executive = true)
8. Pasien menerima konfirmasi pendaftaran

## Teknologi yang Digunakan
- Next.js 14 dengan App Router
- TypeScript
- MySQL (SIMRS Khanza)
- Supabase
- Tailwind CSS
- Lucide React (ikon)
- Framer Motion (animasi)

## Konfigurasi Lingkungan
File `.env.example` menyediakan konfigurasi awal untuk:
- Database SIMRS Khanza
- Kredensial Supabase
- URL Base Aplikasi

## Security
- RLS (Row Level Security) untuk tabel Supabase
- Validasi input pada setiap titik
- Error handling komprehensif