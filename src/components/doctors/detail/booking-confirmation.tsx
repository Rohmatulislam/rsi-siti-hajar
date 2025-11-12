'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle, 
  Home
} from 'lucide-react';
import { Appointment } from '@/lib/admin-types';
import { useRouter } from 'next/navigation';

interface BookingConfirmationProps {
  appointment: Appointment;
  patientInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export function BookingConfirmation({ appointment, patientInfo }: BookingConfirmationProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30); // Countdown timer

  // Timer for auto redirect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto redirect after 30 seconds
      setTimeout(() => {
        router.push(`/appointments/${appointment.id}`);
      }, 1000);
    }
  }, [timeLeft, appointment.id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Booking Berhasil!</h1>
          <p className="text-slate-600 dark:text-gray-400">
            Janji temu Anda telah berhasil dibuat
          </p>
        </div>

        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Detail Janji Temu</CardTitle>
                <p className="opacity-90">
                  {formatDate(appointment.appointment_date)} pukul {appointment.appointment_time}
                </p>
              </div>
              <Badge 
                variant="secondary"
                className="text-white bg-white/20 px-4 py-1"
              >
                Berhasil
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Informasi Janji Temu */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white border-b pb-2">Informasi Janji Temu</h3>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Tanggal</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Waktu</p>
                    <p className="font-medium text-slate-900 dark:text-white">{appointment.appointment_time}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Dokter</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {appointment.doctors?.name || 'Dokter tidak ditemukan'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-gray-300">
                      {appointment.doctors?.specialty || ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Lokasi</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {appointment.location || 'Poliklinik Umum'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Nomor Antrian</p>
                    <p className="font-medium text-slate-900 dark:text-white">#{appointment.queue_number || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Informasi Pasien */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white border-b pb-2">Informasi Pasien</h3>
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Nama Pasien</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {patientInfo.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Nomor Telepon</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {patientInfo.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">Email</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {patientInfo.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-300">ID Janji Temu</p>
                    <p className="font-medium text-slate-900 dark:text-white">{appointment.id}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ringkasan Biaya */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 dark:bg-amber-900/20 dark:border-amber-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Biaya Konsultasi</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Termasuk asesmen awal</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-900 dark:text-amber-100 text-lg">
                    Rp {(typeof appointment.notes === 'number' ? appointment.notes : 150000).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Petunjuk */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-700 mb-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Petunjuk Kedatangan
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Datang 30 menit sebelum jadwal untuk registrasi awal</li>
                <li>• Bawa kartu identitas dan kartu BPJS (jika applicable)</li>
                <li>• Bawa riwayat medis sebelumnya (jika ada)</li>
                <li>• Hindari penggunaan pakaian terlalu longgar untuk pemeriksaan tertentu</li>
                <li>• Tunjukkan ID Janji Temu ini sebagai bukti pendaftaran</li>
              </ul>
            </div>
            
            {/* Aksi */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                onClick={() => router.push(`/appointments/${appointment.id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Lihat Detail Janji Temu
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/doctors')}
              >
                <Home className="h-4 w-4 mr-2" />
                Cari Dokter Lain
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-slate-600 dark:text-gray-400">
            Anda akan diarahkan ke halaman detail janji temu dalam{' '}
            <span className="font-bold text-emerald-600">{timeLeft}</span> detik...
          </p>
        </div>
      </div>
    </div>
  );
}