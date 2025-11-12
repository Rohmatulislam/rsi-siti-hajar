'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { Schedule } from '@/lib/admin-types';

// Fungsi untuk mendapatkan semua jadwal dokter
export async function getAllSchedules() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, ambil semua jadwal dokter
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        doctors(name, specialty)
      `)
      .order('doctor_id');

    if (error) {
      console.error('Error fetching schedules:', error);
      throw new Error(`Error fetching schedules: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllSchedules:', error);
    throw error;
  }
}

// Fungsi untuk menghapus jadwal dokter
export async function deleteSchedule(scheduleId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, hapus jadwal dokter
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) {
      console.error('Error deleting schedule:', error);
      throw new Error(`Error deleting schedule: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSchedule:', error);
    throw error;
  }
}

// Fungsi untuk membuat jadwal dokter baru
export async function createSchedule(scheduleData: {
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available?: boolean;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Validasi input
  if (!scheduleData.doctor_id || !scheduleData.date || !scheduleData.start_time || !scheduleData.end_time) {
    throw new Error('All required fields must be provided: doctor_id, date, start_time, end_time');
  }

  // Validasi format waktu
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(scheduleData.start_time) || !timeRegex.test(scheduleData.end_time)) {
    throw new Error('Time format must be HH:MM (e.g., 09:00, 14:30)');
  }

  // Validasi bahwa waktu mulai sebelum waktu selesai
  if (scheduleData.start_time >= scheduleData.end_time) {
    throw new Error('Start time must be earlier than end time');
  }

  // Jika pengguna adalah admin, buat jadwal dokter baru
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('schedules')
      .insert([{
        doctor_id: scheduleData.doctor_id,
        date: scheduleData.date,
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
        available: scheduleData.available !== undefined ? scheduleData.available : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating schedule:', error);
      throw new Error(`Error creating schedule: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createSchedule:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui jadwal dokter
export async function updateSchedule(scheduleId: string, scheduleData: {
  doctor_id?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  available?: boolean;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Validasi input jika ada data yang disediakan
  if (scheduleData.start_time && scheduleData.end_time) {
    // Validasi format waktu
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(scheduleData.start_time) || !timeRegex.test(scheduleData.end_time)) {
      throw new Error('Time format must be HH:MM (e.g., 09:00, 14:30)');
    }

    // Validasi bahwa waktu mulai sebelum waktu selesai jika keduanya disediakan
    if (scheduleData.start_time >= scheduleData.end_time) {
      throw new Error('Start time must be earlier than end time');
    }
  }

  // Jika pengguna adalah admin, perbarui jadwal dokter
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('schedules')
      .update({
        doctor_id: scheduleData.doctor_id,
        date: scheduleData.date,
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
        available: scheduleData.available,
        updated_at: new Date().toISOString()
      })
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating schedule:', error);
      throw new Error(`Error updating schedule: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateSchedule:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail jadwal dokter
export async function getScheduleById(scheduleId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, ambil detail jadwal dokter
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        doctors(name, specialty)
      `)
      .eq('id', scheduleId)
      .single();

    if (error) {
      console.error('Error fetching schedule:', error);
      throw new Error(`Error fetching schedule: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getScheduleById:', error);
    throw error;
  }
}