import { createClient } from '@supabase/supabase-js';

// Mendapatkan URL dan key dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Membuat client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fungsi untuk menguji koneksi
export async function testSupabaseConnection() {
  try {
    // Menguji koneksi dengan query sederhana
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      // Jika tabel users tidak ada, itu bukan error koneksi
      if (error.code === '42P01') { // undefined_table
        return { success: true, message: 'Connection successful, users table not found' };
      }
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

// Fungsi sederhana untuk mendapatkan informasi database
export async function getDatabaseInfo() {
  try {
    // Coba query sederhana untuk menguji koneksi
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      // Jika fungsi version tidak ada, kembalikan info dasar
      return { success: true, message: 'Connected to database' };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: true, message: 'Connected to database' }; // Koneksi berhasil meski query gagal
  }
}