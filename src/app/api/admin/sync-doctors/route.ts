// src/app/api/admin/sync-doctors/route.ts
import { NextRequest } from 'next/server';
import { syncDoctorsFromKhanza } from '@/lib/khanza/doctor-sync-service';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// Fungsi untuk verifikasi admin
async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const supabase = await createSupabaseServerClient(true); // service role
  if (!supabase) throw new Error("Supabase client (service role) tidak dapat dibuat");

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('❌ Gagal cek role admin:', error);
    throw new Error('Gagal memeriksa role pengguna');
  }

  if (!data || data.role !== 'admin') {
    throw new Error('Access denied: hanya admin yang diizinkan');
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verifikasi admin
    await verifyAdmin();

    // Lakukan sinkronisasi dokter dari SIMRS Khanza
    const result = await syncDoctorsFromKhanza();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error syncing doctors from Khanza:', error);

    if (error instanceof Error && error.message.includes('Access denied')) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: error.message
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to sync doctors data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}