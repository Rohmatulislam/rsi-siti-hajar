-- Migration to create patients table for hospital registration

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,
    nik VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('Laki-laki', 'Perempuan')),
    birth_date DATE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    medical_record_number VARCHAR(50) UNIQUE,
    patient_type VARCHAR(20) CHECK (patient_type IN ('baru', 'lama')) DEFAULT 'baru',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    polyclinic VARCHAR(100) NOT NULL,
    doctor VARCHAR(255) NOT NULL,
    appointment_date DATE DEFAULT CURRENT_TIMESTAMP::DATE,
    appointment_time TIME,
    queue_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_nik ON patients(nik);
CREATE INDEX IF NOT EXISTS idx_patients_medical_record ON patients(medical_record_number);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);