'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  Phone,
  User,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search
} from 'lucide-react';
import { Appointment } from '@/lib/admin-types';
import { useRouter } from 'next/navigation';

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter appointments berdasarkan status dan pencarian
  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || 
      (filter === 'upcoming' && new Date(appointment.appointment_date) >= new Date()) ||
      (filter === 'past' && new Date(appointment.appointment_date) < new Date()) ||
      (filter === 'cancelled' && appointment.status === 'cancelled');
    
    const matchesSearch = appointment.doctors?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctors?.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'in-progress':
        return 'default';
      case 'arrived':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Terjadwal';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'in-progress':
        return 'Berlangsung';
      case 'arrived':
        return 'Tiba';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('id-ID', { weekday: 'long' }),
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  const isUpcomingAppointment = (date: string) => {
    return new Date(date) >= new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Janji Temu Saya</h1>
          <p className="text-slate-600 dark:text-gray-400">
            Daftar janji temu yang telah Anda buat
          </p>
        </div>

        {/* Filter dan Pencarian */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Semua
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              size="sm"
            >
              Akan Datang
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              onClick={() => setFilter('past')}
              size="sm"
            >
              Riwayat
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'default' : 'outline'}
              onClick={() => setFilter('cancelled')}
              size="sm"
            >
              Dibatalkan
            </Button>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari dokter atau spesialisasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Statistik Singkat */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">Total Janji</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {appointments.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">Akan Datang</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {appointments.filter(a => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">Telah Selesai</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {appointments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">Dibatalkan</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Janji Temu */}
        {filteredAppointments.length === 0 ? (
          <Card className="border-0 shadow-xl rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Tidak ada janji temu</h3>
              <p className="text-slate-600 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Tidak ditemukan janji temu dengan kriteria yang Anda cari.'
                  : filter === 'upcoming' 
                    ? 'Anda tidak memiliki janji temu yang akan datang.'
                    : filter === 'past'
                      ? 'Anda tidak memiliki riwayat janji temu.'
                      : filter === 'cancelled'
                        ? 'Anda tidak memiliki janji temu yang dibatalkan.'
                        : 'Anda belum membuat janji temu apapun.'}
              </p>
              <Button 
                onClick={() => router.push('/doctors')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Janji Baru
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAppointments.map((appointment) => {
              const isUpcoming = isUpcomingAppointment(appointment.appointment_date);
              const isToday = new Date(appointment.appointment_date).toDateString() === new Date().toDateString();
              
              return (
                <Card 
                  key={appointment.id} 
                  className="border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-0.5 transition-transform"
                  onClick={() => router.push(`/appointments/${appointment.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {appointment.doctors?.name}
                              </h3>
                              <Badge 
                                variant={getStatusBadgeVariant(appointment.status)}
                                className="capitalize"
                              >
                                {getStatusText(appointment.status)}
                              </Badge>
                              {isToday && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                  Hari Ini
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-slate-600 dark:text-gray-300 mb-2">
                              {appointment.doctors?.specialty}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center text-slate-700 dark:text-gray-300">
                                <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                                <span>{formatDate(appointment.appointment_date).day}, {formatDate(appointment.appointment_date).date}</span>
                              </div>
                              
                              <div className="flex items-center text-slate-700 dark:text-gray-300">
                                <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                                <span>Pukul {appointment.appointment_time}</span>
                              </div>
                              
                              <div className="flex items-center text-slate-700 dark:text-gray-300">
                                <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                                <span>{appointment.location || 'Poliklinik Umum'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right md:text-left">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                              #{appointment.queue_number}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-gray-400">
                              Antrian
                            </div>
                          </div>
                        </div>
                        
                        {isUpcoming && appointment.status !== 'cancelled' && (
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-700">
                              <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-blue-900 dark:text-blue-100">Petunjuk Kedatangan</p>
                                  <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Datang 30 menit sebelum jadwal. Bawa kartu identitas dan kartu BPJS jika menggunakan.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 md:flex-col lg:flex-row">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                        >
                          Lihat Detail
                        </Button>
                        {isUpcoming && appointment.status !== 'cancelled' && (
                          <>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-amber-600 border-amber-600 hover:bg-amber-50"
                            >
                              Ubah Jadwal
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-rose-600 border-rose-600 hover:bg-rose-50"
                            >
                              Batalkan
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tombol Buat Janji Baru */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => router.push('/doctors')}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 px-8 py-6 rounded-xl text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Buat Janji Temu Baru
          </Button>
        </div>
      </div>
    </div>
  );
}