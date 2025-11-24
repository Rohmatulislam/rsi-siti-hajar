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
  Eye,
  CalendarPlus
} from 'lucide-react';
import { Appointment } from '@/lib/admin-types';

// Fungsi untuk mendapatkan semua janji temu
async function getAllAppointments(): Promise<Appointment[]> {
  const response = await fetch('/api/admin/appointments');
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json();
}

// Fungsi untuk menghapus janji temu
async function deleteAppointment(id: string): Promise<void> {
  const response = await fetch(`/api/admin/appointments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
}

// Fungsi untuk memperbarui status janji temu
async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const response = await fetch('/api/admin/appointments/status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update appointment status');
  }
  return response.json();
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Ambil data janji temu
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAllAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [refreshTrigger]);

  // Filter janji temu berdasarkan pencarian
  const filteredAppointments = appointments.filter(appointment => 
    (appointment.doctors?.name && appointment.doctors.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appointment.users?.full_name && appointment.users.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (appointment.status && appointment.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus janji temu ini?')) {
      try {
        await deleteAppointment(id);
        setRefreshTrigger(prev => prev + 1); // Refresh data
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setRefreshTrigger(prev => prev + 1); // Refresh data
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Janji Temu</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola janji temu pasien</p>
        </div>
        <Button>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Buat Janji Temu
        </Button>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari janji temu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data janji temu...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Nama Dokter</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.users?.full_name || '-'}</TableCell>
                        <TableCell>{appointment.doctors?.name || '-'}</TableCell>
                        <TableCell>{appointment.appointment_date}</TableCell>
                        <TableCell>{appointment.appointment_time}</TableCell>
                        <TableCell>
                          <select
                            value={appointment.status}
                            onChange={(e) => handleChangeStatus(appointment.id, e.target.value)}
                            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Dikonfirmasi</option>
                            <option value="cancelled">Dibatalkan</option>
                            <option value="completed">Selesai</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log('View appointment:', appointment.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log('Edit appointment:', appointment.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(appointment.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Tidak ada janji temu ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}