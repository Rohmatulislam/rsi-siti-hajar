// src/app/api/executive/doctors/route.ts
import { NextRequest } from 'next/server';
import { getExecutiveDoctors } from '@/lib/executive/executive-service';

export async function GET(request: NextRequest) {
  try {
    const doctors = await getExecutiveDoctors();
    return Response.json(doctors);
  } catch (error) {
    console.error('Error in executive doctors API:', error);
    return Response.json(
      { error: 'Terjadi kesalahan dalam mengambil data dokter' },
      { status: 500 }
    );
  }
}