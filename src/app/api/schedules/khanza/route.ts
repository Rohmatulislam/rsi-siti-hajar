// src/app/api/schedules/khanza/route.ts
import { NextRequest } from 'next/server';
import { getDoctorSchedulesFromKhanzaDirect } from '@/lib/khanza/doctor-sync-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorCode = searchParams.get('doctorCode') || undefined;
    const date = searchParams.get('date') || undefined;

    // Ambil jadwal dokter dari SIMRS Khanza
    const schedules = await getDoctorSchedulesFromKhanzaDirect(doctorCode, date);

    return new Response(JSON.stringify(schedules), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching doctor schedules from Khanza:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch doctor schedules',
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