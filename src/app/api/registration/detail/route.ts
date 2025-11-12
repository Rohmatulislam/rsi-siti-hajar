// GET route untuk mendapatkan detail pendaftaran
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const appointmentId = searchParams.get('appointmentId');

  if (!patientId && !appointmentId) {
    return new Response(
      JSON.stringify({ message: 'Parameter patientId atau appointmentId diperlukan' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Di sini nanti akan diimplementasikan logika untuk mengambil data dari database
    // Misalnya:
    // const patient = await getPatientById(patientId);
    // const appointment = await getAppointmentById(appointmentId);
    // return NextResponse.json({ patient, appointment });

    // Untuk sementara, kita return data dummy
    return new Response(
      JSON.stringify({
        patient: {
          id: patientId || 'dummy-patient-id',
          name: 'John Doe',
          nik: '1234567890123456',
          medical_record_number: 'MR202301234567',
          gender: 'Laki-laki',
          address: 'Jl. Contoh Alamat No. 123',
          phone: '081234567890',
          patient_type: 'baru'
        },
        appointment: {
          id: appointmentId || 'dummy-appointment-id',
          polyclinic: 'penyakit-dalam',
          doctor: 'dr. Andi Susanto, Sp.PD',
          queue_number: 'PD-001',
          appointment_date: new Date().toISOString().split('T')[0]
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching registration data:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}