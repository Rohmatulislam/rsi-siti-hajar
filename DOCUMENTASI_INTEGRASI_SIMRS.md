# Dokumentasi Lengkap Integrasi SIMRS Khanza via Database Langsung

## Pendahuluan

Integrasi ini dirancang untuk menghubungkan sistem dengan SIMRS Khanza melalui akses database langsung, bukan melalui API. Pendekatan ini memberikan akses real-time langsung ke data keuangan dan transaksi SIMRS Khanza.

## Tujuan Fitur

1. **Mengetahui total penjualan obat per periode**
   - Menghitung jumlah dan nilai penjualan obat
   - Dapat difilter berdasarkan rentang tanggal

2. **Membedakan pendapatan rawat jalan, rawat inap, dan penjualan bebas**
   - Memisahkan sumber transaksi obat berdasarkan jenis layanan
   - Menggunakan penanda (ralan/ranap/jual bebas) pada setiap transaksi

3. **Menganalisis margin (HPP vs harga jual)**
   - Menghitung Harga Pokok Penjualan (HPP) berdasarkan harga_beli dari tabel databarang
   - Menghitung margin/laba dari selisih harga jual dan HPP

4. **Menyediakan dasar laporan keuangan farmasi**
   - Menyediakan data transaksi obat yang terstruktur
   - Menyediakan laporan analisis lanjutan

5. **Akses real-time ke data keuangan SIMRS Khanza**
   - Mengakses data terbaru secara langsung dari database
   - Tidak tergantung pada endpoint API

## Arsitektur Integrasi

```
┌─────────────────────────────────────────┐
│            Sistem Utama                 │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐ │
│  │     API Endpoints (/api/khanza/)    │ │
│  │         │                           │ │
│  │         ▼                           │ │
│  │  ┌─────────────────────────────────┐│ │
│  │  │   khanza-integration.ts         ││ │
│  │  │         │                       ││ │
│  │  │         ▼                       ││ │
│  │  │  ┌───────────────────────────┐  ││ │
│  │  │  │     Database Query        │  ││ │
│  │  │  │   (langsung ke SIMRS)     │  ││ │
│  │  │  └───────────────────────────┘  ││ │
│  │  └─────────────────────────────────┘│ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## File-file Utama

### 1. `src/lib/khanza-integration.ts`
- Fungsi utama untuk mengakses data dari database SIMRS Khanza
- Menggunakan koneksi database langsung
- Menerapkan penanganan struktur tabel yang fleksibel
- Menyediakan fallback queries untuk mengatasi perbedaan struktur tabel
- Fungsi-fungsi yang tersedia:
  - `getDrugRevenueFromKhanza(startDate, endDate)` - Data pendapatan obat
  - `getJournalDataFromKhanza(startDate, endDate)` - Data jurnal keuangan
  - `getFinancialDataFromKhanza(startDate, endDate)` - Data transaksi keuangan
  - `getReportsFromKhanza(startDate, endDate)` - Data laporan keuangan

### 2. API Routes
- `src/app/api/khanza/drug-revenue/route.ts` - Endpoint untuk data pendapatan obat
- `src/app/api/khanza/drug-revenue/advanced-reports/route.ts` - Endpoint untuk laporan lanjutan
- `src/app/api/khanza/journals/route.ts` - Endpoint untuk data jurnal keuangan

### 3. Halaman Admin
- `src/app/admin/drug-revenue/page.tsx` - Halaman utama pendapatan obat dengan laporan lanjutan

## Pendekatan Database Langsung

### Tabel-tabel Utama yang Diakses
- `detail_pemberian_obat` - data pemberian obat ke pasien
- `databarang` - informasi barang termasuk harga_beli dan harga_jual
- `penjualan` dan `detailjual` - data penjualan bebas
- `resep_dokter` - resep obat dari dokter
- `jurnal` - data jurnal keuangan
- `transaksi` - data transaksi keuangan umum
- `laporan_keuangan` - data laporan keuangan

### Struktur Query
- Menggunakan JOIN antar tabel untuk mendapatkan data lengkap
- Menerapkan COALESCE dan CASE untuk menangani perbedaan struktur
- Menyediakan query fallback untuk mengatasi variasi instalasi

### Penanganan Variasi Struktur Tabel
Karena SIMRS Khanza bisa memiliki struktur tabel yang berbeda-beda di berbagai instalasi, implementasi ini menyediakan:

1. **Query utama** - mengikuti struktur tabel yang paling umum
2. **Fallback queries** - kumpulan query alternatif jika query utama gagal
3. **Fungsi COALESCE** - untuk menangani kolom dengan nama berbeda
4. **Penanganan error yang robust** - agar sistem tetap berjalan meskipun ada perbedaan struktur

## Fitur Analisis Keuangan

### Perhitungan Margin
- HPP (Harga Pokok Penjualan) dihitung dari harga_beli di tabel databarang
- Harga jual diambil dari biaya_obat di detail_pemberian_obat atau h_jual di detailjual
- Margin dihitung sebagai ((harga_jual - harga_beli) / harga_jual) * 100%

### Klasifikasi Sumber Transaksi
- Rawat Jalan (ralan): Ditandai dari pola no_rawat atau data resep
- Rawat Inap (ranap): Ditandai dari pola no_rawat
- Penjualan Bebas: Ditandai dari tabel penjualan dan detailjual

## Laporan Lanjutan

Sistem menyediakan laporan analisis lanjutan yang mencakup:
- 10 obat terlaris
- Pendapatan per unit layanan
- Tren pendapatan harian dan bulanan
- Analisis margin dan profitabilitas
- Filter rentang tanggal

## Caching
- Implementasi caching untuk meningkatkan performa
- Durasi cache dapat dikonfigurasi melalui environment variable
- Data cache disimpan berdasarkan parameter untuk menghindari data lama

## Konfigurasi Environment
```
KHANZA_DB_HOST=     # Host database SIMRS Khanza
KHANZA_DB_PORT=     # Port database SIMRS Khanza  
KHANZA_DB_NAME=     # Nama database SIMRS Khanza
KHANZA_DB_USER=     # Username database
KHANZA_DB_PASSWORD= # Password database
KHANZA_ENABLE_CACHE=true/false  # Aktif/nonaktif cache
KHANZA_CACHE_DURATION=3600      # Durasi cache dalam detik
```

## Keamanan
- Kredensial database tidak disimpan dalam kode
- Semua akses database dilakukan melalui koneksi yang diamankan
- Input pengguna difilter untuk mencegah SQL injection

## Pengujian dan Validasi
- Unit testing untuk fungsi-fungsi utama
- Validasi terhadap berbagai struktur tabel SIMRS Khanza
- Logging komprehensif untuk troubleshooting

## Troubleshooting
Jika mengalami masalah:
1. Periksa koneksi database ke SIMRS Khanza
2. Pastikan tabel-tabel yang diakses tersedia
3. Lihat log untuk mengetahui query mana yang digunakan
4. Tinjau dan sesuaikan fallback queries jika diperlukan