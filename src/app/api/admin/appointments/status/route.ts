import { NextRequest } from 'next/server';
import { updateAppointmentStatus } from '@/lib/appointment-service';

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: 'Appointment ID and status are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const updatedAppointment = await updateAppointmentStatus(id, status);
    
    return new Response(JSON.stringify(updatedAppointment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update appointment status', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}