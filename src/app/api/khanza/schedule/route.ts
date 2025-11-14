import { NextRequest } from 'next/server';
import { getScheduleByServiceId } from '../../../../lib/khanza/khanza-integration-final';
import type { KhanzaSchedule } from '../../../../lib/khanza/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId') ?? undefined;

    if (!serviceId) {
      return new Response(
        JSON.stringify({ error: 'Service ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ambil data jadwal dari SIMRS Khanza berdasarkan layanan
    const scheduleData = await getScheduleByServiceId(serviceId);

    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = scheduleData.map(item => ({
      id: item.id,
      doctor_id: item.doctor_id,
      clinic_id: item.clinic_id,
      day: item.day,
      start_time: item.start_time,
      end_time: item.end_time,
      max_patients: item.max_patients,
      available_slots: item.available_slots,
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching schedule data:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch schedule data',
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