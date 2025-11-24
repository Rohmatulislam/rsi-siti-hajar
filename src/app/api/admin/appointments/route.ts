import { NextRequest } from 'next/server';
import { getAllAppointments, deleteAppointment, updateAppointmentStatus } from '@/lib/appointment-service';

export async function GET(request: NextRequest) {
  try {
    const appointments = await getAllAppointments();
    
    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch appointments', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Ambil ID dari path
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Appointment ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    await deleteAppointment(id);
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete appointment', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}