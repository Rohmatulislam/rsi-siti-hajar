# Struktur Database SIMRS Khanza

Dokumen ini menjelaskan struktur database utama yang digunakan dalam integrasi dengan SIMRS Khanza.

## Tabel-tabel Utama

### 1. Tabel `pasien`
Menyimpan data pasien SIMRS Khanza

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| no_rkm_medis | varchar(15) | Nomor rekam medis (dibuat otomatis oleh SIMRS) |
| nm_pasien | varchar(50) | Nama pasien |
| no_ktp | varchar(16) | Nomor KTP (NIK) |
| jk | enum('L','P') | Jenis kelamin (L=Pria, P=Perempuan) |
| tmp_lahir | varchar(20) | Tempat lahir |
| tgl_lahir | date | Tanggal lahir |
| alamat | tinytext | Alamat pasien |
| no_tlp | varchar(13) | Nomor telepon |
| pekerjaan | varchar(30) | Pekerjaan pasien |
| stts_nikah | enum(...) | Status pernikahan |
| kd_pj | varchar(3) | Kode penjamin/jaminan |
| no_peserta | varchar(25) | Nomor peserta BPJS (jika ada) |
| umur | varchar(15) | Umur pasien |
| pnd | enum(...) | Pendidikan terakhir |
| keluarga | enum(...) | Hubungan keluarga |
| namakeluarga | varchar(50) | Nama keluarga |

### 2. Tabel `reg_periksa`
Menyimpan data registrasi rawat jalan

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| no_reg | varchar(8) | Nomor registrasi/antrian |
| no_rawat | varchar(17) | Nomor rawat (dibuat otomatis) |
| no_rkm_medis | varchar(15) | Nomor rekam medis pasien |
| kd_dokter | varchar(20) | Kode dokter |
| kd_poli | varchar(15) | Kode poliklinik |
| tgl_registrasi | date | Tanggal registrasi |
| jam_reg | time | Jam registrasi |
| kd_pj | varchar(3) | Kode penjamin |
| stts | enum('Belum','Sudah','Batal') | Status pemeriksaan |
| stts_daftar | enum('Lama','Baru') | Status daftar (lama atau baru) |
| prioritas | tinyint(4) | Prioritas antrian |
| no_rujukan | varchar(40) | Nomor rujukan (jika ada) |
| kd_penyakit | varchar(10) | Kode penyakit (jika ada) |
| kd_prosedur | varchar(10) | Kode prosedur (jika ada) |
| status_pulang | varchar(3) | Status pulang (jika sudah diperiksa) |

## Mapping Data untuk Integrasi

Dalam file `src/lib/khanza-config.ts` disediakan mapping antara format data aplikasi web kita dengan format SIMRS Khanza:

### Mapping Poliklinik
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

### Mapping Dokter (contoh)
- `dr-andi-s` → `DR001`
- `dr-budi-h` → `DR002`
- `dr-citra-m` → `DR003`

Catatan: Kode dokter harus disesuaikan dengan kode dokter yang digunakan di SIMRS Khanza Anda.

## Proses Integrasi

### 1. Pencarian Pasien
- Cek apakah pasien sudah terdaftar di SIMRS Khanza berdasarkan NIK
- Jika sudah ada, gunakan nomor rekam medis yang lama
- Jika belum ada, tambahkan pasien baru dan dapatkan nomor rekam medis baru

### 2. Registrasi Rawat Jalan
- Gunakan nomor rekam medis untuk mendaftarkan pasien ke rawat jalan
- Generate nomor antrian berdasarkan poliklinik
- Simpan data ke tabel `reg_periksa`

## Konfigurasi Akses

Untuk mengakses database SIMRS Khanza, Anda memerlukan kredensial yang bisa didapatkan dari file `database.xml` di folder instalasi SIMRS Khanza.

Format file `.env.local`:
```
KHANZA_DB_HOST=alamat-ip-server-simrs
KHANZA_DB_PORT=3306
KHANZA_DB_NAME=nama-database
KHANZA_DB_USER=username
KHANZA_DB_PASSWORD=password
```

## Catatan Keamanan

- Jangan menyimpan kredensial database dalam kode sumber
- Pastikan database SIMRS Khanza hanya dapat diakses oleh IP server yang sah
- Gunakan koneksi terenkripsi jika database berada di jaringan yang tidak tepercaya
- Hanya berikan hak akses database yang diperlukan (SELECT, INSERT, UPDATE)