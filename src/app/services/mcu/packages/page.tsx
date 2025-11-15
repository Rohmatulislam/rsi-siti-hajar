'use client';

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
  TrendingUp
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

export default function MCUPackagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white text-gray-800 overflow-hidden">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[50vh] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center"
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
              <span className="block">Paket Medical Check Up </span>
              <span className="block text-emerald-300 mt-2">RSI Siti Hajar Mataram</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl">
              Pilih paket MCU yang sesuai dengan kebutuhan kesehatan Anda.
              Deteksi dini berbagai penyakit untuk menjaga kesehatan optimal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" />
                <span>Pemeriksaan menyeluruh dan komprehensif</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" />
                <span>Terintegrasi dengan SIMRS Khanza</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" />
                <span>Hasil pemeriksaan cepat dan akurat</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" />
                <span>Layanan dengan tim medis berpengalaman</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
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
      <section className="relative py-20 bg-gradient-to-b from-white to-emerald-50">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg border border-emerald-100 shadow-2xl rounded-3xl p-6 md:p-10"
          >
            {/* Daftar Paket MCU */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center bg-emerald-100/50 px-4 py-2 rounded-full mb-4">
                  <Package className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-emerald-700 font-medium">Paket Pemeriksaan Kesehatan</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Pilihan Paket MCU</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Kami menyediakan berbagai paket Medical Check Up yang dapat disesuaikan
                  dengan kebutuhan dan kondisi kesehatan Anda.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {mcuPackages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${
                      pkg.popular
                        ? 'border-emerald-500 ring-2 ring-emerald-200 scale-105 relative'
                        : 'border-emerald-200 hover:border-emerald-300'
                    }`}>
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Paling Populer
                          </span>
                        </div>
                      )}
                      <CardHeader className={`${pkg.popular ? 'bg-emerald-500/10' : 'bg-emerald-50'} rounded-t-lg`}>
                        <CardTitle className="text-lg font-semibold text-emerald-800 flex items-center">
                          <div className="mr-3">{pkg.icon}</div>
                          {pkg.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-6">
                          <p className="text-3xl font-bold text-gray-800">{pkg.price}</p>
                          <p className="text-sm text-gray-600 mt-1">{pkg.duration}</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-col space-y-3">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              asChild
                              className={`w-full ${pkg.popular ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white shadow-md`}
                            >
                              <Link href={`/services/mcu/packages/${pkg.id}`}>
                                Lihat Detail
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              asChild
                              variant="outline"
                              className={`w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 ${pkg.popular ? 'hover:bg-emerald-100' : ''} shadow-sm`}
                            >
                              <Link href={`/services/mcu/register?package=${pkg.id}`}>
                                Daftar Sekarang
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fitur Unggulan MCU */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Mengapa Memilih Paket MCU Kami?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Kami menawarkan pengalaman pemeriksaan kesehatan yang terbaik dengan teknologi terkini dan pelayanan prima.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
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
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="bg-emerald-100 p-3 rounded-full mb-4">
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2 text-lg">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl"
            >
              {[
                { number: '98%', label: 'Akurasi Deteksi Dini', icon: <TrendingUp className="h-8 w-8 text-emerald-600" /> },
                { number: '2 JAM', label: 'Rata-rata Durasi Pemeriksaan', icon: <Clock className="h-8 w-8 text-emerald-600" /> },
                { number: '95%', label: 'Kepuasan Pasien', icon: <Users className="h-8 w-8 text-emerald-600" /> }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <h4 className="text-3xl font-bold text-emerald-600 mb-2">{stat.number}</h4>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Siap untuk Menjaga Kesehatan Anda?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Jadikan kesehatan sebagai prioritas utama dengan Medical Check Up berkualitas tinggi
                dari RSI Siti Hajar Mataram.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"
                  >
                    <Link href="/services/mcu/register">
                      <HeartPulse className="h-5 w-5 mr-2" />
                      Daftar MCU Sekarang
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"
                  >
                    <Link href="/services/mcu">
                      Kembali ke Beranda MCU
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}