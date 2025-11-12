-- Membuat tabel relasi antara layanan dan dokter
CREATE TABLE IF NOT EXISTS service_doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, doctor_id) -- Mencegah duplikasi relasi
);

-- Membuat indeks untuk performansi
CREATE INDEX IF NOT EXISTS idx_service_doctors_service_id ON service_doctors(service_id);
CREATE INDEX IF NOT EXISTS idx_service_doctors_doctor_id ON service_doctors(doctor_id);

-- Membuat trigger untuk memperbarui kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_doctors_updated_at 
    BEFORE UPDATE ON service_doctors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Menambahkan komentar untuk dokumentasi
COMMENT ON TABLE service_doctors IS 'Tabel relasi antara layanan dan dokter terkait';
COMMENT ON COLUMN service_doctors.service_id IS 'ID dari layanan';
COMMENT ON COLUMN service_doctors.doctor_id IS 'ID dari dokter';