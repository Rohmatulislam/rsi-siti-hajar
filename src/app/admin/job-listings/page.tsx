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
  Briefcase
} from 'lucide-react';
import { getAllJobListings, deleteJobListing, updateJobListingStatus } from '@/lib/job-service';
import { JobListing } from '@/lib/admin-types';

export default function JobListingsPage() {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Ambil data lowongan pekerjaan
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        setLoading(true);
        const data = await getAllJobListings();
        setJobListings(data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, [refreshTrigger]);

  // Filter lowongan pekerjaan berdasarkan pencarian
  const filteredJobListings = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.department && job.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
      try {
        await deleteJobListing(id);
        setRefreshTrigger(prev => prev + 1); // Refresh data
      } catch (error) {
        console.error('Error deleting job listing:', error);
      }
    }
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await updateJobListingStatus(id, newStatus as 'active' | 'filled' | 'cancelled');
      setRefreshTrigger(prev => prev + 1); // Refresh data
    } catch (error) {
      console.error('Error updating job listing status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Lowongan Pekerjaan</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola lowongan pekerjaan</p>
        </div>
        <Button>
          <Briefcase className="h-4 w-4 mr-2" />
          Tambah Lowongan
        </Button>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari lowongan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data lowongan...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tipe Pekerjaan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobListings.length > 0 ? (
                    filteredJobListings.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department || '-'}</TableCell>
                        <TableCell>{job.location || '-'}</TableCell>
                        <TableCell>{job.employment_type || '-'}</TableCell>
                        <TableCell>
                          <select
                            value={job.status}
                            onChange={(e) => handleChangeStatus(job.id, e.target.value)}
                            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          >
                            <option value="active">Aktif</option>
                            <option value="filled">Terisi</option>
                            <option value="cancelled">Dibatalkan</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log('View job listing:', job.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log('Edit job listing:', job.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(job.id)}
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
                        Tidak ada lowongan ditemukan
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