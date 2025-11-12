import { NextRequest } from 'next/server';
import { getDoctorSchedulesFromKhanza } from '@/lib/khanza-integration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorCode = searchParams.get('doctorCode');
    const date = searchParams.get('date');
    
    if (!date) {
      // Jika tidak ada tanggal ditentukan, gunakan tanggal hari ini
      const today = new Date().toISOString().split('T')[0];
      date = today;
    }
    
    const schedules = await getDoctorSchedulesFromKhanza(doctorCode || undefined, date);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        schedules,
        message: `Jadwal dokter dari SIMRS Khanza untuk tanggal ${date}`
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in get doctor schedules from Khanza API:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        schedules: []
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}