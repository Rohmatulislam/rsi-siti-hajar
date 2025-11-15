// app/api/mcu/schedule/route.ts
import { NextRequest } from 'next/server';
import { MCUDatabase } from '@/models/mcuDatabase';
import { pool } from '@/config/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    if (!date) {
      return Response.json(
        { error: 'Parameter tanggal diperlukan' },
        { status: 400 }
      );
    }

    const mcuDB = new MCUDatabase(pool);
    const schedules = await mcuDB.checkScheduleAvailability(date);

    return Response.json({ 
      success: true, 
      data: schedules 
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat mengambil jadwal MCU' },
      { status: 500 }
    );
  }
}