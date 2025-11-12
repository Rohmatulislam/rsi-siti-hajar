'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RegistrationData {
  nik: string;
  name: string;
  gender: string;
  birthDate: string;
  address: string;
  phone: string;
  medicalRecordNumber?: string;
  patientType: string;
  polyclinic: string;
  doctor: string;
  id?: number;
  queueNumber: string;
  visitDate: string;
}

interface RegistrationConfirmationClientProps {
  initialData: RegistrationData;
}

// Mapping nama poliklinik
const polyclinicNames: Record<string, string> = {
  'penyakit-dalam': 'Penyakit Dalam',
  'bedah': 'Bedah',
  'anak': 'Anak',
  'kandungan': 'Kandungan',
  'mata': 'Mata',
  'kulit-dan-kelamin': 'Kulit dan Kelamin',
  'saraf': 'Saraf',
  'orthopedi': 'Orthopedi',
  'gigi': 'Gigi',
  'telinga-hidung-tenggorokan': 'Telinga, Hidung, Tenggorokan',
};

// Mapping nama dokter
const doctorNames: Record<string, string> = {
  'dr-andi-s': 'Dr. Andi Susanto, Sp.PD',
  'dr-budi-h': 'Dr. Budi Harsono, Sp.A',
  'dr-citra-m': 'Dr. Citra Maharani, Sp.OG',
  'dr-dedi-k': 'Dr. Dedi Kurniawan, Sp.B',
  'dr-era-n': 'Dr. Era Nuraini, Sp.M',
};

export default function RegistrationConfirmationClient({ initialData }: RegistrationConfirmationClientProps) {
  const router = useRouter();
  const [registrationData] = useState<RegistrationData>(initialData);

  useEffect(() => {
    // Di sini bisa ditambahkan logika tambahan jika diperlukan
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-emerald-700">Bukti Pendaftaran Berhasil</CardTitle>
          <CardDescription>
            Berikut adalah bukti pendaftaran janji temu Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white border border-emerald-200 rounded-xl p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-emerald-700 mb-2">BUKTI PENDAFTARAN</h2>
              <p className="text-gray-600">RSI Siti Hajar Mataram</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Tanggal Kunjungan</p>
                <p className="font-semibold">{registrationData.visitDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">No. Antrian Poli</p>
                <p className="font-bold text-emerald-600 text-xl">{registrationData.queueNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-semibold">{registrationData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIK</p>
                <p className="font-semibold">{registrationData.nik}</p>
              </div>
              {registrationData.medicalRecordNumber && (
                <div>
                  <p className="text-sm text-gray-600">No. Rekam Medis</p>
                  <p className="font-semibold">{registrationData.medicalRecordNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Jenis Kelamin</p>
                <p className="font-semibold">{registrationData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="font-semibold text-sm">{registrationData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">No. Telp</p>
                <p className="font-semibold">{registrationData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jenis Pasien</p>
                <p className="font-semibold capitalize">
                  {registrationData.patientType === 'lama' ? 'Pasien Lama' : 'Pasien Baru'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Poliklinik</p>
                <p className="font-semibold">{polyclinicNames[registrationData.polyclinic] || registrationData.polyclinic}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Dokter</p>
                <p className="font-semibold">{doctorNames[registrationData.doctor] || registrationData.doctor}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-center text-sm text-gray-600">
                Harap datang 30 menit sebelum jadwal dan bawa bukti pendaftaran ini
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.print()} 
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Cetak Bukti Pendaftaran
            </Button>
            <Button 
              onClick={() => router.push('/')} 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}