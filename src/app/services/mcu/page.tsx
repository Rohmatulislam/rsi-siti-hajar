'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Users,
  Calendar,
  MapPin,
  Clock,
  Stethoscope,
  FileText,
  Star,
  ChevronRight,
  CheckCircle,
  Activity,
  Package,
  Award,
  Shield,
  Zap,
  Globe,
  Target,
  TrendingUp,
  User,
  CreditCard,
  Bell,
  Heart
} from 'lucide-react';

// Mock data untuk paket MCU
const mcuPackages = [
  {
    id: 'basic',
    name: 'MCU Basic',
    price: 'Rp 500.000',
    description: 'Pemeriksaan dasar kesehatan secara menyeluruh',
    features: [
      'Pemeriksaan fisik dokter',
      'Laboratorium dasar',
      'EKG',
      'Rontgen Thorax'
    ],
    duration: '3-4 jam',
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    popular: false
  },
  {
    id: 'silver',
    name: 'MCU Silver',
    price: 'Rp 1.200.000',
    description: 'Pemeriksaan komprehensif dengan hasil lengkap',
    features: [
      'Pemeriksaan fisik dokter',
      'Laboratorium lengkap',
      'EKG & USG Abdomen',
      'Rontgen Thorax',
      'Konsultasi dokter spesialis'
    ],
    duration: '4-5 jam',
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    popular: true
  },
  {
    id: 'gold',
    name: 'MCU Gold',
    price: 'Rp 2.500.000',
    description: 'Pemeriksaan menyeluruh dengan hasil mendalam',
    features: [
      'Pemeriksaan fisik dokter',
      'Laboratorium lengkap',
      'EKG & USG Abdomen',
      'Rontgen Thorax',
      'Konsultasi dokter spesialis',
      'USG Jantung',
      'Spirometri'
    ],
    duration: '5-6 jam',
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    popular: false
  },
  {
    id: 'executive',
    name: 'MCU Executive',
    price: 'Rp 4.500.000',
    description: 'Pemeriksaan premium dengan hasil terlengkap',
    features: [
      'Pemeriksaan fisik dokter',
      'Laboratorium lengkap',
      'EKG & USG Abdomen',
      'Rontgen Thorax',
      'Konsultasi dokter spesialis',
      'USG Jantung',
      'Spirometri',
      'Endoskopi',
      'MRI (opsional)'
    ],
    duration: '6-8 jam',
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    popular: false
  }
];

// Fitur unggulan MCU
const features = [
  {
    icon: <Shield className="h-6 w-6 text-emerald-600" />,
    title: 'Pemeriksaan Lengkap',
    description: 'Pemeriksaan menyeluruh dengan standar medis terbaik.'
  },
  {
    icon: <Globe className="h-6 w-6 text-emerald-600" />,
    title: 'Terintegrasi SIMRS',
    description: 'Data langsung terintegrasi dengan SIMRS Khanza.'
  },
  {
    icon: <Zap className="h-6 w-6 text-emerald-600" />,
    title: 'Hasil Cepat',
    description: 'Hasil lab dan radiologi tersedia dengan cepat.'
  },
  {
    icon: <Target className="h-6 w-6 text-emerald-600" />,
    title: 'Ruang Tunggu Nyaman',
    description: 'Fasilitas ruang tunggu eksklusif untuk pasien MCU.'
  },
  {
    icon: <Calendar className="h-6 w-6 text-emerald-600" />,
    title: 'Booking Online',
    description: 'Pendaftaran praktis tanpa antri panjang.'
  },
  {
    icon: <Clock className="h-6 w-6 text-emerald-600" />,
    title: 'Waktu Efisien',
    description: 'Proses MCU selesai dalam waktu singkat.'
  },
  {
    icon: <User className="h-6 w-6 text-emerald-600" />,
    title: 'Konsultasi Dokter',
    description: 'Konsultasi hasil pemeriksaan dengan dokter spesialis.'
  },
  {
    icon: <CreditCard className="h-6 w-6 text-emerald-600" />,
    title: 'Pembayaran Fleksibel',
    description: 'Pembayaran cash atau non-cash sesuai kebutuhan.'
  }
];

// Data ketersediaan MCU
const availabilityData = [
  { day: 'Senin', date: '18 Nov', available: true },
  { day: 'Selasa', date: '19 Nov', available: true },
  { day: 'Rabu', date: '20 Nov', available: false },
  { day: 'Kamis', date: '21 Nov', available: true },
  { day: 'Jumat', date: '22 Nov', available: true },
  { day: 'Sabtu', date: '23 Nov', available: true },
];

// Komponen halaman utama MCU
export default function MCUServicePage() {
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(now.toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white text-gray-800 overflow-hidden">
      {/* HERO SECTION - Modern dengan efek glassmorphism */}
      <section
        className="relative w-full h-[60vh] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="block">Layanan Medical Check Up </span>
              <span className="block text-emerald-300 mt-2">RSI Siti Hajar Mataram</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl">
              Pelayanan pemeriksaan kesehatan komprehensif, cepat, nyaman, dan terintegrasi.
              Deteksi dini berbagai penyakit untuk menjaga kesehatan optimal Anda dan keluarga.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href="/services/mcu/packages">
                    <Package className="h-5 w-5 mr-2" />
                    Lihat Paket MCU
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-white text-black hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href="/services/mcu/register">
                    <HeartPulse className="h-5 w-5 mr-2" />
                    Daftar Sekarang
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] -mb-1">
          <svg
            viewBox="0 0 1440 180"
            className="w-full h-[90px] text-white fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,112C672,107,768,149,864,160C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,180L0,180Z" />
          </svg>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Kenapa Harus Medical Check Up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center bg-emerald-100/50 px-4 py-2 rounded-full mb-4">
              <HeartPulse className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-emerald-700 font-medium">Pemeriksaan Kesehatan Premium</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Kenapa Harus Medical Check Up?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Dapatkan deteksi dini berbagai penyakit, evaluasi kondisi kesehatan secara menyeluruh,
              dan rekomendasi perawatan yang sesuai untuk menjaga kesehatan optimal Anda dan keluarga.
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">98%</h3>
              <p className="text-gray-600">Akurasi Deteksi Dini</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">2 Jam</h3>
              <p className="text-gray-600">Rata-rata Durasi Pemeriksaan</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">95%</h3>
              <p className="text-gray-600">Kepuasan Pasien</p>
            </motion.div>
          </div>

          {/* Daftar Paket MCU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Paket Medical Check Up</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Pilih paket MCU yang sesuai dengan kebutuhan kesehatan Anda.
                Semua paket dilakukan secara menyeluruh dan terintegrasi melalui SIMRS Khanza.
              </p>
            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {mcuPackages.map((pkg, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5
        ${pkg.popular ? 'border-amber-500 ring-2 ring-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50' : 'border-emerald-200 bg-white'}`}>

        {/* HEADER */}
        <div className={`${pkg.popular ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}
          rounded-t-lg p-3`}>
          <div className="text-xs font-semibold text-white flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1 bg-white/20 rounded-md">
                {pkg.icon}
              </div>
              <span className="text-sm">{pkg.name}</span>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">{pkg.price}</div>
              <div className="text-[0.6rem] opacity-80">{pkg.duration}</div>
            </div>
          </div>

          {pkg.popular && (
            <div className="mt-1.5 flex justify-center -mb-2">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 rounded-full text-[0.6rem] font-medium flex items-center shadow-sm">
                <Award className="h-2.5 w-2.5 mr-0.5" />
                Paling Populer
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <CardContent className="p-4 flex flex-col flex-grow">
          <p className="text-gray-700 text-xs mb-2">{pkg.description}</p>

          <ul className="space-y-1 mb-3">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mt-0.5 mr-1.5 p-0.5 bg-emerald-100 rounded-full">
                  <CheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                </div>
                <span className="text-gray-700 text-[0.65rem] leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col space-y-1.5">
            <Button
              asChild
              className={`w-full text-xs py-1.5 ${pkg.popular ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              <Link href={`/services/mcu/packages/${pkg.id}`}>Lihat Detail</Link>
            </Button>

            <Button
              asChild
              variant={pkg.popular ? 'default' : 'outline'}
              className={`w-full text-xs py-1.5 ${pkg.popular ? 'bg-white hover:bg-amber-50 text-amber-600 border border-amber-200' : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'}`}
            >
              <Link href={`/services/mcu/register?package=${pkg.id}`}>Daftar Sekarang</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>

          </motion.div>

          {/* Keunggulan MCU di RSI Siti Hajar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Keunggulan MCU di RSI Siti Hajar</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pelayanan Medical Check Up terbaik dengan teknologi modern dan tim medis profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield className="h-6 w-6 text-emerald-600" />,
                  title: "Terintegrasi SIMRS",
                  description: "Data langsung terintegrasi dengan SIMRS Khanza untuk efisiensi pelayanan"
                },
                {
                  icon: <Users className="h-6 w-6 text-emerald-600" />,
                  title: "Tim Medis Berpengalaman",
                  description: "Ditangani oleh dokter spesialis dan tenaga medis terlatih"
                },
                {
                  icon: <Zap className="h-6 w-6 text-emerald-600" />,
                  title: "Hasil Cepat & Akurat",
                  description: "Hasil pemeriksaan laboratorium dan radiologi tersedia dalam waktu singkat"
                },
                {
                  icon: <Target className="h-6 w-6 text-emerald-600" />,
                  title: "Ruang Tunggu Nyaman",
                  description: "Fasilitas ruang tunggu eksklusif dengan suasana tenang dan nyaman"
                },
                {
                  icon: <Activity className="h-6 w-6 text-emerald-600" />,
                  title: "Pemeriksaan Lengkap",
                  description: "Pemeriksaan menyeluruh dengan standar medis terbaik"
                },
                {
                  icon: <Globe className="h-6 w-6 text-emerald-600" />,
                  title: "Booking Online",
                  description: "Pendaftaran praktis tanpa antri panjang melalui sistem online"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col bg-white">
                    <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                      <div className="bg-emerald-100 p-4 rounded-full mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-700 text-center">{feature.description}</p>
                      <div className="mt-auto pt-4">
                        <div className="w-8 h-0.5 bg-emerald-200"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Layanan dan Proses MCU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Layanan dan Proses MCU</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pemeriksaan kesehatan komprehensif yang terdiri dari berbagai layanan unggulan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield className="h-6 w-6 text-emerald-600" />,
                  title: "Registrasi Cepat",
                  description: "Proses pendaftaran online tanpa antrian panjang"
                },
                {
                  icon: <Calendar className="h-6 w-6 text-emerald-600" />,
                  title: "Booking Jadwal",
                  description: "Pilih waktu MCU yang sesuai dengan jadwal Anda"
                },
                {
                  icon: <User className="h-6 w-6 text-emerald-600" />,
                  title: "Pemeriksaan Awal",
                  description: "Anamnesis dan pemeriksaan fisik oleh dokter umum"
                },
                {
                  icon: <Stethoscope className="h-6 w-6 text-emerald-600" />,
                  title: "Laboratorium Lengkap",
                  description: "Pemeriksaan darah, urin, dan fungsi organ"
                },
                {
                  icon: <Activity className="h-6 w-6 text-emerald-600" />,
                  title: "Radiologi & USG",
                  description: "Rontgen, USG, dan pemeriksaan imaging lainnya"
                },
                {
                  icon: <HeartPulse className="h-6 w-6 text-emerald-600" />,
                  title: "Konsultasi Spesialis",
                  description: "Konsultasi dengan dokter spesialis terkait"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col bg-white">
                    <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                      <div className="bg-emerald-100 p-4 rounded-full mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-700 text-center">{feature.description}</p>
                      <div className="mt-auto pt-4">
                        <div className="w-8 h-0.5 bg-emerald-200"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alur MCU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Alur Medical Check Up</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ikuti langkah-langkah sederhana untuk mendapatkan pemeriksaan kesehatan menyeluruh di RSI Siti Hajar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Pendaftaran",
                  description: "Daftar secara online atau langsung di loket MCU"
                },
                {
                  step: 2,
                  title: "Pemeriksaan Awal",
                  description: "Anamnesis dan pemeriksaan fisik oleh dokter"
                },
                {
                  step: 3,
                  title: "Pemeriksaan Penunjang",
                  description: "Laboratorium, radiologi, dan pemeriksaan lainnya"
                },
                {
                  step: 4,
                  title: "Konsultasi Hasil",
                  description: "Konsultasi dengan dokter untuk hasil pemeriksaan"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 text-center h-full">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-700">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Jadwal Ketersediaan MCU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Jadwal Ketersediaan MCU</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Pilih tanggal terbaik untuk MCU Anda. Sistem kami akan menampilkan ketersediaan real-time.
              </p>
              
              <div className="inline-flex items-center bg-emerald-100/50 px-4 py-2 rounded-full mb-4">
                <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-emerald-700 font-medium">{currentDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {availabilityData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`border-2 text-center p-4 cursor-pointer transition-all duration-300 ${
                    item.available 
                      ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100' 
                      : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                  }`}>
                    <p className="font-semibold text-gray-700">{item.day}</p>
                    <p className="text-lg font-bold text-emerald-700">{item.date}</p>
                    <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs ${
                      item.available 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.available ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Tersedia
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Penuh
                        </>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 mb-16"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Apa Kata Mereka?</h3>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-emerald-100">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 italic mb-6">
                  "Layanan MCU di RSI Siti Hajar sangat memuaskan. Prosesnya cepat, hasilnya akurat, dan biayanya terjangkau.
                  Dokternya ramah dan memberikan penjelasan yang mudah dimengerti."
                </p>
                <div className="font-semibold text-gray-800">- Ibu Siti Nurhaliza</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Siap untuk Menjaga Kesehatan Anda?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Jadikan kesehatan sebagai prioritas utama dengan Medical Check Up berkualitas tinggi
              dari RSI Siti Hajar Mataram.
            </p>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/services/mcu/register">
                <HeartPulse className="h-5 w-5 mr-2" />
                Daftar MCU Sekarang
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">RSI Siti Hajar</h4>
              <p className="text-emerald-200">
                Layanan kesehatan terpadu dengan teknologi modern dan pelayanan prima untuk kesehatan masyarakat.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan Kami</h4>
              <ul className="space-y-2 text-emerald-200">
                <li><Link href="/services/mcu" className="hover:text-emerald-300">Medical Check Up</Link></li>
                <li><Link href="/services/poli" className="hover:text-emerald-300">Poli</Link></li>
                <li><Link href="/services/laboratorium" className="hover:text-emerald-300">Laboratorium</Link></li>
                <li><Link href="/services/radiologi" className="hover:text-emerald-300">Radiologi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-emerald-200">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Jl. Lalu Nyoman Tjitra No.1, Mataram
                </li>
                <li className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  (0370) 633555
                </li>
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  info@rsitisitihajar.co.id
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Integrasi SIMRS</h4>
              <p className="text-emerald-200 mb-4">
                Sistem informasi manajemen rumah sakit yang terintegrasi dan aman.
              </p>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-sm">Terintegrasi dengan SIMRS Khanza</span>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-emerald-300">
            <p>© {new Date().getFullYear()} RSI Siti Hajar Mataram. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}