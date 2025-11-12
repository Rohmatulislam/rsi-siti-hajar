import { NextRequest } from 'next/server';
import { getAvailableSchedules } from '@/lib/appointment-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    
    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const slots = await getAvailableSchedules(date, doctorId || undefined);
    
    return new Response(
      JSON.stringify({ slots }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in available appointments API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}