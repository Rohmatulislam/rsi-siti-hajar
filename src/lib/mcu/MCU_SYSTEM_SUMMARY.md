# Sistem Medical Check Up (MCU) RSI Siti Hajar

## Ringkasan
Sistem Medical Check Up RSI Siti Hajar adalah solusi terpadu untuk mengelola pendaftaran MCU secara online yang terintegrasi langsung dengan database SIMRS Khanza (tanpa API eksternal). Sistem ini menyediakan pengalaman pendaftaran MCU yang cepat, nyaman, dan terintegrasi, dengan UI/UX premium menggunakan tema emerald hijau.

## Struktur File

### Frontend
- `src/app/services/mcu/page.tsx` - Halaman utama Layanan MCU
- `src/app/services/mcu/packages/page.tsx` - Daftar semua paket MCU
- `src/app/services/mcu/packages/[id]/page.tsx` - Halaman detail paket MCU
- `src/app/services/mcu/register/page.tsx` - Halaman pendaftaran MCU
- `src/app/services/mcu/success/page.tsx` - Halaman konfirmasi pendaftaran MCU

### Layanan Backend
- `src/lib/mcu/mcu-service.ts` - Fungsi-fungsi utama akses SIMRS untuk MCU
- `src/lib/mcu/mcu-db.ts` - Fungsi koneksi database SIMRS
- `src/lib/mcu/mcu-types.ts` - Definisi interface/types untuk MCU
- `src/lib/mcu/mcu-config.ts` - Konfigurasi sistem MCU

## Fitur Utama

### 1. Manajemen Paket MCU
- Tersedia 4 level paket MCU: Basic, Silver, Gold, Executive
- Setiap paket memiliki rincian pemeriksaan yang berbeda
- Harga dan durasi pemeriksaan yang jelas

### 2. Dua Mode Pendaftaran
- **Pasien Lama**: Melalui pencarian nomor rekam medis atau NIK
- **Pasien Baru**: Formulir pendaftaran lengkap untuk pasien baru

### 3. Integrasi SIMRS Khanza
- Akses database SIMRS secara langsung menggunakan mysql2/promise
- Query untuk data pasien dari tabel `pasien`
- Insert ke tabel `reg_periksa` untuk pendaftaran MCU
- Backup data ke Supabase untuk analisis dan pelaporan

### 4. Alur Pendaftaran End-to-End
1. Pasien memilih paket MCU
2. Memilih mode pendaftaran (lama/baru)
3. Mengisi data pribadi dan pemeriksaan
4. Memilih tanggal MCU
5. Memilih metode pembayaran
6. Sistem membuat nomor booking dan menyimpan ke SIMRS
7. Pasien menerima tiket digital dengan QR Code

### 5. Data yang Diakses dari SIMRS
- Tabel `pasien` - untuk data pasien (nama, alamat, dll)
- Tabel `reg_periksa` - untuk pendaftaran MCU
- Tabel `dokter` - untuk informasi dokter MCU
- Tabel `poliklinik` - untuk informasi poli MCU
- Tabel `jadwal` - untuk jadwal MCU
- Tabel `permintaan_mcu` - untuk data permintaan MCU (jika tersedia)

## Teknologi yang Digunakan
- Next.js 14 dengan App Router
- TypeScript
- MySQL (SIMRS Khanza)
- Supabase
- Tailwind CSS
- Lucide React (ikon)
- Framer Motion (animasi)

## Keamanan
- Koneksi database menggunakan variabel lingkungan
- Validasi input pada setiap titetap
- Error handling komprehensif
- Akses database dilakukan secara langsung ke SIMRS tanpa API eksternal

## Alur Pendaftaran Lengkap
1. Pasien membuka halaman MCU
2. Memilih paket MCU
3. Memilih Pasien Baru atau Pasien Lama
4. Jika pasien lama → cek database SIMRS → tampilkan data
5. Jika pasien baru → isi form lengkap → buat RM baru di SIMRS
6. Pasien memilih jadwal MCU
7. Sistem cek ketersediaan (opsional)
8. Sistem menyimpan ke tabel SIMRS: pasien (jika baru), reg_periksa
9. Sistem membuat backup ke Supabase
10. Pasien menerima konfirmasi dengan nomor booking, QR Code dan jadwal MCU

## Konfigurasi Lingkungan
File `.env` harus menyertakan:
- Kredensial database SIMRS Khanza
- Kredensial Supabase
- URL Base Aplikasi

## Tabel Supabase (Backup & Analisis)
- `mcu_registrations` - Tabel backup untuk registrasi MCU
- Kolom: no_rkm_medis, package_id, tanggal_mc, jam_reg, no_reg, status, payment_method, created_at

## Tabel SIMRS Khanza Terkait
- `pasien` - Data dasar pasien
- `reg_periksa` - Pendaftaran pemeriksaan (digunakan untuk MCU dengan kd_poli='MCU')
- `dokter` - Data dokter MCU
- `poliklinik` - Informasi poli MCU
- `jadwal` - Jadwal MCU
- `pegawai` - Data tenaga medis