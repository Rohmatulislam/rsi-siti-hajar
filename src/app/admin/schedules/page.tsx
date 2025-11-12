'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getAllSchedules, deleteSchedule } from '@/lib/schedule-service';
import { Schedule } from '@/lib/admin-types';
import ScheduleDialog from './components/schedule-dialog';
import { getAllDoctors } from '@/lib/doctor-service';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [doctors, setDoctors] = useState<{ id: string; name: string; specialty: string }[]>([]);

  // Ambil data jadwal
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ambil data dokter dan jadwal
        const [schedulesData, doctorsData] = await Promise.all([
          getAllSchedules(),
          getAllDoctors()
        ]);
        
        setSchedules(schedulesData);
        setDoctors(doctorsData.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // Filter jadwal berdasarkan pencarian
  const filteredSchedules = schedules.filter(schedule => 
    (schedule.doctors?.name && schedule.doctors.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    schedule.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.start_time.includes(searchTerm) ||
    schedule.end_time.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini? Data yang dihapus tidak dapat dikembalikan.')) {
      try {
        await deleteSchedule(id);
        setRefreshTrigger(prev => prev + 1); // Refresh data
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Gagal menghapus jadwal. Silakan coba lagi.');
      }
    }
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setDialogOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    setRefreshTrigger(prev => prev + 1); // Refresh data after submit
  };

  // Fungsi ini tidak lagi digunakan sejak kolom berubah dari 'day_of_week' menjadi 'date'
  // Komentar ini tetap ada untuk referensi jika diperlukan di masa depan

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Jadwal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola jadwal dokter dan waktu praktek</p>
        </div>
        <Button onClick={handleAddSchedule} className="w-full sm:w-auto">
          <Clock className="h-4 w-4 mr-2" />
          Tambah Jadwal Baru
        </Button>
      </div>

      <ScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={editingSchedule}
        doctors={doctors}
        onSubmit={handleDialogSubmit}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daftar Jadwal
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Menampilkan {filteredSchedules.length} dari {schedules.length} jadwal
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Cari jadwal, dokter, atau hari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Memuat data jadwal...</p>
            </div>
          ) : filteredSchedules.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="w-[20%]">Dokter</TableHead>
                    <TableHead className="w-[15%]">Spesialisasi</TableHead>
                    <TableHead className="w-[15%]">Tanggal</TableHead>
                    <TableHead className="w-[15%]">Jam Mulai</TableHead>
                    <TableHead className="w-[15%]">Jam Selesai</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[10%] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {schedule.doctors?.name || '-'}
                        </div>
                      </TableCell>
                      <TableCell>{schedule.doctors?.specialty || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(schedule.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {schedule.start_time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {schedule.end_time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {schedule.available ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-600">Tersedia</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-red-600">Tidak Tersedia</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSchedule(schedule)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(schedule.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada jadwal ditemukan</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `Tidak ditemukan jadwal yang cocok dengan "${searchTerm}"` 
                  : 'Belum ada jadwal yang dibuat'}
              </p>
              <Button onClick={handleAddSchedule}>
                <Clock className="h-4 w-4 mr-2" />
                Buat Jadwal Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}