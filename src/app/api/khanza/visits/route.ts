// src/app/api/khanza/visits/route.ts
import { NextRequest } from 'next/server';
import { getVisitDataFromKhanza } from '@/lib/khanza/khanza-integration-final';

export async function GET(request: NextRequest) {
  try {
    // Ambil data kunjungan dari SIMRS Khanza
    const visitData = await getVisitDataFromKhanza();
    
    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = visitData.map(item => ({
      patient_id: item.no_rkm_medis,
      patient_name: item.nm_pasien,
      doctor_code: item.kd_dokter,
      doctor_name: item.nm_dokter,
      poli_code: item.kd_poli,
      poli_name: item.nm_poli,
      registration_date: item.tgl_registrasi,
      registration_time: item.jam_reg,
      registration_number: item.no_reg,
      payment_type_code: item.kd_pj,
      payment_type_name: item.nm_pj,
      visit_type: item.status_lanjut,
      payment_status: item.status_bayar,
      visit_status: item.stts,
      registration_status: item.stts_daftar,
      phone_number: item.no_tlp
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching visit data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch visit data', 
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