// src/app/api/mcu/packages/[id]/route.ts
import { NextRequest } from 'next/server';
import { getMCUPackageDetail } from '@/lib/mcu/mcu-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return Response.json(
        {
          success: false,
          message: 'ID paket MCU tidak ditemukan'
        },
        { status: 400 }
      );
    }

    const pkg = await getMCUPackageDetail(id);
    
    return Response.json({
      success: true,
      data: pkg
    });
  } catch (error: any) {
    console.error('Error in MCU package detail API:', error);
    
    return Response.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengambil detail paket MCU'
      },
      { status: 500 }
    );
  }
}