"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText,
  HeartPulse,
  Baby,
  Syringe,
  Eye,
  Ear,
  Bone,
  Brain,
  Heart,
  Stethoscope,
  Dna,
  Droplets,
  SyringeIcon,
  Activity,
  UserRound,
  Shield,
  Users,
  Microscope,
  Pill,
  Monitor,
  BookOpen,
  GraduationCap,
  Gavel,
  Building,
  Scissors,
  MicroscopeIcon,
  StethoscopeIcon,
  HeartHandshake,
  FlaskConical,
  Utensils,
  FileAudio,
  Waves,
  HandCoins,
  Home,
  BookText,
  BookCheck,
  ShieldCheck,
  BookOpenText,
  Scale,
  FileSpreadsheet,
  UsersRound,
  UserRoundCheck,
  UserRoundCog,
  UserRoundSearch,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Data spesialisasi dengan ikon dan deskripsi
const specialistCategories = [
  {
    name: "Klinik Umum",
    icon: Stethoscope,
    color: "emerald",
    services: [
      { name: "Klinik Penyakit Dalam", description: "Pemeriksaan dan pengobatan penyakit dalam", href: "/doctors?specialty=penyakit-dalam", icon: HeartPulse },
      { name: "Klinik Anak", description: "Perawatan kesehatan anak-anak", href: "/doctors?specialty=anak", icon: Baby },
      { name: "Klinik Kebidanan & Kandungan", description: "Perawatan kesehatan reproduksi wanita", href: "/doctors?specialty=kebidanan-kandungan", icon: HeartHandshake },
      { name: "Klinik Bedah Umum", description: "Tindakan pembedahan dan perawatan pasca operasi", href: "/doctors?specialty=bedah-umum", icon: Scissors },
    ]
  },
  {
    name: "Klinik Spesialis",
    icon: UserRoundCog,
    color: "blue",
    services: [
      { name: "Klinik Jantung dan Pembuluh Darah", description: "Perawatan gangguan jantung dan pembuluh darah", href: "/doctors?specialty=jantung-pembuluh-darah", icon: Heart },
      { name: "Klinik Saraf", description: "Perawatan gangguan sistem saraf", href: "/doctors?specialty=saraf", icon: Brain },
      { name: "Klinik Mata", description: "Perawatan gangguan penglihatan", href: "/doctors?specialty=mata", icon: Eye },
      { name: "Klinik THT", description: "Perawatan telinga, hidung, dan tenggorokan", href: "/doctors?specialty=tht", icon: Ear },
      { name: "Klinik Kulit & Kelamin", description: "Perawatan gangguan kulit dan kelamin", href: "/doctors?specialty=kulit-kelamin", icon: SyringeIcon },
      { name: "Klinik Paru", description: "Perawatan gangguan sistem pernapasan", href: "/doctors?specialty=paru", icon: Activity },
    ]
  },
  {
    name: "Klinik Bedah",
    icon: Scissors,
    color: "red",
    services: [
      { name: "Klinik Bedah Onkologi", description: "Perawatan kanker dan tumor", href: "/doctors?specialty=bedah-onkologi", icon: Shield },
      { name: "Klinik Bedah Digestif", description: "Perawatan saluran pencernaan", href: "/doctors?specialty=bedah-digestif", icon: Syringe },
      { name: "Klinik Bedah Anak", description: "Tindakan bedah untuk anak-anak", href: "/doctors?specialty=bedah-anak", icon: Baby },
      { name: "Klinik Bedah Mulut", description: "Tindakan bedah pada area mulut", href: "/doctors?specialty=bedah-mulut", icon: SyringeIcon },
      { name: "Klinik Urologi", description: "Perawatan sistem kemih dan alat reproduksi", href: "/doctors?specialty=urologi", icon: Droplets },
    ]
  },
  {
    name: "Klinik Gigi",
    icon: SyringeIcon,
    color: "green",
    services: [
      { name: "Klinik Konservasi Gigi", description: "Perawatan gigi dan mulut", href: "/doctors?specialty=konservasi-gigi", icon: Syringe },
      { name: "Klinik Ortodonti", description: "Perawatan kawat gigi dan estetika", href: "/doctors?specialty=ortodonti", icon: SyringeIcon },
    ]
  },
  {
    name: "Klinik Ortopedi",
    icon: Bone,
    color: "amber",
    services: [
      { name: "Klinik Ortopedi", description: "Perawatan gangguan tulang dan sendi", href: "/doctors?specialty=ortopedi", icon: Bone },
      { name: "Klinik Fisioterapi", description: "Terapi untuk memulihkan fungsi gerak", href: "/doctors?specialty=fisioterapi", icon: Waves },
    ]
  },
  {
    name: "Klinik Mental",
    icon: Brain,
    color: "purple",
    services: [
      { name: "Klinik Psikiatri", description: "Perawatan gangguan mental dan emosional", href: "/doctors?specialty=psikiatri", icon: Brain },
      { name: "Klinik Psikolog", description: "Konseling dan terapi psikologis", href: "/doctors?specialty=psikolog", icon: BookOpenText },
    ]
  },
  {
    name: "Klinik Terapi",
    icon: Waves,
    color: "teal",
    services: [
      { name: "Terapi Wicara", description: "Terapi untuk gangguan komunikasi dan menelan", href: "/doctors?specialty=terapi-wicara", icon: FileAudio },
      { name: "Okupasi Terapi", description: "Terapi untuk meningkatkan kemandirian dalam aktivitas", href: "/doctors?specialty=okupasi-terapi", icon: HandCoins },
      { name: "Klinik Rehabilitasi Medik", description: "Pemulihan fungsi tubuh setelah cedera atau sakit", href: "/doctors?specialty=rehabilitasi-medik", icon: Waves },
    ]
  },
  {
    name: "Klinik Lainnya",
    icon: UserRoundCheck,
    color: "indigo",
    services: [
      { name: "Klinik Kesehatan Ibu dan Anak", description: "Perawatan kesehatan ibu dan anak", href: "/doctors?specialty=kesehatan-ibu-anak", icon: UsersRound },
      { name: "Klinik Gizi", description: "Konsultasi gizi dan diet terapi", href: "/doctors?specialty=gizi", icon: Utensils },
      { name: "Klinik Laboratorium", description: "Pemeriksaan laboratorium klinis", href: "/doctors?specialty=laboratorium", icon: FlaskConical },
      { name: "Klinik Radiologi", description: "Pemeriksaan penunjang dengan sinar-X dan lainnya", href: "/doctors?specialty=radiologi", icon: Monitor },
    ]
  }
];

export default function OutpatientServicePage() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>(Array.from({length: specialistCategories.length}, (_, i) => i));
  
  const toggleCategory = (index: number) => {
    if (expandedCategories.includes(index)) {
      setExpandedCategories(expandedCategories.filter(i => i !== index));
    } else {
      setExpandedCategories([...expandedCategories, index]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-50/20 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          {/* Service Header */}
          <div className="relative h-72 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90" />
            <div className="absolute inset-0 bg-[url('/placeholder-outpatient.jpg')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 dark:from-emerald-700/80 dark:to-teal-800/80 flex items-end p-8">
              <div className="flex items-start">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mr-6 shadow-lg">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-3">Rawat Jalan</h1>
                  <p className="text-xl opacity-90 text-white max-w-2xl">
                    Layanan pemeriksaan dan pengobatan untuk pasien yang tidak perlu dirawat inap dengan berbagai pilihan spesialisasi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column - Service Info */}
              <div className="lg:col-span-3 space-y-8">
                {/* Form Pencarian Spesialisasi */}
                <Card className="bg-card text-foreground border-border shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Search className="h-6 w-6 mr-3 text-emerald-600" />
                      Cari Spesialisasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="specialty-search" className="text-sm font-medium text-foreground mb-1 block">Nama Spesialisasi</label>
                        <Input
                          id="specialty-search"
                          type="text"
                          placeholder="Cari spesialisasi..."
                          className="bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground py-3 transition-all duration-200 border-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] border-input dark:border-gray-700 focus:shadow-none focus:transform focus:translate-x-[2px] focus:translate-y-[2px] focus:border-emerald-500"
                        />
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]">
                        Cari Spesialisasi
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-emerald-600" />
                      Tentang Layanan Rawat Jalan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      RS Islam Siti Hajar Mataram menyediakan layanan Rawat Jalan yang bertujuan memberikan 
                      kemudahan bagi masyarakat dalam mendapatkan konsultasi, pemeriksaan, dan pengobatan 
                      secara komprehensif tanpa harus dirawat inap. Layanan ini dilengkapi dengan berbagai 
                      poliklinik spesialis dan subspesialis, serta ditunjang oleh tenaga medis profesional 
                      dan fasilitas modern.
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <p className="text-muted-foreground">
                        Setiap pasien akan mendapatkan pelayanan yang terpadu, ramah, dan berorientasi 
                        pada kebutuhan individu, sesuai dengan visi rumah sakit untuk menghadirkan 
                        pelayanan kesehatan yang Islami, bermutu, dan berkeadilan. Proses registrasi 
                        dan pelayanan dilakukan secara efisien dengan sistem informasi yang terintegrasi, 
                        sehingga waktu tunggu pasien dapat diminimalkan.
                      </p>
                      
                      <p className="text-muted-foreground">
                        Selain pemeriksaan medis, pasien juga dapat langsung mengakses layanan penunjang 
                        seperti laboratorium, radiologi, farmasi, dan fisioterapi, yang semuanya terhubung 
                        untuk mempercepat proses diagnosis dan pengobatan.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <HeartPulse className="h-6 w-6 mr-3 text-emerald-600" />
                      Kategori Spesialisasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {specialistCategories.map((category, index) => (
                        <div key={index} className="space-y-4">
                          <div 
                            className={`flex items-center p-4 rounded-lg bg-${category.color}-50/50 dark:bg-${category.color}-900/20 border border-${category.color}-200/50 cursor-pointer transition-colors hover:bg-${category.color}-100/50 dark:hover:bg-${category.color}-800/30`}
                            onClick={() => toggleCategory(index)}
                          >
                            <div className={`p-3 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-800/50 mr-4`}>
                              <category.icon className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground flex-1">{category.name}</h3>
                            {expandedCategories.includes(index) ? 
                              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            }
                          </div>
                          
                          {expandedCategories.includes(index) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                              {category.services.map((service, serviceIndex) => (
                                <Link 
                                  key={serviceIndex} 
                                  href={service.href}
                                  className="block p-4 border rounded-lg bg-muted dark:bg-card hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200 group
                                            shadow-[3px_3px_6px_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_10px_rgba(0,0,0,0.15)] 
                                            active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
                                >
                                  <div className="flex items-start">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                                      <service.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                        {service.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {service.description}
                                      </p>
                                      <div className="mt-2 flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                                        Lihat Dokter
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <BookText className="h-6 w-6 mr-3 text-emerald-600" />
                      Prosedur Pendaftaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Kunjungi Bagian Pendaftaran</h4>
                            <p className="text-sm text-muted-foreground">Datang ke bagian pendaftaran rawat jalan</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Bawa Dokumen</h4>
                            <p className="text-sm text-muted-foreground">Kartu identitas dan kartu BPJS (jika menggunakan)</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Isi Formulir</h4>
                            <p className="text-sm text-muted-foreground">Isi formulir pendaftaran dengan data yang benar</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">4</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Pembayaran</h4>
                            <p className="text-sm text-muted-foreground">Lakukan pembayaran administrasi</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">5</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Tunggu Panggilan</h4>
                            <p className="text-sm text-muted-foreground">Tunggu panggilan sesuai nomor antrian</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">6</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Dilayani</h4>
                            <p className="text-sm text-muted-foreground">Dilayani oleh dokter di poli yang dituju</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Star className="h-6 w-6 mr-3 text-emerald-600" />
                      Ulasan Pasien
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-3 font-semibold text-foreground text-xl">4.7 dari 5</span>
                      <span className="ml-2 text-muted-foreground text-lg">(320 ulasan)</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-border bg-gradient-to-br from-emerald-50/30 to-cyan-50/30 dark:from-emerald-900/10 dark:to-cyan-900/10">
                        <CardContent className="p-5">
                          <div className="flex items-center mb-4">
                            <div className="bg-muted border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center" />
                            <div className="ml-3">
                              <p className="font-semibold text-foreground">Budi Santoso</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground italic">
                            &quot;Antrian terkendali dengan baik, dokternya ramah dan sabar menjelaskan kondisi kesehatan saya. Pelayanan yang sangat memuaskan!&quot;
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-border bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10">
                        <CardContent className="p-5">
                          <div className="flex items-center mb-4">
                            <div className="bg-muted border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center" />
                            <div className="ml-3">
                              <p className="font-semibold text-foreground">Siti Aminah</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground italic">
                            &quot;Layanan sangat memuaskan, petugasnya cepat dan ramah. Tidak perlu menunggu terlalu lama. Terima kasih RSI Siti Hajar!&quot;
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking & Info */}
              <div>
                <div className="space-y-6 sticky top-6">
                  <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-700 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                        Info Layanan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                          <Clock className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-foreground">Jam Operasional</p>
                            <p className="text-sm text-muted-foreground">07:00 - 16:00 WITA (Senin - Sabtu)</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                          <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-foreground">Lokasi</p>
                            <p className="text-sm text-muted-foreground">Lantai 1, RSI Siti Hajar Mataram</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                          <Phone className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-foreground">Kontak</p>
                            <p className="text-sm text-muted-foreground">(0370) 623xxx</p>
                          </div>
                        </div>
                        
                        <Button 
                          asChild 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                        >
                          <Link href="/appointment">
                            <Calendar className="h-4 w-4 mr-2" />
                            Buat Janji
                          </Link>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          asChild 
                          className="w-full text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-2 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                        >
                          <Link href="/doctors">Cari Dokter</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card text-foreground border-border shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-emerald-600" />
                        Keunggulan Kami
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          </div>
                          <span className="text-muted-foreground">Pelayanan cepat dan efisien</span>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          </div>
                          <span className="text-muted-foreground">Dokter spesialis berpengalaman</span>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          </div>
                          <span className="text-muted-foreground">Fasilitas modern dan lengkap</span>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          </div>
                          <span className="text-muted-foreground">Pelayanan Islami yang ramah</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}