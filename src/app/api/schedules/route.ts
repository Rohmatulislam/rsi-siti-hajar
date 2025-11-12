import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctor_id');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return new Response(
        JSON.stringify({ error: 'Doctor ID and date are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('date', date);

    if (error) {
      console.error('Error fetching schedules:', error);
      return new Response(
        JSON.stringify({ error: 'Error fetching schedules' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ schedules: data || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get schedules API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}