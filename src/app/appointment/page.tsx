import { redirect } from 'next/navigation';

export default function AppointmentRedirect() {
  redirect('/sign-up');
}