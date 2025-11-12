import { NextRequest } from 'next/server';
import { getAvailableDatesForDoctor } from '@/lib/appointment-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const daysParam = searchParams.get('days');
    
    if (!doctorId) {
      return new Response(
        JSON.stringify({ error: 'Doctor ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const daysToLookAhead = daysParam ? parseInt(daysParam) : 30;
    
    const availableDates = await getAvailableDatesForDoctor(doctorId, daysToLookAhead);
    
    return new Response(
      JSON.stringify({ dates: availableDates }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in available dates API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}