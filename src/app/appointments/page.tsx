import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getPatientByUserId } from '@/lib/patient-service';
import { getAppointmentsByPatientId } from '@/lib/appointment-service';
import AppointmentList from '@/components/appointments/appointment-list';

export default async function AppointmentHistoryPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Dapatkan informasi pasien berdasarkan user ID
  const patient = await getPatientByUserId(userId);
  
  if (!patient) {
    redirect('/patient/profile/setup'); // Arahkan ke setup profil jika pasien belum terdaftar
  }

  // Dapatkan daftar janji temu pasien
  const appointments = await getAppointmentsByPatientId(patient.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <AppointmentList appointments={appointments} />
      </div>
    </div>
  );
}