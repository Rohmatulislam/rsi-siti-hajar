'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  CheckCircle,
  User,
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  FileText,
  Download,
  ArrowLeft
} from 'lucide-react';

export default function ExecutiveSuccessPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');
  const schedule = searchParams.get('schedule');

  const [registrationData, setRegistrationData] = useState({
    patientName: 'Siti Aminah',
    patientRm: '123456',
    doctorName: 'dr. Ahmad Santoso, Sp.A',
    specialization: 'Spesialis Anak',
    date: date || '2024-01-01',
    schedule: schedule || 'Senin: 08:00-10:00',
    queueNumber: 'EKS-001',
    location: 'Poli Eksekutif Lantai 2',
    registrationTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  });

  // Format tanggal ke dalam bahasa Indonesia
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk menyimpan tiket sebagai PDF (simulasi)
  const handleSaveTicket = () => {
    alert('Tiket berhasil disimpan! Dalam implementasi asli, ini akan menghasilkan file PDF tiket pendaftaran.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-8 pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-gray-600">Anda telah terdaftar di Poli Eksekutif RSI Siti Hajar</p>
          </div>

          <Card className="border-emerald-200 shadow-lg mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">Detail Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start pb-3 border-b border-gray-100">
                  <User className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nama Pasien</p>
                    <p className="font-medium text-gray-800">{registrationData.patientName}</p>
                  </div>
                </div>

                <div className="flex items-start pb-3 border-b border-gray-100">
                  <User className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nomor Rekam Medis</p>
                    <p className="font-medium text-gray-800">{registrationData.patientRm}</p>
                  </div>
                </div>

                <div className="flex items-start pb-3 border-b border-gray-100">
                  <Stethoscope className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Spesialis</p>
                    <p className="font-medium text-gray-800">{registrationData.specialization}</p>
                  </div>
                </div>

                <div className="flex items-start pb-3 border-b border-gray-100">
                  <Stethoscope className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Dokter</p>
                    <p className="font-medium text-gray-800">{registrationData.doctorName}</p>
                  </div>
                </div>

                <div className="flex items-start pb-3 border-b border-gray-100">
                  <Calendar className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                    <p className="font-medium text-gray-800">{formatDate(registrationData.date)}</p>
                  </div>
                </div>

                <div className="flex items-start pb-3 border-b border-gray-100">
                  <Clock className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Jam Konsultasi</p>
                    <p className="font-medium text-gray-800">{registrationData.schedule.split(': ')[1]}</p>
                  </div>
                </div>

                <div className="flex items-start pb-3 border-b border-gray-100">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi Poli</p>
                    <p className="font-medium text-gray-800">{registrationData.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-emerald-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nomor Antrian</p>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-lg py-2 px-4 bg-emerald-100 text-emerald-800 border-emerald-200">
                        {registrationData.queueNumber}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button 
              asChild 
              variant="outline" 
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center"
            >
              <Link href="/services/featured/executive">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
            
            <Button 
              onClick={handleSaveTicket}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Simpan Tiket
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-primary text-primary hover:bg-gray-50 flex items-center justify-center"
            >
              <Link href="/queue">Lihat Antrian</Link>
            </Button>
          </div>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-emerald-700">
                    Harap datang 30 menit sebelum jadwal konsultasi. Bawa kartu identitas dan kartu BPJS (jika menggunakan BPJS).
                    Tunjukkan tiket ini kepada petugas pendaftaran.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}