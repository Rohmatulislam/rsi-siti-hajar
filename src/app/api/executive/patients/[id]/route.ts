// src/app/api/executive/patients/[id]/route.ts
import { NextRequest } from 'next/server';
import { getExecutivePatient } from '@/lib/executive/executive-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noRkmMedis = params.id;

    // Validasi input
    if (!noRkmMedis) {
      return Response.json(
        { error: 'Nomor rekam medis harus disertakan' },
        { status: 400 }
      );
    }

    const patient = await getExecutivePatient(noRkmMedis);
    return Response.json(patient);
  } catch (error) {
    console.error('Error in executive patient API:', error);
    if (error instanceof Error && error.message === 'Pasien tidak ditemukan') {
      return Response.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }
    return Response.json(
      { error: 'Terjadi kesalahan dalam mengambil data pasien' },
      { status: 500 }
    );
  }
}