// src/app/api/mcu/patients/search/route.ts
import { NextRequest } from 'next/server';
import { getMCUPatient } from '@/lib/mcu/mcu-service';

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();
    
    if (!identifier) {
      return Response.json(
        {
          success: false,
          message: 'Nomor Rekam Medis atau NIK harus disertakan'
        },
        { status: 400 }
      );
    }

    const patient = await getMCUPatient(identifier);
    
    return Response.json({
      success: true,
      data: patient
    });
  } catch (error: any) {
    console.error('Error in MCU patient search API:', error);
    
    return Response.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan saat mencari data pasien MCU'
      },
      { status: 500 }
    );
  }
}