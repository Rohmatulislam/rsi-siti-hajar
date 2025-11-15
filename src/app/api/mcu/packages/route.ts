// app/api/mcu/packages/route.ts
import { NextRequest } from 'next/server';
import { MCUDatabase } from '@/models/mcuDatabase';
import { pool } from '@/config/database';

export async function GET(request: NextRequest) {
  try {
    const mcuDB = new MCUDatabase(pool);
    const packages = await mcuDB.getMCUPackages();

    return Response.json({ 
      success: true, 
      data: packages 
    });
  } catch (error) {
    console.error('Error fetching MCU packages:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat mengambil paket MCU' },
      { status: 500 }
    );
  }
}