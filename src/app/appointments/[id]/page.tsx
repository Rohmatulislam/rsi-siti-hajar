import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getPatientByUserId } from '@/lib/patient-service';
import { getAppointmentById } from '@/lib/appointment-service';
import AppointmentDetail from '@/components/appointments/appointment-detail';

interface AppointmentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Dapatkan informasi pasien berdasarkan user ID
  const patient = await getPatientByUserId(userId);
  
  if (!patient) {
    redirect('/patient/profile/setup'); // Arahkan ke setup profil jika pasien belum terdaftar
  }

  // Dapatkan detail janji temu berdasarkan ID
  const appointment = await getAppointmentById(params.id);
  
  // Pastikan janji temu milik pasien ini
  if (appointment?.patient_id !== patient.id) {
    redirect('/appointments'); // Arahkan kembali ke daftar janji jika bukan milik pasien
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <AppointmentDetail appointment={appointment} />
      </div>
    </div>
  );
}