import { createSupabaseServerClient } from '@/lib/supabase-server';

// Interfaces untuk tipedata
export interface Patient {
  id: string; // UUID dari patient_profiles
  user_id: string; // UUID dari users table
  nik: string | null;
  name: string | null;
  gender: string | null;
  birth_date: string | null; // ISO string
  address: string | null;
  phone: string | null;
  email?: string;
  occupation?: string | null;
  marital_status?: string | null;
  blood_type?: string | null;
  allergies?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  medical_record_number: string | null;
  patient_type: 'baru' | 'lama';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string; // UUID
  patient_id: string; // text
  doctor_id: string | null; // UUID
  schedule_id: string | null; // UUID
  appointment_date: string; // Tanggal
  appointment_time: string; // Waktu
  status: string; // pending, confirmed, cancelled, completed
  notes: string | null;
  consultation_type: 'online' | 'offline' | null;
  queue_number: string;
  location: string;
  fee: number;
  created_at: string;
  updated_at: string;
}

// Interface untuk form data
export interface PatientFormData {
  user_id: string;
  nik?: string;
  name?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  marital_status?: string;
  blood_type?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medicalRecordNumber?: string;
  patientType: 'baru' | 'lama';
}

export interface AppointmentFormData {
  polyclinic: string;
  doctor: string;
}

// Fungsi pembantu untuk mendapatkan client Supabase
async function getSupabaseClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase client tidak dapat dibuat");
  }
  return supabase;
}

// Fungsi untuk membuat profil pasien baru
export async function createPatient(data: PatientFormData): Promise<Patient> {
  const supabase = await getSupabaseClient();
  
  try {
    // Ambil user ID (UUID) dari tabel users berdasarkan Clerk user_id (text)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', data.user_id)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') { // Record not found
        throw new Error('User tidak ditemukan');
      }
      console.error('Error getting user by Clerk ID:', userError);
      throw new Error(`Gagal mengambil data pengguna: ${userError.message}`);
    }

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Periksa apakah profil pasien sudah ada
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('patient_profiles')
      .select('id')
      .eq('user_id', user.id) // user.id adalah UUID
      .single();

    if (existingProfile) {
      // Jika sudah ada, lakukan update
      const { data: updatedProfile, error: updateError } = await supabase
        .from('patient_profiles')
        .update({
          full_name: data.name || null,
          birth_date: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : null,
          gender: data.gender || null,
          phone: data.phone || null,
          address: data.address || null,
          blood_type: data.blood_type || null,
          nik: data.nik || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id) // user.id adalah UUID
        .select()
        .single();

      if (updateError) {
        console.error('Error updating patient profile:', updateError);
        throw new Error(`Gagal memperbarui profil pasien: ${updateError.message}`);
      }
      
      return {
        id: updatedProfile.id,
        user_id: updatedProfile.user_id,
        nik: updatedProfile.nik,
        name: updatedProfile.full_name,
        gender: updatedProfile.gender,
        birth_date: updatedProfile.birth_date ? new Date(updatedProfile.birth_date).toISOString() : null,
        address: updatedProfile.address,
        phone: updatedProfile.phone,
        email: undefined,
        occupation: data.occupation || null,
        marital_status: data.marital_status || null,
        blood_type: updatedProfile.blood_type,
        allergies: data.allergies || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        medical_record_number: data.medicalRecordNumber || null,
        patient_type: data.patientType,
        is_active: true,
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at
      };
    }

    // Jika belum ada, buat profil baru
    const { data: newProfile, error: insertError } = await supabase
      .from('patient_profiles')
      .insert([{
        user_id: user.id, // user.id adalah UUID
        full_name: data.name || null,
        birth_date: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : null,
        gender: data.gender || null,
        phone: data.phone || null,
        address: data.address || null,
        blood_type: data.blood_type || null,
        nik: data.nik || null
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating patient profile:', insertError);
      throw new Error(`Gagal membuat profil pasien: ${insertError.message}`);
    }

    return {
      id: newProfile.id,
      user_id: newProfile.user_id,
      nik: newProfile.nik,
      name: newProfile.full_name,
      gender: newProfile.gender,
      birth_date: newProfile.birth_date ? new Date(newProfile.birth_date).toISOString() : null,
      address: newProfile.address,
      phone: newProfile.phone,
      email: undefined,
      occupation: data.occupation || null,
      marital_status: data.marital_status || null,
      blood_type: newProfile.blood_type,
      allergies: data.allergies || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_phone: data.emergency_contact_phone || null,
      medical_record_number: data.medicalRecordNumber || null,
      patient_type: data.patientType,
      is_active: true,
      created_at: newProfile.created_at,
      updated_at: newProfile.updated_at
    };
  } catch (error) {
    console.error('Error in createPatient:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui nomor rekam medis pasien setelah sinkronisasi dengan SIMRS Khanza
export async function updatePatientMedicalRecordNumber(nik: string, medicalRecordNumber: string): Promise<Patient | null> {
  const supabase = await getSupabaseClient();
  
  // Update di tabel patient_profiles berdasarkan NIK
  const { data, error } = await supabase
    .from('patient_profiles')
    .update({ 
      nik: medicalRecordNumber,
      updated_at: new Date().toISOString() 
    })
    .eq('nik', nik)
    .select()
    .single();

  if (error) {
    console.error('Error updating patient medical record number:', error);
    return null;
  }

  if (data) {
    return {
      id: data.id,
      user_id: data.user_id,
      nik: data.nik,
      name: data.full_name,
      gender: data.gender,
      birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
      address: data.address,
      phone: data.phone,
      email: undefined,
      occupation: null,
      marital_status: null,
      blood_type: data.blood_type,
      allergies: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      medical_record_number: data.nik,
      patient_type: 'lama',
      is_active: true,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  return null;
}

// Fungsi untuk mendapatkan nomor rekam medis dari SIMRS Khanza
// Ini akan digunakan saat sinkronisasi data
export async function getPatientByMedicalRecordNumberFromKhanza(mrn: string): Promise<any> {
  // Ini adalah fungsi placeholder - implementasi nyata akan tergantung pada modul bridging yang digunakan
  // atau akses langsung ke database SIMRS Khanza
  console.warn('Fungsi getPatientByMedicalRecordNumberFromKhanza belum diimplementasikan sepenuhnya');
  return null;
}

// Fungsi untuk mencari pasien berdasarkan NIK
export async function getPatientByNIK(nik: string): Promise<Patient | null> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('nik', nik)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching patient by NIK:', error);
    throw new Error(`Gagal mengambil data pasien: ${error.message}`);
  }

  if (data) {
    return {
      id: data.id,
      user_id: data.user_id,
      nik: data.nik,
      name: data.full_name,
      gender: data.gender,
      birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
      address: data.address,
      phone: data.phone,
      email: undefined,
      occupation: null,
      marital_status: null,
      blood_type: data.blood_type,
      allergies: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      medical_record_number: data.nik,
      patient_type: 'lama',
      is_active: true,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  return null;
}

// Fungsi untuk mencari pasien berdasarkan nomor rekam medis
export async function getPatientByMedicalRecordNumber(mrn: string): Promise<Patient | null> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('nik', mrn) // Gunakan kolom nik untuk menyimpan nomor rekam medis sementara
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching patient by medical record number:', error);
    throw new Error(`Gagal mengambil data pasien: ${error.message}`);
  }

  if (data) {
    return {
      id: data.id,
      user_id: data.user_id,
      nik: data.nik,
      name: data.full_name,
      gender: data.gender,
      birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
      address: data.address,
      phone: data.phone,
      email: undefined,
      occupation: null,
      marital_status: null,
      blood_type: data.blood_type,
      allergies: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      medical_record_number: data.nik,
      patient_type: 'lama',
      is_active: true,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  return null;
}

// Fungsi untuk membuat janji temu
export async function createAppointment(patientId: string, data: AppointmentFormData, queueNumber: string): Promise<Appointment> {
  const supabase = await getSupabaseClient();
  
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([{
      patient_id: patientId,
      notes: queueNumber,
      consultation_type: 'offline',
      status: 'pending',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '00:00:00'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    throw new Error(`Gagal membuat janji temu: ${error.message}`);
  }

  return {
    id: appointment.id,
    patient_id: appointment.patient_id,
    doctor_id: appointment.doctor_id,
    schedule_id: appointment.schedule_id,
    appointment_date: appointment.appointment_date,
    appointment_time: appointment.appointment_time,
    status: appointment.status as any,
    notes: appointment.notes,
    consultation_type: appointment.consultation_type as any,
    queue_number: appointment.notes || queueNumber,
    location: appointment.location || '',
    fee: appointment.fee || 0,
    created_at: appointment.created_at,
    updated_at: appointment.updated_at
  };
}

// Fungsi untuk mendapatkan janji temu berdasarkan ID pasien
export async function getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false });

  if (error) {
    console.error('Error fetching appointments by patient ID:', error);
    throw new Error(`Gagal mengambil data janji temu: ${error.message}`);
  }

  return data.map(app => ({
    id: app.id,
    patient_id: app.patient_id,
    doctor_id: app.doctor_id,
    schedule_id: app.schedule_id,
    appointment_date: app.appointment_date,
    appointment_time: app.appointment_time,
    status: app.status as any,
    notes: app.notes,
    consultation_type: app.consultation_type as any,
    queue_number: app.notes || '',
    location: app.location || '',
    fee: app.fee || 0,
    created_at: app.created_at,
    updated_at: app.updated_at
  }));
}

// Fungsi untuk mendapatkan janji temu berdasarkan ID
export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching appointment by ID:', error);
    throw new Error(`Gagal mengambil data janji temu: ${error.message}`);
  }

  if (data) {
    return {
      id: data.id,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      schedule_id: data.schedule_id,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      status: data.status as any,
      notes: data.notes,
      consultation_type: data.consultation_type as any,
      queue_number: data.notes || '',
      location: data.location || '',
      fee: data.fee || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  return null;
}

// Fungsi untuk memperbarui status janji temu
export async function updateAppointmentStatus(appointmentId: string, status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'): Promise<Appointment> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      status: status, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating appointment status:', error);
    throw new Error(`Gagal memperbarui status janji temu: ${error.message}`);
  }

  return {
    id: data.id,
    patient_id: data.patient_id,
    doctor_id: data.doctor_id,
    schedule_id: data.schedule_id,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
    status: data.status as any,
    notes: data.notes,
    consultation_type: data.consultation_type as any,
    queue_number: data.notes || '',
    location: data.location || '',
    fee: data.fee || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// Fungsi untuk mencari pasien berdasarkan nomor telepon
export async function getPatientByPhone(phone: string): Promise<Patient | null> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('phone', phone)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching patient by phone:', error);
    throw new Error(`Gagal mengambil data pasien: ${error.message}`);
  }

  if (data) {
    return {
      id: data.id,
      user_id: data.user_id,
      nik: data.nik,
      name: data.full_name,
      gender: data.gender,
      birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
      address: data.address,
      phone: data.phone,
      email: undefined,
      occupation: null,
      marital_status: null,
      blood_type: data.blood_type,
      allergies: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      medical_record_number: data.nik,
      patient_type: 'lama',
      is_active: true,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  return null;
}

// Fungsi utilitas untuk generate nomor rekam medis
function generateMedicalRecordNumber(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `MR${timestamp}${randomNum}`;
}

// Fungsi untuk mencari pasien berdasarkan berbagai kriteria
export async function searchPatients(searchTerm: string): Promise<Patient[]> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('patient_profiles')
    .select('*')
    .or(`nik.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error searching patients:', error);
    throw new Error(`Gagal mencari data pasien: ${error.message}`);
  }

  return data.map(row => ({
    id: row.id,
    user_id: row.user_id,
    nik: row.nik,
    name: row.full_name,
    gender: row.gender,
    birth_date: row.birth_date ? new Date(row.birth_date).toISOString() : null,
    address: row.address,
    phone: row.phone,
    email: undefined,
    occupation: null,
    marital_status: null,
    blood_type: row.blood_type,
    allergies: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    medical_record_number: row.nik,
    patient_type: 'lama',
    is_active: true,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
}

// Fungsi untuk mendapatkan pasien berdasarkan user ID dari Clerk
export async function getPatientByUserId(userId: string): Promise<Patient | null> {
  const supabase = await getSupabaseClient();
  
  try {
    // Ambil semua users dan cari secara manual berdasarkan Clerk user_id
    // untuk menghindari error "No suitable key or wrong key type"
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, user_id');

    if (usersError) {
      console.error('Error getting all users:', usersError);
      throw new Error(`Gagal mengambil data pengguna: ${usersError.message}`);
    }
    
    // Cari user dengan Clerk user_id yang cocok
    const matchedUser = allUsers.find(user => user.user_id === userId);

    if (!matchedUser) {
      return null; // User tidak ditemukan
    }

    // Gunakan user ID (UUID) untuk mendapatkan profil pasien
    const { data: patient, error: patientError } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('user_id', matchedUser.id) // matchedUser.id adalah UUID
      .single();

    if (patientError) {
      if (patientError.code === 'PGRST116') { // Record not found
        return null;
      }
      console.error('Error getting patient by user ID:', patientError);
      throw new Error(`Gagal mengambil data pasien: ${patientError.message}`);
    }

    if (patient) {
      return {
        id: patient.id,
        user_id: patient.user_id,
        nik: patient.nik,
        name: patient.full_name,
        gender: patient.gender,
        birth_date: patient.birth_date ? new Date(patient.birth_date).toISOString() : null,
        address: patient.address,
        phone: patient.phone,
        email: undefined,
        occupation: null,
        marital_status: null,
        blood_type: patient.blood_type,
        allergies: null,
        emergency_contact_name: null,
        emergency_contact_phone: null,
        medical_record_number: patient.nik,
        patient_type: 'lama',
        is_active: true,
        created_at: patient.created_at,
        updated_at: patient.updated_at
      };
    }

    return null;
  } catch (error) {
    console.error('Error in getPatientByUserId:', error);
    return null;
  }
}