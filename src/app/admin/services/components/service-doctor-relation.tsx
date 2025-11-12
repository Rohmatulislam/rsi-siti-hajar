'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Service, Doctor } from '@/lib/admin-types';
import { 
  getDoctorsByServiceId, 
  addDoctorToService, 
  removeDoctorFromService,
} from '@/lib/service-service';
import { getAllDoctorsForAppointment } from '@/lib/doctor-service';

interface ServiceDoctorRelationProps {
  service: Service;
}

export default function ServiceDoctorRelation({ service }: ServiceDoctorRelationProps) {
  const [currentDoctors, setCurrentDoctors] = useState<Doctor[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  // Ambil dokter terkait dengan layanan
  const fetchRelatedDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const doctors = await getDoctorsByServiceId(service.id);
      setCurrentDoctors(doctors);
    } catch (error) {
      console.error('Error fetching related doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Ambil dokter yang tersedia untuk ditambahkan
  const fetchAvailableDoctors = async () => {
    try {
      const allDoctors = await getAllDoctorsForAppointment();
      // Filter dokter yang belum terkait dengan layanan ini
      const available = allDoctors.filter(doctor => 
        !currentDoctors.some(relatedDoc => relatedDoc.id === doctor.id)
      );
      setAvailableDoctors(available);
    } catch (error) {
      console.error('Error fetching available doctors:', error);
    }
  };

  useEffect(() => {
    if (service?.id) {
      fetchRelatedDoctors();
    }
  }, [service]);

  useEffect(() => {
    if (currentDoctors.length > 0) {
      fetchAvailableDoctors();
    }
  }, [currentDoctors]);

  const handleAddDoctor = async (doctorId: string) => {
    setLoadingAdd(true);
    try {
      await addDoctorToService(service.id, doctorId);
      // Refresh data
      await fetchRelatedDoctors();
      await fetchAvailableDoctors();
    } catch (error) {
      console.error('Error adding doctor to service:', error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleRemoveDoctor = async (doctorId: string) => {
    setLoadingRemove(true);
    try {
      await removeDoctorFromService(service.id, doctorId);
      // Refresh data
      await fetchRelatedDoctors();
      await fetchAvailableDoctors();
    } catch (error) {
      console.error('Error removing doctor from service:', error);
    } finally {
      setLoadingRemove(false);
    }
  };

  const filteredAvailable = availableDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Dokter Terkait */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Dokter Terkait</CardTitle>
          <div className="flex items-center">
            {loadingAdd && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            <span className="text-sm text-muted-foreground">
              {currentDoctors.length} dokter terkait
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {loadingDoctors ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : currentDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentDoctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div>
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {doctor.specialty}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDoctor(doctor.id)}
                    disabled={loadingRemove}
                  >
                    {loadingRemove ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada dokter yang terkait dengan layanan ini
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tambah Dokter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tambah Dokter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredAvailable.length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredAvailable.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.specialty}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddDoctor(doctor.id)}
                      disabled={loadingAdd}
                    >
                      {loadingAdd ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {availableDoctors.length === 0 ? 'Tidak ada dokter tersedia' : 'Tidak ada dokter yang cocok'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}