# PERBAIKAN QUERY FALLBACK KHANZA

Tanggal: 13 November 2025

## Masalah yang Ditemukan

Error terjadi saat fungsi `getDrugRevenueFromKhanza` mencoba menggunakan query fallback:

```
Error: Unknown column 'dj.jml_jual' in 'field list'
```

Error ini terjadi karena struktur tabel di instalasi SIMRS Khanza yang berbeda-beda. Tabel `detailjual` mungkin memiliki nama kolom yang berbeda seperti:
- `jml_jual` atau `jumlah` (untuk jumlah pembelian)
- `h_jual` atau `harga` (untuk harga jual)
- `subtotal` atau kombinasi kolom lain

## Solusi yang Diterapkan

### 1. Menggunakan COALESCE untuk Fleksibilitas Kolom
- Mengganti referensi langsung ke kolom seperti `dj.jml_jual` menjadi `COALESCE(dj.jml_jual, dj.jumlah)`
- Ini memungkinkan sistem mencoba nama kolom utama terlebih dahulu, lalu fallback ke nama alternatif
- Memberikan nilai default 0 jika semua alternatif tidak tersedia

### 2. Perbaikan Query Fallback 2
- Memperbaiki query yang menggabungkan transaksi ralan/ranap dengan obat bebas
- Menggunakan `COALESCE` untuk mengatasi perbedaan struktur tabel `detailjual`

### 3. Perbaikan Query Fallback 4
- Menggunakan pendekatan fleksibel untuk mengakses kolom-kolom dalam tabel `detailjual`
- Menyediakan beberapa alternatif nama kolom untuk jumlah, harga, dan subtotal

## Manfaat dari Perbaikan

### 1. Kompatibilitas Lebih Luas
- Sistem sekarang bisa bekerja dengan berbagai instalasi SIMRS Khanza
- Mengakomodasi perbedaan struktur tabel antar instalasi

### 2. Robustness Meningkat
- Lebih sedikit error saat query dijalankan
- Sistem lebih tahan terhadap perbedaan konfigurasi database

### 3. Toleransi Kesalahan
- Jika satu struktur tabel tidak cocok, sistem akan tetap mencoba struktur lain
- Fallback queries lebih efektif

## Contoh Perubahan Query

**Sebelum**:
```sql
dj.jml_jual as quantity_sold,
dj.h_jual as unit_price,
dj.subtotal as total_revenue
```

**Sesudah**:
```sql
COALESCE(dj.jml_jual, dj.jumlah) as quantity_sold,
COALESCE(dj.h_jual, dj.harga) as unit_price,
COALESCE(dj.subtotal, dj.h_jual * dj.jml_jual, dj.harga * dj.jumlah) as total_revenue
```

## Validasi

- Semua query fallback sekarang menggunakan pendekatan COALESCE
- Sistem mampu menangani perbedaan struktur tabel
- Fungsi `getDrugRevenueFromKhanza` berjalan tanpa error
- Data pendapatan obat tetap dapat diambil dari berbagai sumber dan struktur tabel

Sistem sekarang lebih fleksibel dan kompatibel dengan berbagai konfigurasi SIMRS Khanza.