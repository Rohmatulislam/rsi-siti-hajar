import { createSupabaseServerClient } from '@/lib/supabase-server';

// Interface untuk tipe data booking
export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string | null;
  appointment_date: string; // Format: YYYY-MM-DD
  appointment_time: string; // Format: HH:MM
  consultation_type: 'offline' | 'online';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'in-progress' | 'arrived';
  queue_number: string;
  location: string;
  fee: number;
  created_at: string;
  updated_at: string;
  doctor?: any; // Informasi dokter
  patient?: any; // Informasi pasien
}

// Interface untuk tipe data jadwal dokter
export interface Schedule {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0 = Minggu, 1 = Senin, dst
  start_time: string; // Format: HH:MM
  end_time: string; // Format: HH:MM
  max_patients: number;
  current_patients: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Fungsi pembantu untuk mendapatkan client Supabase
async function getSupabaseClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase client tidak dapat dibuat");
  }
  return supabase;
}

// Fungsi untuk membuat janji temu baru
export async function createAppointment(
  patientId: string,
  doctorId: string,
  scheduleId: string | null,
  appointmentDate: string,
  appointmentTime: string,
  consultationType: 'offline' | 'online',
  location: string,
  fee: number
): Promise<Appointment> {
  // Generate nomor antrian
  const queueNumber = await generateQueueNumber(doctorId, appointmentDate, location);
  
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      patient_id: patientId,
      doctor_id: doctorId,
      schedule_id: scheduleId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      consultation_type: consultationType,
      status: 'scheduled',
      queue_number: queueNumber,
      location: location,
      fee: fee
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    throw new Error(`Gagal membuat janji temu: ${error.message}`);
  }

  return data as Appointment;
}

// Fungsi untuk menghasilkan nomor antrian
async function generateQueueNumber(doctorId: string, date: string, location: string): Promise<string> {
  const supabase = await getSupabaseClient();
  
  const { count, error } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)
    .eq('appointment_date', date)
    .eq('location', location)
    .neq('status', 'cancelled');

  if (error) {
    console.error('Error counting appointments:', error);
    throw new Error(`Gagal menghitung jumlah janji temu: ${error.message}`);
  }

  const countNum = count || 0;
  const newCount = countNum + 1;
  const dateString = new Date(date).toISOString().split('T')[0].replace(/-/g, '');
  
  // Format nomor antrian: DOC-{kode_dokter}-{tanggal}-{nomor_antrian}
  return `DOC-${doctorId.substring(0, 5)}-${dateString}-${newCount.toString().padStart(3, '0')}`;
}

// Fungsi untuk mendapatkan janji temu berdasarkan ID pasien
export async function getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors (name, specialty, image_url),
      patients (name, phone, email)
    `)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (error) {
    console.error('Error fetching appointments by patient ID:', error);
    throw new Error(`Gagal mengambil janji temu pasien: ${error.message}`);
  }

  return data as Appointment[];
}

// Fungsi untuk mendapatkan detail janji temu berdasarkan ID
export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors (name, specialty, image_url),
      patients (name, phone, email)
    `)
    .eq('id', appointmentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching appointment by ID:', error);
    throw new Error(`Gagal mengambil detail janji temu: ${error.message}`);
  }

  return data as Appointment;
}

// Fungsi untuk memperbarui status janji temu
export async function updateAppointmentStatus(appointmentId: string, status: Appointment["status"]): Promise<Appointment> {
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

  return data as Appointment;
}

// Fungsi untuk membatalkan janji temu
export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
  return await updateAppointmentStatus(appointmentId, 'cancelled');
}

// Fungsi untuk mendapatkan semua janji temu (untuk admin)
export async function getAllAppointments(): Promise<Appointment[]> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      users (full_name, email),
      doctors (name, specialty)
    `)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (error) {
    console.error('Error fetching all appointments:', error);
    throw new Error(`Gagal mengambil semua janji temu: ${error.message}`);
  }

  return data as Appointment[];
}

// Fungsi untuk menghapus janji temu
export async function deleteAppointment(appointmentId: string): Promise<boolean> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId);

  if (error) {
    console.error('Error deleting appointment:', error);
    throw new Error(`Gagal menghapus janji temu: ${error.message}`);
  }

  return true;
}