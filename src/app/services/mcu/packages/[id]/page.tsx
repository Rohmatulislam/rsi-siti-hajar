'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  Stethoscope,
  User,
  FileText,
  ChevronRight,
  CheckCircle,
  Activity,
  Package,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Award,
  Info,
  Clock3,
  Heart,
  Syringe,
  Eye,
  Brain,
  Scan,
  FileCheck,
  Users,
  AlertCircle,
  Home,
  ArrowLeft
} from 'lucide-react';

interface MCUPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  duration: string;
  icon: React.ReactNode;
  popular: boolean;
  details: {
    dokter: string[];
    laboratorium: string[];
    radiologi: string[];
    penunjang: string[];
    persiapan: string[];
    catatan: string[];
  };
}

export default function MCUPackageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<MCUPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      const mockPackages: MCUPackage[] = [
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
          popular: false,
          details: {
            dokter: [
              'Anamnesis dan pemeriksaan fisik umum',
              'Pemeriksaan tekanan darah, nadi, suhu',
              'Pemeriksaan fisik kepala, leher, dada, perut'
            ],
            laboratorium: [
              'Hematologi lengkap (darah rutin)',
              'Kimia darah (gula darah, fungsi ginjal, fungsi hati)',
              'Lipid profil (kolesterol total, LDL, HDL)',
              'Asam urat, kreatinin, ureum'
            ],
            radiologi: [
              'Rontgen Thorax (paru-paru dan jantung)'
            ],
            penunjang: [
              'Elektrokardiografi (EKG)',
              'Pemeriksaan mata dasar'
            ],
            persiapan: [
              'Puasa minimal 8 jam sebelum MCU',
              'Hentikan obat-obatan tertentu jika dianjurkan dokter',
              'Gunakan pakaian yang nyaman',
              'Bawa semua hasil pemeriksaan sebelumnya jika ada'
            ],
            catatan: [
              'Khusus wanita usia subur dianjurkan tidak sedang hamil',
              'Pemeriksaan USG tidak dilakukan jika sedang haid'
            ]
          }
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
          popular: true,
          details: {
            dokter: [
              'Anamnesis dan pemeriksaan fisik umum',
              'Pemeriksaan tekanan darah, nadi, suhu',
              'Pemeriksaan fisik kepala, leher, dada, perut',
              'Konsultasi dokter spesialis'
            ],
            laboratorium: [
              'Hematologi lengkap (darah rutin)',
              'Kimia darah (gula darah, fungsi ginjal, fungsi hati)',
              'Lipid profil (kolesterol total, LDL, HDL)',
              'Asam urat, kreatinin, ureum',
              'Tiroksin (T3, T4, TSH)',
              'Protein total dan protein fraksi'
            ],
            radiologi: [
              'Rontgen Thorax (paru-paru dan jantung)',
              'USG Abdomen (hati, ginjal, kantung empedu, pankreas, limpa)'
            ],
            penunjang: [
              'Elektrokardiografi (EKG)',
              'Pemeriksaan mata dasar dengan refraktometer',
              'Spirometri (fungsi paru)'
            ],
            persiapan: [
              'Puasa minimal 10 jam sebelum MCU',
              'Hentikan obat-obatan tertentu jika dianjurkan dokter',
              'Gunakan pakaian yang nyaman',
              'Bawa semua hasil pemeriksaan sebelumnya jika ada',
              'Jangan berolahraga berat sebelum MCU'
            ],
            catatan: [
              'Khusus wanita usia subur dianjurkan tidak sedang hamil',
              'Pemeriksaan USG tidak dilakukan jika sedang haid',
              'Pemeriksaan spirometri tidak dilakukan jika sedang batuk berat'
            ]
          }
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
          popular: false,
          details: {
            dokter: [
              'Anamnesis dan pemeriksaan fisik umum',
              'Pemeriksaan tekanan darah, nadi, suhu',
              'Pemeriksaan fisik kepala, leher, dada, perut',
              'Konsultasi dokter spesialis',
              'Pemeriksaan neurologis dasar'
            ],
            laboratorium: [
              'Hematologi lengkap (darah rutin)',
              'Kimia darah (gula darah, fungsi ginjal, fungsi hati)',
              'Lipid profil (kolesterol total, LDL, HDL)',
              'Asam urat, kreatinin, ureum',
              'Tiroksin (T3, T4, TSH)',
              'Protein total dan protein fraksi',
              'Tumor marker (AFP, CEA, PSA)',
              'HbA1c (diabetes)',
              'Urinalisis (urine lengkap)'
            ],
            radiologi: [
              'Rontgen Thorax (paru-paru dan jantung)',
              'USG Abdomen (hati, ginjal, kantung empedu, pankreas, limpa)',
              'USG Jantung (Echocardiography)'
            ],
            penunjang: [
              'Elektrokardiografi (EKG)',
              'Pemeriksaan mata lengkap dengan refraktometer',
              'Spirometri (fungsi paru)',
              'Audiometri (pendengaran)'
            ],
            persiapan: [
              'Puasa minimal 12 jam sebelum MCU',
              'Hentikan obat-obatan tertentu jika dianjurkan dokter',
              'Gunakan pakaian yang nyaman',
              'Bawa semua hasil pemeriksaan sebelumnya jika ada',
              'Jangan berolahraga berat 24 jam sebelum MCU',
              'Hindari konsumsi alkohol 24 jam sebelum MCU'
            ],
            catatan: [
              'Khusus wanita usia subur dianjurkan tidak sedang hamil',
              'Pemeriksaan USG tidak dilakukan jika sedang haid',
              'Pemeriksaan spirometri tidak dilakukan jika sedang batuk berat',
              'Pemeriksaan USG jantung tidak dilakukan jika obesitas berat'
            ]
          }
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
          popular: false,
          details: {
            dokter: [
              'Anamnesis dan pemeriksaan fisik umum',
              'Pemeriksaan tekanan darah, nadi, suhu',
              'Pemeriksaan fisik kepala, leher, dada, perut',
              'Konsultasi dokter spesialis',
              'Pemeriksaan neurologis komprehensif',
              'Konsultasi dokter spesialis perawatan lanjutan'
            ],
            laboratorium: [
              'Hematologi lengkap (darah rutin)',
              'Kimia darah lengkap',
              'Lipid profil lengkap',
              'Asam urat, kreatinin, ureum',
              'Tiroksin (T3, T4, TSH)',
              'Protein total dan protein fraksi',
              'Tumor marker lengkap (AFP, CEA, PSA, CA-125, dll)',
              'HbA1c (diabetes)',
              'Urinalisis lengkap',
              'Hormon reproduksi',
              'Imunologi dasar'
            ],
            radiologi: [
              'Rontgen Thorax (paru-paru dan jantung)',
              'USG Abdomen (hati, ginjal, kantung empedu, pankreas, limpa)',
              'USG Jantung (Echocardiography)',
              'USG Tiroid',
              'USG Prostat (pria)',
              'USG Panggul (wanita)',
              'Mammografi (wanita usia >40thn)'
            ],
            penunjang: [
              'Elektrokardiografi (EKG)',
              'Pemeriksaan mata lengkap',
              'Spirometri (fungsi paru)',
              'Audiometri (pendengaran)',
              'Endoskopi (jika diperlukan)',
              'Konsultasi nutrisionis'
            ],
            persiapan: [
              'Puasa minimal 12 jam sebelum MCU',
              'Hentikan obat-obatan tertentu jika dianjurkan dokter',
              'Gunakan pakaian yang nyaman',
              'Bawa semua hasil pemeriksaan sebelumnya jika ada',
              'Jangan berolahraga berat 24 jam sebelum MCU',
              'Hindari konsumsi alkohol 24 jam sebelum MCU',
              'Datang lebih awal untuk registrasi',
              'Bawa perlengkapan pribadi jika perlu'
            ],
            catatan: [
              'Khusus wanita usia subur dianjurkan tidak sedang hamil',
              'Pemeriksaan USG tidak dilakukan jika sedang haid',
              'Pemeriksaan spirometri tidak dilakukan jika sedang batuk berat',
              'MRI tidak dilakukan jika memiliki alat implan logam',
              'Endoskopi hanya dilakukan sesuai indikasi'
            ]
          }
        }
      ];

      const selectedPackage = mockPackages.find(pkg => pkg.id === id);
      if (selectedPackage) {
        setPkg(selectedPackage);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-emerald-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-emerald-200 rounded w-1/2 mb-6"></div>
              <div className="h-64 bg-emerald-100 rounded-lg mb-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Paket Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">Paket MCU yang Anda cari tidak ditemukan.</p>
            <Button asChild>
              <Link href="/services/mcu/packages">Kembali ke Daftar Paket</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white text-gray-800">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[40vh] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center"
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
            <div className="flex items-center mb-4">
              <Button
                variant="outline"
                className="mr-4 border-white text-white hover:bg-white/10"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div className="bg-emerald-500/20 p-3 rounded-full">
                {pkg.icon}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {pkg.name}
            </h1>
            <p className="text-xl text-emerald-200 mb-4">
              {pkg.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-emerald-300">{pkg.price}</span>
                <p className="text-sm text-emerald-100">per orang</p>
              </div>
              <div className="flex items-center text-emerald-100">
                <Clock className="h-4 w-4 mr-1" />
                <span>{pkg.duration}</span>
              </div>
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Rincian Pemeriksaan */}
                <Card className="border-emerald-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <FileCheck className="h-5 w-5 text-emerald-600 mr-2" />
                      Rincian Pemeriksaan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Pemeriksaan Dokter */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                          <Stethoscope className="h-5 w-5 text-emerald-600 mr-2" />
                          Pemeriksaan Dokter
                        </h3>
                        <ul className="space-y-2">
                          {pkg.details.dokter.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pemeriksaan Laboratorium */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                          <Syringe className="h-5 w-5 text-emerald-600 mr-2" />
                          Pemeriksaan Laboratorium
                        </h3>
                        <ul className="space-y-2">
                          {pkg.details.laboratorium.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pemeriksaan Radiologi */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                          <Scan className="h-5 w-5 text-emerald-600 mr-2" />
                          Pemeriksaan Radiologi
                        </h3>
                        <ul className="space-y-2">
                          {pkg.details.radiologi.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pemeriksaan Penunjang */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                          <Heart className="h-5 w-5 text-emerald-600 mr-2" />
                          Pemeriksaan Penunjang
                        </h3>
                        <ul className="space-y-2">
                          {pkg.details.penunjang.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Persiapan Sebelum MCU */}
                <Card className="border-emerald-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <Info className="h-5 w-5 text-emerald-600 mr-2" />
                      Persiapan Sebelum MCU
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {pkg.details.persiapan.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <Target className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Catatan Penting */}
                <Card className="border-emerald-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <AlertCircle className="h-5 w-5 text-emerald-600 mr-2" />
                      Catatan Penting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {pkg.details.catatan.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Paket Card */}
                <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 flex items-center justify-between">
                      <span>{pkg.name}</span>
                      <span className="text-2xl font-bold text-emerald-700">{pkg.price}</span>
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{pkg.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{pkg.description}</p>
                    <ul className="mb-6 space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      asChild
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                    >
                      <Link href={`/services/mcu/register?package=${pkg.id}`}>
                        Daftar Sekarang
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Fitur Paket */}
                <Card className="border-emerald-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 flex items-center">
                      <Package className="h-5 w-5 text-emerald-600 mr-2" />
                      Fitur dalam Paket
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Estimasi Waktu */}
                <Card className="border-emerald-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 flex items-center">
                      <Clock3 className="h-5 w-5 text-emerald-600 mr-2" />
                      Estimasi Waktu MCU
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-center text-xl font-bold text-emerald-700">{pkg.duration}</p>
                      <p className="text-center text-sm text-gray-600 mt-1">Durasi pemeriksaan</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                      Waktu dapat berbeda tergantung antrian dan kondisi medis pasien
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Melakukan Medical Check Up?
            </h3>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Daftarkan diri Anda sekarang dan dapatkan pemeriksaan kesehatan menyeluruh 
              dengan teknologi terkini dan pelayanan terbaik dari tim medis kami.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg"
              >
                <Link href={`/services/mcu/register?package=${pkg.id}`}>
                  <HeartPulse className="h-5 w-5 mr-2" />
                  Daftar MCU Sekarang
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 shadow-lg"
              >
                <Link href="/services/mcu">
                  Kembali ke Halaman Utama
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}