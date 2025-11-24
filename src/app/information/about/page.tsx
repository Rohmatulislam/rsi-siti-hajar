import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function AboutInfoPage() {
  // Redirect langsung ke halaman about
  redirect('/about');
}