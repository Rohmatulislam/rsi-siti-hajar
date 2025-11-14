// src/app/api/doctors/khanza/route.ts
import { NextRequest } from 'next/server';
import { getActiveDoctorsFromKhanza } from '@/lib/khanza/khanza-integration-final';

export async function GET(request: NextRequest) {
  try {
    // Ambil data dokter aktif dari SIMRS Khanza
    const doctorsData = await getActiveDoctorsFromKhanza();
    
    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = doctorsData.map(item => ({
      doctor_code: item.kd_dokter,
      doctor_name: item.nm_dokter,
      poli_code: item.kode_poli,
      poli_name: item.nm_poli,
      workday: item.hari_kerja,
      start_time: item.jam_mulai,
      end_time: item.jam_selesai,
      quota: item.kuota,
      registered_patients: item.jumlah,
      status: item.status,
      notes: item.keterangan,
      patient_id: item.no_rkm_medis
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching doctors data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch doctors data', 
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