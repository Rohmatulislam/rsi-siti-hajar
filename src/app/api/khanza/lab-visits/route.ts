// src/app/api/khanza/lab-visits/route.ts
import { NextRequest } from 'next/server';
import { getLabVisitsFromKhanza } from '@/lib/khanza/khanza-integration-final';

export async function GET(request: NextRequest) {
  try {
    // Ambil data kunjungan laboratorium dari SIMRS Khanza
    const labVisitData = await getLabVisitsFromKhanza();
    
    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = labVisitData.map(item => ({
      patient_id: item.no_rkm_medis,
      patient_name: item.nm_pasien,
      order_number: item.no_order,
      request_date: item.tgl_permintaan,
      request_time: item.jam_permintaan,
      sample_date: item.tgl_sampel,
      sample_time: item.jam_sampel,
      result_date: item.tgl_hasil,
      result_time: item.jam_hasil,
      service_code: item.kd_jenis_prw,
      service_name: item.nm_perawatan,
      hospital_fee: item.bagian_rs,
      material_cost: item.bhp,
      service_fee: item.tarif_perawatan,
      kso: item.kso,
      management: item.menejemen,
      total_cost: item.total_byr,
      doctor_code: item.kd_dokter,
      doctor_name: item.nm_dokter,
      status: item.status,
      staff: item.petugas
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching lab visit data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch lab visit data', 
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