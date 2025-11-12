# Konfigurasi Supabase Storage untuk Upload Gambar Dokter

## Langkah-langkah Setup Bucket

1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Pilih proyek Anda
3. Klik menu "Storage" di sebelah kiri
4. Klik "New Bucket"
5. Isi form dengan:
   - Bucket ID: `doctors`
   - Public: Centang (karena upload dilakukan dari client-side)
   - Klik "Create"

## Konfigurasi RLS (Row Level Security)

1. Di halaman Storage, klik pada bucket `doctors` yang baru dibuat
2. Klik tab "Policies"
3. Klik "New Policy"
4. Isi form policy:

### Policy untuk Upload
- Policy Name: `Allow upload to doctors bucket`
- For: `Objects` 
- Allow access: `With PostgREST (authenticated users only)` atau `For all users (public)`
- Operations: `Select`, `Insert`, `Update`, `Delete`
- Using Expression:
```
bucket_id = 'doctors' AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
```

### Policy untuk Akses Publik
- Policy Name: `Allow public read access`
- For: `Objects` 
- Allow access: `For all users (public)`
- Operations: `Select`
- Using Expression:
```
bucket_id = 'doctors'
```

## Konfigurasi Bucket Security Lainnya

Jika Anda ingin membuat konfigurasi lebih spesifik, Anda bisa menyesuaikan policy dengan:
- Batasan ukuran file (misalnya maksimal 5MB)
- Tipe file yang diizinkan
- Batasan jumlah upload per user

## Verifikasi Setup

Setelah membuat bucket dan policy, Anda bisa menguji upload gambar di halaman admin dokter.

## Catatan Penting

1. Karena upload dilakukan dari client-side, bucket harus diatur sebagai public
2. Pastikan service role key Anda memiliki izin penuh ke storage
3. Jika Anda mengganti nama bucket, pastikan juga mengganti di komponen ImageUpload

## Fallback Bucket

Jika bucket 'doctors' tidak ditemukan, sistem akan otomatis mencoba upload ke bucket 'avatars' sebagai fallback. Namun, disarankan untuk membuat bucket 'doctors' sesuai dengan instruksi di atas untuk organisasi file yang lebih baik.