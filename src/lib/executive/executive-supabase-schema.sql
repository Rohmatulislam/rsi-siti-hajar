/*
 * Skema tabel untuk menyimpan data Poli Eksekutif yang disinkronkan dari SIMRS Khanza ke Supabase
 * Kita akan menggunakan tabel yang sudah ada dan menambahkan kolom untuk poli eksekutif
 */

/*
 * Menambahkan kolom ke tabel doctors untuk menandai apakah dokter tersedia untuk poli eksekutif
 */
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_executive BOOLEAN DEFAULT FALSE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS kd_dokter TEXT UNIQUE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS sip_number TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS education TEXT;

/*
 * Menambahkan kolom ke tabel schedules untuk menandai apakah jadwal untuk poli eksekutif
 */
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS is_executive BOOLEAN DEFAULT FALSE;
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS day_of_week TEXT;
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS quota INTEGER DEFAULT 5;

/*
 * Menambahkan kolom ke tabel patient_profiles untuk informasi tambahan
 */
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS no_rkm_medis TEXT UNIQUE;
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS no_ktp TEXT;

/*
 * Menambahkan kolom ke tabel appointments untuk menandai apakah ini untuk poli eksekutif
 */
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_executive BOOLEAN DEFAULT FALSE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS no_reg TEXT UNIQUE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS kd_dokter TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS jam_reg TIME;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS tgl_registrasi DATE DEFAULT CURRENT_DATE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS stts TEXT DEFAULT 'Belum'; -- Status: Belum, Dilayani, Selesai, Batal

/*
 * Index untuk performa
 */
CREATE INDEX IF NOT EXISTS idx_doctors_is_executive ON doctors(is_executive);
CREATE INDEX IF NOT EXISTS idx_schedules_is_executive ON schedules(is_executive);
CREATE INDEX IF NOT EXISTS idx_appointments_is_executive ON appointments(is_executive);
CREATE INDEX IF NOT EXISTS idx_appointments_no_rkm_medis ON appointments(no_rkm_medis);
CREATE INDEX IF NOT EXISTS idx_appointments_kd_dokter ON appointments(kd_dokter);
CREATE INDEX IF NOT EXISTS idx_appointments_tgl_registrasi ON appointments(tgl_registrasi);
CREATE INDEX IF NOT EXISTS idx_appointments_stts ON appointments(stts);