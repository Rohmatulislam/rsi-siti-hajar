import { NextRequest } from 'next/server';
import { createAppointment } from '@/lib/appointment-service';

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json();
    
    if (!appointmentData.patient_id || !appointmentData.doctor_id || !appointmentData.appointment_date || !appointmentData.appointment_time) {
      return new Response(
        JSON.stringify({ error: 'Patient ID, doctor ID, appointment date, and appointment time are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const appointment = await createAppointment(
      appointmentData.patient_id,
      appointmentData.doctor_id,
      appointmentData.schedule_id,
      appointmentData.appointment_date,
      appointmentData.appointment_time,
      appointmentData.consultation_type || 'offline',
      appointmentData.location || 'Poliklinik Umum',
      appointmentData.fee || 0
    );
    
    return new Response(
      JSON.stringify({ 
        appointment,
        message: "Janji temu berhasil dibuat" 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create appointment API:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}