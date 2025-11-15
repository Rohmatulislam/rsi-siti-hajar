// src/app/api/executive/register/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { registerExecutivePatient, saveExecutiveRegistrationToSupabase } from '@/lib/executive/executive-service';

// Inisialisasi client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { noRkmMedis, kdDokter } = await request.json();

    // Validasi input
    if (!noRkmMedis || !kdDokter) {
      return Response.json(
        { error: 'Nomor rekam medis dan kode dokter harus disertakan' },
        { status: 400 }
      );
    }

    // Panggil fungsi registrasi dari executive-service
    const registration = await registerExecutivePatient(noRkmMedis, kdDokter);

    // Simpan ke Supabase sebagai backup
    try {
      await saveExecutiveRegistrationToSupabase(registration);
    } catch (backupError) {
      console.error('Error saving to Supabase backup:', backupError);
      // Jangan batalkan registrasi hanya karena error backup
    }

    return Response.json({
      success: true,
      message: 'Pendaftaran berhasil',
      ...registration
    });
  } catch (error) {
    console.error('Error in executive registration:', error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Terjadi kesalahan dalam pendaftaran'
      },
      { status: 500 }
    );
  }
}