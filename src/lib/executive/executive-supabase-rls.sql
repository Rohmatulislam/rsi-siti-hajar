/*
 * Konfigurasi RLS (Row Level Security) dan policy untuk tabel-tabel executive
 * Dengan pendekatan terintegrasi, kita menyesuaikan RLS untuk kolom-kolom tambahan
 * Harus dijalankan di SQL Editor Supabase
 */

-- Aktifkan RLS untuk tabel-tabel utama dengan kolom executive
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca dokter eksekutif (publik)
CREATE POLICY "Allow read for executive doctors" ON doctors
FOR SELECT TO authenticated, anon
USING (is_executive = true);

-- Policy untuk membaca jadwal eksekutif (publik)
CREATE POLICY "Allow read for executive schedules" ON schedules
FOR SELECT TO authenticated, anon
USING (is_executive = true);

-- Policy untuk membaca pasien eksekutif (terbatas untuk keamanan)
CREATE POLICY "Allow read for executive patients" ON patient_profiles
FOR SELECT TO service_role
USING (is_executive = true);

-- Policy untuk membaca registrasi eksekutif
CREATE POLICY "Allow read for executive appointments" ON appointments
FOR SELECT TO authenticated, anon
USING (is_executive = true);

-- Policy untuk insert/update/delete hanya untuk service_role (untuk sinkronisasi data)
CREATE POLICY "Allow service role all operations on executive doctors" ON doctors
FOR ALL TO service_role
USING (is_executive = true)
WITH CHECK (is_executive = true);

CREATE POLICY "Allow service role all operations on executive schedules" ON schedules
FOR ALL TO service_role
USING (is_executive = true)
WITH CHECK (is_executive = true);

CREATE POLICY "Allow service role all operations on executive patients" ON patient_profiles
FOR ALL TO service_role
USING (is_executive = true)
WITH CHECK (is_executive = true);

CREATE POLICY "Allow service role all operations on executive appointments" ON appointments
FOR ALL TO service_role
USING (is_executive = true)
WITH CHECK (is_executive = true);