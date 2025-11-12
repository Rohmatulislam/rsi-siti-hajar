import { NextRequest } from 'next/server';
import { getActiveDoctorsFromKhanza } from '@/lib/khanza-integration';

export async function GET(request: NextRequest) {
  try {
    const doctors = await getActiveDoctorsFromKhanza();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        doctors,
        message: 'Daftar dokter aktif dari SIMRS Khanza'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in get active doctors from Khanza API:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        doctors: []
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}