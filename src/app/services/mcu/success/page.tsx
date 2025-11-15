'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  User,
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  FileText,
  Download,
  QrCode,
  ArrowLeft,
  Shield,
  HeartPulse,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Home,
  CreditCard,
  Info
} from 'lucide-react';

// Mock data paket MCU
const mcuPackages = [
  { id: 'basic', name: 'MCU Basic', price: 'Rp 500.000' },
  { id: 'silver', name: 'MCU Silver', price: 'Rp 1.200.000' },
  { id: 'gold', name: 'MCU Gold', price: 'Rp 2.500.000' },
  { id: 'executive', name: 'MCU Executive', price: 'Rp 4.500.000' },
];

export default function MCUSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageName = searchParams.get('package') || 'basic';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Ambil data dari mock, dalam implementasi asli ini akan dari database SIMRS
  const [registrationData, setRegistrationData] = useState({
    patientName: 'Siti Aminah',
    patientRm: '123456',
    packageName: packageName,
    date: date,
    time: '07:00',
    queueNumber: 'MCU-001',
    location: 'Layanan MCU, Lantai 2, RSI Siti Hajar Mataram',
    registrationTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    bookingId: 'MCU-' + new Date().getTime().toString().substr(-6),
    phone: '081234567890',
    email: 'siti.aminah@email.com',
    paymentMethod: 'cash'
  });

  // Format tanggal ke dalam bahasa Indonesia
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Format jam MCU (akan diambil dari jadwal dokter di implementasi asli)
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Fungsi untuk menyimpan tiket sebagai PDF (simulasi)
  const handleSaveTicket = () => {
    alert('Tiket MCU berhasil disimpan! Dalam implementasi asli, ini akan menghasilkan file PDF tiket pendaftaran MCU.');
  };

  // Fungsi untuk menyalin nomor booking
  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(registrationData.bookingId);
    alert('Nomor booking berhasil disalin!');
  };

  // Fungsi untuk menyalin nomor antrian
  const handleCopyQueueNumber = () => {
    navigator.clipboard.writeText(registrationData.queueNumber);
    alert('Nomor antrian berhasil disalin!');
  };

  useEffect(() => {
    // Update waktu secara real-time
    setCurrentTime(new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }));
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white py-8 pt-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-200/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-200/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Pendaftaran MCU Berhasil!</h1>
            <p className="text-xl text-gray-600">Anda telah terdaftar dalam program Medical Check Up RSI Siti Hajar</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-2 border-emerald-200 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg text-center pb-6">
                <CardTitle className="text-2xl text-gray-800 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600 mr-3" />
                  Detail Pendaftaran MCU
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Nama Pasien</p>
                      <p className="font-semibold text-gray-800 text-lg">{registrationData.patientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Nomor Rekam Medis</p>
                      <p className="font-semibold text-gray-800 text-lg">{registrationData.patientRm}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Paket MCU</p>
                      <p className="font-semibold text-gray-800 text-lg">
                        {mcuPackages.find(p => p.id === registrationData.packageName)?.name || registrationData.packageName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Calendar className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Tanggal MCU</p>
                      <p className="font-semibold text-gray-800 text-lg">{formatDate(registrationData.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Jam Kedatangan</p>
                      <p className="font-semibold text-gray-800 text-lg">{formatTime(registrationData.time)} WITA</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Lokasi MCU</p>
                      <p className="font-semibold text-gray-800 text-lg">{registrationData.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Stethoscope className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Nomor Booking</p>
                      <div className="mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xl py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-200 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                          onClick={handleCopyBookingId}
                        >
                          {registrationData.bookingId}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Info className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Nomor Antrian</p>
                      <div className="mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xl py-3 px-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-emerald-200 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                          onClick={handleCopyQueueNumber}
                        >
                          {registrationData.queueNumber}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Kontak</p>
                      <p className="font-semibold text-gray-800 text-lg">{registrationData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800 text-lg">{registrationData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <CreditCard className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Metode Pembayaran</p>
                      <p className="font-semibold text-gray-800 text-lg capitalize">{registrationData.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center my-12"
          >
            <div className="bg-white p-6 border-2 border-emerald-200 rounded-2xl shadow-xl">
              <QrCode className="h-40 w-40 text-emerald-600 mx-auto" />
              <p className="text-center text-sm mt-4 text-gray-700 font-medium">Kode QR Pendaftaran</p>
              <p className="text-center text-xs text-gray-500 mt-1">Gunakan kamera ponsel Anda untuk scan</p>
            </div>
            <Button
              variant="outline"
              className="mt-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={handleSaveTicket}
            >
              <Download className="h-4 w-4 mr-2" />
              Simpan Tiket MCU
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Informasi Penting
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Harap datang 30 menit sebelum jadwal MCU untuk registrasi ulang</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Bawa KTP dan kartu peserta asuransi (jika ada)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Puasa minimal 8 jam sebelum pemeriksaan (sesuai paket)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Gunakan pakaian yang nyaman dan longgar</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Hasil MCU akan dikirimkan melalui email dalam 1-2 hari kerja</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                  Waktu Saat Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-700 text-center">{currentTime}</p>
                <p className="text-center text-sm text-gray-600 mt-1">Waktu Server RSI Siti Hajar</p>
              </CardContent>
            </Card>
            
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                  Waktu Pendaftaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-700 text-center">{registrationData.registrationTime}</p>
                <p className="text-center text-sm text-gray-600 mt-1">Waktu pendaftaran MCU Anda</p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/services/mcu">
                <HeartPulse className="h-5 w-5 mr-2" />
                Kembali ke Halaman Utama
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/services/mcu/packages">
                <Shield className="h-5 w-5 mr-2" />
                Lihat Paket Lain
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}