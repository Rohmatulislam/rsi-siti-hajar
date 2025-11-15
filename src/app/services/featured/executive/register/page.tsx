'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import {
  User,
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  schedule: string[];
}

export default function ExecutiveRegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  const specialization = searchParams.get('specialization');
  
  const [patientInfo, setPatientInfo] = useState({
    noRkmMedis: '',
    name: '',
    address: '',
    phone: ''
  });
  const [patientFound, setPatientFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Mock data untuk dokter
  useEffect(() => {
    if (doctorId) {
      const mockDoctor: Doctor = {
        id: doctorId,
        name: 'dr. Ahmad Santoso, Sp.A',
        specialization: specialization || 'Spesialis Anak',
        schedule: ['Senin: 08:00-10:00', 'Rabu: 08:00-10:00', 'Jumat: 08:00-10:00']
      };
      setDoctor(mockDoctor);
      
      // Generate tanggal tersedia (hari ini + 7 hari ke depan)
      const dates = [];
      for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      setAvailableDates(dates);
    }
  }, [doctorId, specialization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  const fetchPatientData = async () => {
    if (!patientInfo.noRkmMedis) {
      setError('Nomor Rekam Medis harus diisi');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulasi API call untuk mendapatkan data pasien dari SIMRS
      // Dalam implementasi asli, ini akan mengakses tabel pasien di SIMRS Khanza
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data pasien
      if (patientInfo.noRkmMedis === '123456') {
        setPatientInfo({
          noRkmMedis: '123456',
          name: 'Siti Aminah',
          address: 'Jl. Merdeka No. 123, Mataram',
          phone: '081234567890'
        });
        setPatientFound(true);
      } else {
        setError('Nomor Rekam Medis tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data pasien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientFound) {
      setError('Silakan cari dan verifikasi data pasien terlebih dahulu');
      return;
    }
    
    if (!selectedSchedule) {
      setError('Silakan pilih jadwal konsultasi');
      return;
    }
    
    if (!selectedDate) {
      setError('Silakan pilih tanggal konsultasi');
      return;
    }
    
    try {
      // Simulasi API call untuk mendaftarkan pasien ke SIMRS
      // Dalam implementasi asli, ini akan menyimpan ke tabel reg_periksa di SIMRS Khanza
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect ke halaman sukses
      router.push(`/services/featured/executive/success?doctorId=${doctorId}&date=${selectedDate}&schedule=${selectedSchedule}`);
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftarkan pasien');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-8 pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              className="mr-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => router.back()}
            >
              ← Kembali
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Registrasi Poli Eksekutif</h1>
          </div>

          <form onSubmit={handleRegistration}>
            <Card className="border-emerald-200 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Informasi Dokter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Stethoscope className="h-5 w-5 text-emerald-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">{doctor?.name}</p>
                    <p className="text-sm text-gray-600">{doctor?.specialization}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Poli Eksekutif</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Data Pasien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="noRkmMedis">Nomor Rekam Medis</Label>
                    <div className="flex">
                      <Input
                        id="noRkmMedis"
                        name="noRkmMedis"
                        value={patientInfo.noRkmMedis}
                        onChange={handleInputChange}
                        placeholder="Masukkan nomor RM"
                        disabled={patientFound}
                        className="rounded-r-none"
                      />
                      <Button 
                        type="button" 
                        onClick={fetchPatientData}
                        disabled={loading || patientFound}
                        className="rounded-l-none bg-emerald-600 hover:bg-emerald-700"
                      >
                        {loading ? 'Mencari...' : 'Cari'}
                      </Button>
                    </div>
                  </div>
                  
                  {patientFound && (
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setPatientFound(false);
                          setPatientInfo({
                            noRkmMedis: '',
                            name: '',
                            address: '',
                            phone: ''
                          });
                        }}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        Ganti Pasien
                      </Button>
                    </div>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {patientFound ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Nama Lengkap</Label>
                      <p className="text-gray-800">{patientInfo.name}</p>
                    </div>
                    <div>
                      <Label>Alamat</Label>
                      <p className="text-gray-800">{patientInfo.address}</p>
                    </div>
                    <div>
                      <Label>No. Telepon</Label>
                      <p className="text-gray-800">{patientInfo.phone}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Silakan masukkan nomor rekam medis untuk mencari data pasien</p>
                )}
              </CardContent>
            </Card>

            {patientFound && doctor && (
              <Card className="border-emerald-200 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800">Informasi Pelayanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Pilih Tanggal</Label>
                      <Select value={selectedDate} onValueChange={setSelectedDate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tanggal" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDates.map(date => (
                            <SelectItem key={date} value={date}>
                              {new Date(date).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="schedule">Pilih Jadwal</Label>
                      <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jadwal" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctor.schedule.map((sched, index) => (
                            <SelectItem key={index} value={sched}>
                              {sched}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!patientFound || !selectedDate || !selectedSchedule}
              >
                Konfirmasi Pendaftaran
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}