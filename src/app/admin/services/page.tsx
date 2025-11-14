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
  HeartPulse,
  Star
} from 'lucide-react';
import { getAllServices, deleteService } from '@/lib/service-service';
import { Service } from '@/lib/admin-types';
import Link from 'next/link';
import ServiceDialog from './components/service-dialog';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Ambil data layanan
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [refreshTrigger]);

  // Filter layanan berdasarkan pencarian
  const filteredServices = services.filter(service => 
    (service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      try {
        await deleteService(id);
        setRefreshTrigger(prev => prev + 1); // Refresh data
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleAddService = () => {
    setCurrentService(null);
    setIsDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setIsDialogOpen(true);
  };

  const handleViewService = (service: Service) => {
    // Di sini bisa ditambahkan fungsi untuk melihat detail layanan
    console.log('View service:', service.id);
  };

  const handleDialogSubmit = () => {
    setRefreshTrigger(prev => prev + 1); // Refresh data setelah submit
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola layanan kesehatan</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/services/featured">
              <Star className="h-4 w-4 mr-2" />
              Kelola Layanan Unggulan
            </Link>
          </Button>
          <Button onClick={handleAddService}>
            <HeartPulse className="h-4 w-4 mr-2" />
            Tambah Layanan
          </Button>
        </div>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data layanan...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Jam Operasional</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell>{service.category || '-'}</TableCell>
                        <TableCell>{service.location || '-'}</TableCell>
                        <TableCell>{service.operating_hours || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewService(service)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditService(service)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(service.id)}
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
                      <TableCell colSpan={5} className="text-center py-8">
                        Tidak ada layanan ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog untuk menambah/edit layanan */}
      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={currentService}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}