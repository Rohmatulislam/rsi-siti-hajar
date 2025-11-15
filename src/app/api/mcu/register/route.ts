// app/api/mcu/register/route.ts
import { NextRequest } from 'next/server';
import { MCUDatabase, MCUPatientData } from '@/models/mcuDatabase';
import { pool } from '@/config/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientData, packageId, date, time } = body;

    // Validasi input
    if (!patientData || !packageId || !date || !time) {
      return Response.json(
        { error: 'Data pendaftaran tidak lengkap' },
        { status: 400 }
      );
    }

    const mcuDB = new MCUDatabase(pool);
    
    // Validasi apakah pasien sudah terdaftar
    const patient = await mcuDB.findPatient(patientData.identifier);
    if (!patient) {
      return Response.json(
        { error: 'Pasien tidak ditemukan dalam sistem' },
        { status: 400 }
      );
    }

    // Cek apakah jadwal MCU tersedia
    const schedule = await mcuDB.checkScheduleAvailability(date, time);
    if (schedule.length === 0 || !schedule[0].available) {
      return Response.json(
        { error: 'Jadwal MCU pada waktu yang dipilih tidak tersedia' },
        { status: 400 }
      );
    }

    // Buat registrasi MCU
    const registration = await mcuDB.createMCURegistration(
      patientData as MCUPatientData,
      packageId,
      date,
      time
    );

    return Response.json({ 
      success: true, 
      data: { 
        message: 'Pendaftaran MCU berhasil',
        registration
      } 
    });
  } catch (error) {
    console.error('Error registering MCU:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat mendaftarkan MCU' },
      { status: 500 }
    );
  }
}