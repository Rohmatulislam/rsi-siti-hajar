# Integrasi SIMRS Khanza untuk Medical Check Up (MCU)

Dokumentasi ini menjelaskan cara mengintegrasikan sistem Medical Check Up (MCU) dengan SIMRS Khanza menggunakan query langsung ke database (tanpa API eksternal).

## 1. Struktur Database SIMRS Khanza untuk MCU

Berikut adalah tabel-tabel utama yang digunakan dalam sistem MCU:

### Tabel Utama
- `pasien` - Data pasien (no_rkm_medis, nm_pasien, no_ktp, tgl_lahir, jk, alamat, no_tlp, email)
- `reg_periksa` - Data pendaftaran MCU (no_reg, no_rkm_medis, kd_dokter, kd_poli, tgl_registrasi, jam_reg, sttus)
- `booking_registrasi` - Data booking MCU (no_booking, no_rkm_medis, kd_dokter, kd_poli, tanggal_periksa, jam_mulai, jam_selesai, status)
- `dokter` - Data dokter (kd_dokter, nm_dokter, kd_sps)
- `poliklinik` - Data poli MCU (kd_poli, nm_poli)
- `jadwal` - Jadwal MCU (kd_dokter, kd_poli, hari_kerja, jam_mulai, jam_selesai)
- `penjab` - Data penanggung jawab (kd_pj, png_jawab, keterangan)

### Tabel Pemeriksaan
- `permintaan_mcu` - Data permintaan MCU (noorder, no_rkm_medis, tgl_permintaan, status)
- `periksa_lab` - Data hasil lab MCU (no_rawat, tgl_periksa, jam, kd_jenis_pr, nilai)
- `permintaan_radiologi` - Data permintaan radiologi MCU (noorder, no_rkm_medis, tgl_permintaan, status)

## 2. Query Database untuk MCU

### Query untuk mencari pasien
```sql
SELECT no_rkm_medis, nm_pasien, no_ktp, tgl_lahir, jk, alamat, no_tlp, email
FROM pasien
WHERE no_rkm_medis = ? OR no_ktp = ?
```

### Query untuk membuat pendaftaran MCU baru
```sql
INSERT INTO reg_periksa (no_reg, no_rkm_medis, kd_dokter, kd_poli, tgl_registrasi, jam_reg, sttus, kd_pj)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

### Query untuk membuat booking MCU
```sql
INSERT INTO booking_registrasi (no_booking, no_rkm_medis, kd_dokter, kd_poli, tanggal_periksa, jam_mulai, jam_selesai, status, no_reg)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
```

### Query untuk membuat permintaan MCU
```sql
INSERT INTO permintaan_mcu (noorder, no_rkm_medis, tgl_permintaan, jam_permintaan, kd_pj, status)
VALUES (?, ?, ?, ?, ?, ?)
```

### Query untuk mengecek ketersediaan jadwal
```sql
SELECT COUNT(*) as booked_count
FROM booking_registrasi
WHERE kd_dokter = ? AND tanggal_periksa = ? AND jam_mulai = ?
AND status != 'Batal'

SELECT j.jam_mulai, j.jam_selesai, p.nm_poli, d.nm_dokter
FROM jadwal j
JOIN poliklinik p ON j.kd_poli = p.kd_poli
JOIN dokter d ON j.kd_dokter = d.kd_dokter
WHERE j.kd_poli = 'MCU' AND j.hari_kerja = DAYNAME(?)
AND NOT EXISTS (
    SELECT 1 FROM booking_registrasi br
    WHERE br.kd_dokter = j.kd_dokter
    AND br.tanggal_periksa = ?
    AND br.jam_mulai = j.jam_mulai
    AND br.status != 'Batal'
)
```

## 3. Fungsi-fungsi Integrasi SIMRS Khanza

### Fungsi untuk mengecek ketersediaan RM
```javascript
async function checkRmAvailability(rm) {
  const query = 'SELECT COUNT(*) as count FROM pasien WHERE no_rkm_medis = ?';
  const result = await db.query(query, [rm]);
  return result[0].count === 0; // true jika tersedia
}
```

### Fungsi untuk mencari data pasien
```javascript
async function findPatient(identifier) {
  const query = 'SELECT no_rkm_medis, nm_pasien, no_ktp, tgl_lahir, jk, alamat, no_tlp, email FROM pasien WHERE no_rkm_medis = ? OR no_ktp = ?';
  const result = await db.query(query, [identifier, identifier]);
  return result.length > 0 ? result[0] : null;
}
```

### Fungsi untuk membuat pasien baru
```javascript
async function createNewPatient(patientData) {
  const rm = generateNewRm(); // fungsi untuk generate RM baru
  const query = 'INSERT INTO pasien (no_rkm_medis, nm_pasien, no_ktp, tgl_lahir, jk, alamat, no_tlp, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  await db.query(query, [
    rm,
    patientData.name,
    patientData.nik,
    patientData.birthDate,
    patientData.gender,
    patientData.address,
    patientData.phone,
    patientData.email || null
  ]);
  return rm;
}
```

### Fungsi untuk membuat pendaftaran MCU
```javascript
async function registerMCU(patientData, packageId, date, time) {
  // Buat nomor registrasi baru
  const noReg = await generateNewRegistrationNumber();
  const noBooking = await generateNewBookingNumber();
  const noOrder = await generateNewOrderNumber();
  
  // Masukkan ke reg_periksa
  await db.query(
    'INSERT INTO reg_periksa (no_reg, no_rkm_medis, kd_dokter, kd_poli, tgl_registrasi, jam_reg, sttus, kd_pj) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [noReg, patientData.no_rkm_medis, 'D001', 'MCU', date, time, 'Belum', 'A01']
  );
  
  // Masukkan ke booking_registrasi
  await db.query(
    'INSERT INTO booking_registrasi (no_booking, no_rkm_medis, kd_dokter, kd_poli, tanggal_periksa, jam_mulai, status, no_reg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [noBooking, patientData.no_rkm_medis, 'D001', 'MCU', date, time, 'Belum', noReg]
  );
  
  // Masukkan ke permintaan_mcu
  await db.query(
    'INSERT INTO permintaan_mcu (noorder, no_rkm_medis, tgl_permintaan, jam_permintaan, kd_pj, status, paket_mcu) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [noOrder, patientData.no_rkm_medis, new Date().toISOString().split('T')[0], new Date().toTimeString().split(' ')[0], 'A01', 'Belum', packageId]
  );
  
  return { noReg, noBooking, noOrder };
}
```

## 4. Konfigurasi Koneksi Database

### Konfigurasi database SIMRS Khanza
```javascript
// config/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'simrs_khanza',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

module.exports = { pool };
```

## 5. Konfigurasi Waktu dan Jadwal MCU

### Jadwal MCU default
```javascript
const mcuSchedule = {
  'Senin': {
    '07:00': { doctor: 'Dr. Ahmad', available: true, max: 10 },
    '08:00': { doctor: 'Dr. Siti', available: true, max: 8 },
    '09:00': { doctor: 'Dr. Budi', available: true, max: 8 }
  },
  'Selasa': {
    '07:00': { doctor: 'Dr. Rina', available: true, max: 10 },
    '08:00': { doctor: 'Dr. Joko', available: true, max: 8 },
    '09:00': { doctor: 'Dr. Lina', available: true, max: 8 }
  }
  // ... tambahkan hari lainnya
};
```

## 6. Implementasi di Frontend

Semua query database harus diakses melalui endpoint backend untuk alasan keamanan. Frontend hanya akan berkomunikasi dengan backend API untuk mengakses data dari SIMRS Khanza.

### Contoh struktur API endpoint
- `GET /api/mcu/patient?identifier=:identifier` - Mencari data pasien
- `POST /api/mcu/register` - Mendaftarkan MCU baru
- `GET /api/mcu/schedule?date=:date` - Menampilkan jadwal MCU
- `GET /api/mcu/packages` - Menampilkan paket MCU

Dengan pendekatan ini, kita bisa mengakses data dari SIMRS Khanza secara langsung melalui query database tanpa menggunakan API eksternal, yang lebih efisien dan sesuai dengan kebutuhan internal rumah sakit.