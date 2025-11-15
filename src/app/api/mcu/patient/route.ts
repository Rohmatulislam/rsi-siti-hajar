// app/api/mcu/patient/route.ts
import { NextRequest } from 'next/server';
import { MCUDatabase } from '@/models/mcuDatabase';
import { pool } from '@/config/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get('identifier');
    
    if (!identifier) {
      return Response.json(
        { error: 'Parameter identifier diperlukan' },
        { status: 400 }
      );
    }

    const mcuDB = new MCUDatabase(pool);
    const patient = await mcuDB.findPatient(identifier);

    if (!patient) {
      return Response.json(
        { error: 'Pasien tidak ditemukan' },
        { status: 404 }
      );
    }

    return Response.json({ 
      success: true, 
      data: patient 
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat mengambil data pasien' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthDate, gender, identifier, address, phone, email } = body;

    // Validasi input
    if (!name || !birthDate || !gender || !identifier || !address || !phone) {
      return Response.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    const mcuDB = new MCUDatabase(pool);
    
    // Validasi apakah NIK sudah terdaftar
    const existingPatient = await mcuDB.findPatient(identifier);
    if (existingPatient) {
      return Response.json(
        { error: 'NIK sudah terdaftar dalam sistem' },
        { status: 400 }
      );
    }

    // Buat pasien baru
    const newRm = await mcuDB.createNewPatient({
      name,
      birthDate,
      gender,
      identifier, // NIK
      address,
      phone,
      email
    });

    return Response.json({ 
      success: true, 
      data: { 
        message: 'Pasien baru berhasil dibuat',
        newRm 
      } 
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat membuat data pasien' },
      { status: 500 }
    );
  }
}