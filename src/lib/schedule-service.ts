'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { Schedule } from '@/lib/admin-types';

// Fungsi bantu untuk mengonversi berbagai format waktu ke format 24 jam
function convertTo24HourFormat(timeInput: string): string | null {
  // Pastikan input adalah string
  if (typeof timeInput !== 'string') {
    return null;
  }

  // Jika input dalam format HH:MM (24 jam), kembalikan langsung
  if (/^\d{2}:\d{2}$/.test(timeInput)) {
    const [hour, minute] = timeInput.split(':').map(Number);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return timeInput;
    }
    return null;
  }

  // Jika input dalam format HH:MM:SS (24 jam dengan detik), konversi ke HH:MM
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeInput)) {
    const [hour, minute, second] = timeInput.split(':').map(Number);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
      const result = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      return result;
    }
    return null;
  }

  // Jika input dalam format AM/PM
  const timeRegex = /^([0-9]|0[0-9]|1[0-2]):([0-5][0-9])\s*(AM|PM|am|pm)$/i;
  if (timeRegex.test(timeInput)) {
    const parts = timeInput.match(timeRegex);
    if (parts) {
      let [_, hour, minute, period] = parts;
      let hourNum = parseInt(hour, 10);
      const minuteNum = parseInt(minute, 10);

      // Konversi AM/PM ke format 24 jam
      if (period.toLowerCase() === 'pm' && hourNum !== 12) {
        hourNum += 12;
      } else if (period.toLowerCase() === 'am' && hourNum === 12) {
        hourNum = 0;
      }

      const result = `${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`;
      return result;
    }
  }

  // Jika input dalam format ISO Date (misalnya dari input datetime-local)
  if (timeInput.includes('T')) {
    try {
      const date = new Date(timeInput);
      if (isNaN(date.getTime())) {
        return null;
      }
      const result = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      return result;
    } catch (e) {
      return null;
    }
  }

  // Jika tidak cocok dengan format apa pun
  return null;
}

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
        doctors!schedules_doctor_id_fkey(name, specialty)
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
  let validatedStartTime = null;
  let validatedEndTime = null;

  if (scheduleData.start_time) {
    validatedStartTime = convertTo24HourFormat(scheduleData.start_time);
    if (!validatedStartTime) {
      throw new Error('Start time format must be HH:MM (e.g., 09:00, 14:30)');
    }
    scheduleData.start_time = validatedStartTime; // Gunakan format 24 jam yang diseragamkan
  }

  if (scheduleData.end_time) {
    validatedEndTime = convertTo24HourFormat(scheduleData.end_time);
    if (!validatedEndTime) {
      throw new Error('End time format must be HH:MM (e.g., 09:00, 14:30)');
    }
    scheduleData.end_time = validatedEndTime; // Gunakan format 24 jam yang diseragamkan
  }

  // Validasi bahwa waktu mulai sebelum waktu selesai (jika keduanya ada)
  if (validatedStartTime && validatedEndTime) {
    if (validatedStartTime >= validatedEndTime) {
      throw new Error('Start time must be earlier than end time');
    }
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
  if (scheduleData.start_time || scheduleData.end_time) {
    let validatedStartTime = null;
    let validatedEndTime = null;

    // Validasi format waktu
    if (scheduleData.start_time) {
      validatedStartTime = convertTo24HourFormat(scheduleData.start_time);
      if (!validatedStartTime) {
        throw new Error('Start time format must be HH:MM (e.g., 09:00, 14:30)');
      }
      scheduleData.start_time = validatedStartTime; // Gunakan format 24 jam yang diseragamkan
    }

    if (scheduleData.end_time) {
      validatedEndTime = convertTo24HourFormat(scheduleData.end_time);
      if (!validatedEndTime) {
        throw new Error('End time format must be HH:MM (e.g., 09:00, 14:30)');
      }
      scheduleData.end_time = validatedEndTime; // Gunakan format 24 jam yang diseragamkan
    }

    // Validasi bahwa waktu mulai sebelum waktu selesai (jika keduanya ada)
    if (validatedStartTime && validatedEndTime) {
      if (validatedStartTime >= validatedEndTime) {
        throw new Error('Start time must be earlier than end time');
      }
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
        doctors!schedules_doctor_id_fkey(name, specialty)
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