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
  Plus,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react';
import DoctorDialog from '@/components/doctors/admin/doctor-dialog';
import { getAllDoctors, deleteDoctor, updateAllDoctorSlugs } from '@/lib/doctor-service';
import { Doctor } from '@/lib/admin-types';
import { useAuth } from '@clerk/nextjs';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingSlugs, setUpdatingSlugs] = useState(false);
  const [slugUpdateMessage, setSlugUpdateMessage] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Ambil data dokter
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [refreshTrigger]);

  // Filter dokter berdasarkan pencarian
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.kd_dokter && doctor.kd_dokter.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (doctor.sip && doctor.sip.toLowerCase().includes(searchTerm.toLowerCase())) ||
    doctor.education?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateSlugs = async () => {
    setUpdatingSlugs(true);
    setSlugUpdateMessage('');
    try {
      const result = await updateAllDoctorSlugs();
      setSlugUpdateMessage(`Slug berhasil diperbarui untuk ${result.updatedCount} dokter.`);
      // Refresh daftar dokter
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error updating slugs:', error);
      setSlugUpdateMessage('Gagal memperbarui slug: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui'));
    } finally {
      setUpdatingSlugs(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
      try {
        await deleteDoctor(id);
        // Refresh data
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleCreate = () => {
    setEditingDoctor(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingDoctor(null);
  };

  const handleSave = () => {
    setRefreshTrigger(prev => prev + 1); // Refresh data setelah simpan
    handleDialogClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Dokter</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola data dokter di rumah sakit</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleUpdateSlugs} 
            disabled={updatingSlugs}
            variant="outline"
          >
            {updatingSlugs ? 'Memperbarui...' : 'Perbarui Semua Slug'}
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Dokter
          </Button>
        </div>
      </div>

      {slugUpdateMessage && (
        <div className={`mb-4 p-3 rounded-lg ${slugUpdateMessage.includes('berhasil') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {slugUpdateMessage}
        </div>
      )}

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari dokter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data dokter...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead>Pendidikan</TableHead>
                    <TableHead>Biaya Konsultasi</TableHead>
                    <TableHead>Eksekutif</TableHead>
                    <TableHead>Kode Dokter</TableHead>
                    <TableHead>SIP</TableHead>
                    <TableHead>BPJS</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          {doctor.image_url ? (
                            <img 
                              src={doctor.image_url} 
                              alt={doctor.name} 
                              className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>{doctor.education}</TableCell>
                        <TableCell>Rp {doctor.consultation_fee?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          {doctor.is_executive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              Ya
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Tidak
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{doctor.kd_dokter || '-'}</TableCell>
                        <TableCell>{doctor.sip || '-'}</TableCell>
                        <TableCell>
                          {doctor.bpjs ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Ya
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Tidak
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(doctor)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(doctor.id)}
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
                      <TableCell colSpan={7} className="text-center py-8">
                        Tidak ada dokter ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DoctorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doctor={editingDoctor}
        onSubmit={handleSave}
      />
    </div>
  );
}