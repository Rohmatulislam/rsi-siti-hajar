# Integrasi dengan SIMRS Khanza Desktop

Dokumen ini menjelaskan cara menghubungkan website RSI Siti Hajar dengan SIMRS Khanza Desktop.

## Pendekatan Integrasi

SIMRS Khanza tidak menyediakan API key umum seperti sistem komersial. Ada dua pendekatan utama untuk integrasi:

### 1. Akses Database Langsung (Paling Umum)
- Mengakses database SIMRS Khanza secara langsung (MySQL/MariaDB)
- Tidak memerlukan API key, melainkan kredensial database
- Lebih fleksibel tapi memerlukan izin akses database

### 2. Modul Bridging
- Menggunakan modul bridging yang sudah tersedia (seperti BPJS V-Claim, SATUSEHAT, dll.)
- Memerlukan API key dari sistem eksternal (BPJS/Kemenkes), bukan dari Khanza itu sendiri
- Lebih terbatas pada fungsi modul bridging yang tersedia

## Konfigurasi Lingkungan

### Untuk Akses Database Langsung:
```env
# Konfigurasi Database SIMRS Khanza
KHANZA_DB_HOST=alamat-ip-server-khanza
KHANZA_DB_PORT=3306
KHANZA_DB_NAME=nama-database-khanza
KHANZA_DB_USER=username-database
KHANZA_DB_PASSWORD=password-database
```

### Untuk Modul Bridging (jika tersedia):
```env
# URL dan kredensial untuk modul bridging (jika tersedia)
KHANZA_BASE_URL=http://alamat-ip-khanza:port
KHANZA_BRIDGING_API_KEY=your-bridging-api-key-here
```

## Mendapatkan Kredensial Database

1. Hubungi administrator SIMRS Khanza Anda
2. Minta kredensial database dari file `database.xml` di folder instalasi Khanza
3. Kredensial biasanya berisi:
   - Host IP
   - Nama database
   - Port (biasanya 3306)
   - Username
   - Password (mungkin dalam format terenkripsi)

## Alamat IP SIMRS Khanza Desktop

- Jika SIMRS Khanza berjalan di mesin yang sama: `localhost` atau `127.0.0.1`
- Jika SIMRS Khanza berjalan di jaringan lokal: `192.168.1.x` (ganti x dengan IP mesin yang benar)
- Pastikan port database (default: 3306) terbuka dan dapat diakses dari server website Anda

## Mapping Data

### Poliklinik
- `penyakit-dalam` → `INT`
- `bedah` → `BEDAH`
- `anak` → `ANAK`
- `kandungan` → `KANDUNGAN`
- `mata` → `MATA`
- `kulit-dan-kelamin` → `KULIT`
- `saraf` → `SARAF`
- `orthopedi` → `ORTO`
- `gigi` → `GIGI`
- `telinga-hidung-tenggorokan` → `THT`

### Dokter
Mapping dokter saat ini merupakan mapping statis. Anda perlu mengupdate file `src/lib/khanza-config.ts` untuk menyesuaikan kode dokter dengan kode yang digunakan di SIMRS Khanza Anda.

## Fallback dan Resilience

Jika SIMRS Khanza tidak dapat diakses:

1. Pendaftaran tetap akan berhasil di sistem lokal
2. Nomor antrian akan di-generate secara lokal
3. Pesan akan menunjukkan status sinkronisasi
4. Data akan tetap disimpan dan bisa disinkronkan nanti ketika SIMRS Khanza kembali online

## Testing Koneksi

Anda bisa mengetes koneksi ke SIMRS Khanza dengan mencoba mendaftar pasien. Jika tidak ada URL bridging, sistem hanya akan menyimpan data lokal.

## Troubleshooting

### Jika tidak bisa terhubung ke SIMRS Khanza:

1. Pastikan firewall tidak memblokir koneksi ke database
2. Periksa apakah server SIMRS Khanza dapat diakses dari server website Anda
3. Periksa apakah kredensial database benar
4. Pastikan port database (3306) terbuka
5. Untuk bridging, pastikan modul bridging di SIMRS Khanza aktif

### Jika terjadi kesalahan format data:

1. Periksa mapping di `src/lib/khanza-config.ts`
2. Pastikan data yang dikirim sesuai dengan skema database SIMRS Khanza
3. Periksa dokumentasi SIMRS Khanza untuk format data yang benar

## Keamanan

- Jangan pernah menyimpan kredensial database di kode sumber
- Gunakan file `.env.local` yang diabaikan oleh git
- Pastikan koneksi jaringan antara aplikasi dan SIMRS Khanza aman
- Gunakan VPN jika koneksi melintasi jaringan publik
- Batasi akses database hanya pada IP yang diperlukan