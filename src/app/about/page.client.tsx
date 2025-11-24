'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HeartPulse,
  Building2,
  Users,
  CalendarCheck,
  Award,
  Shield,
  User,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AboutContent, Founder } from '@/lib/admin-types';

interface AboutPageClientProps {
  content: AboutContent;
  founders: Founder[];
}

export default function AboutPageClient({ content, founders }: AboutPageClientProps) {
  const tentangItems = [
    {
      title: "Visi Kami",
      description: content.vision || "Menjadi rumah sakit islam terkemuka yang memberikan pelayanan kesehatan terbaik dengan pendekatan holistik berbasis teknologi dan nilai-nilai islami.",
      icon: HeartPulse,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Misi Kami",
      description: content.mission || "Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.",
      icon: Building2,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Nilai Utama",
      description: content.values || "Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.",
      icon: Users,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Komitmen Kami",
      description: content.commitment || "Menyediakan fasilitas kesehatan modern, tenaga medis terlatih, dan layanan yang mudah diakses oleh masyarakat di seluruh NTB.",
      icon: CalendarCheck,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const achievements = [
    { number: "15+", label: "Tahun Pengalaman" },
    { number: "25.000+", label: "Pasien Terlayani" },
    { number: "150+", label: "Dokter Profesional" },
    { number: "300+", label: "Tenaga Medis" }
  ];

  const ourTeam = [
    { name: "Dr. Ahmad Fauzi", role: "Direktur Medis", experience: "20 tahun pengalaman" },
    { name: "dr. Siti Nurjanah", role: "Kepala Instalasi", experience: "18 tahun pengalaman" },
    { name: "Nurul Huda", role: "Kepala Perawat", experience: "15 tahun pengalaman" },
    { name: "Budi Santoso", role: "Manajer Administrasi", experience: "12 tahun pengalaman" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        {/* Hero Section - Meningkatkan tinggi section tanpa background gradient */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 py-40 md:py-48 lg:py-56">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          {content.hero_image ? (
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${content.hero_image})` }}></div>
          ) : (
            <div className="absolute inset-0 bg-[url('/images/bener/baner.JPG')] bg-cover bg-center opacity-30"></div>
          )}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                {content.hero_title || 'Tentang RSI Siti Hajar'}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {content.hero_description || 'Rumah Sakit Islam Siti Hajar Mataram, rumah sakit modern dengan pendekatan islami yang memberikan pelayanan kesehatan terbaik di Nusa Tenggara Barat'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20">
          {/* Sejarah Singkat */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Sejarah Singkat
              </h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-6"></div>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg h-full">
                    <CardContent className="p-8">
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                        {content.history || 'RSI Siti Hajar Mataram didirikan pada tahun 2009 sebagai rumah sakit swasta yang mengintegrasikan nilai-nilai keislaman dalam pelayanan kesehatan. Sejak awal berdiri, kami berkomitmen untuk memberikan pelayanan kesehatan yang berkualitas dengan sentuhan spiritual dan profesionalisme tinggi.'}
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                        Dengan fasilitas modern dan tenaga medis yang terlatih, kami terus berkembang menjadi salah satu rumah sakit terpercaya di Nusa Tenggara Barat. Kami juga memiliki layanan unggulan seperti ESWL (Extracorporeal Shockwave Lithotripsy), bedah minimal invasif, dan layanan persalinan syari yang tetap mempertahankan nilai-nilai keislaman.
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        Saat ini, RSI Siti Hajar telah melayani puluhan ribu pasien dari berbagai wilayah di NTB dan sekitarnya, dengan komitmen untuk terus meningkatkan kualitas pelayanan dan tetap menjaga integritas serta profesionalisme dalam memberikan pelayanan kesehatan.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Struktur Organisasi Pendiri Rumah Sakit */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {founders.filter(f => f.role.toLowerCase().includes('pendiri') || f.role.toLowerCase().includes('founder')).map((founder, index) => (
                      <motion.div 
                        key={founder.id}
                        className="flex flex-col items-center text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="relative">
                          <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                            {founder.photo_url ? (
                              <img 
                                src={founder.photo_url} 
                                alt={founder.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">
                                <User className="h-12 w-12" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {founder.name}
                          </h4>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            {founder.role}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xs">
                            {founder.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {founders.filter(f => f.role.toLowerCase().includes('pembina') || f.role.toLowerCase().includes('dewan')).length > 0 && (
                    <div className="mt-8">
                      <div className="text-center mb-6">
                        <div className="w-24 h-0.5 bg-emerald-300 mx-auto mb-2"></div>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Dewan Pembina</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {founders.filter(f => f.role.toLowerCase().includes('pembina') || f.role.toLowerCase().includes('dewan')).map((founder, index) => (
                          <motion.div 
                            key={founder.id}
                            className="flex flex-col items-center text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          >
                            <div className="relative">
                              <div className="w-28 h-36 rounded-lg overflow-hidden border-2 border-amber-200 dark:border-amber-800 shadow-lg">
                                {founder.photo_url ? (
                                  <img 
                                    src={founder.photo_url} 
                                    alt={founder.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">
                                    <User className="h-10 w-10" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                {founder.name}
                              </h4>
                              <p className="text-amber-600 dark:text-amber-400 font-semibold mt-1 text-sm">
                                {founder.role}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xs text-sm">
                                {founder.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tampilkan founder lainnya jika ada */}
                  {founders.filter(f => !f.role.toLowerCase().includes('pendiri') && !f.role.toLowerCase().includes('founder') && !f.role.toLowerCase().includes('pembina') && !f.role.toLowerCase().includes('dewan')).length > 0 && (
                    <div className="mt-8">
                      <div className="text-center mb-6">
                        <div className="w-24 h-0.5 bg-emerald-300 mx-auto mb-2"></div>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Pengelola</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {founders.filter(f => !f.role.toLowerCase().includes('pendiri') && !f.role.toLowerCase().includes('founder') && !f.role.toLowerCase().includes('pembina') && !f.role.toLowerCase().includes('dewan')).map((founder, index) => (
                          <motion.div 
                            key={founder.id}
                            className="flex flex-col items-center text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          >
                            <div className="relative">
                              <div className="w-28 h-36 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                                {founder.photo_url ? (
                                  <img 
                                    src={founder.photo_url} 
                                    alt={founder.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">
                                    <User className="h-10 w-10" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                {founder.name}
                              </h4>
                              <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1 text-sm">
                                {founder.role}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xs text-sm">
                                {founder.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Visi, Misi, dll */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Filosofi Kami
              </h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {tentangItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="overflow-hidden transition-all hover:shadow-xl dark:hover:shadow-emerald-500/20 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color} mb-4`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Prestasi */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Capaian Kami
              </h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Beberapa pencapaian yang telah kami raih sejak berdiri hingga saat ini
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="text-center py-6 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                >
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tim Kami */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tim Profesional Kami
              </h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Kami memiliki tim medis dan non-medis yang sangat profesional dan berpengalaman
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {ourTeam.map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-1">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{member.experience}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-0">
              <CardContent className="p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Bergabunglah Dengan Kami
                </h3>
                <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                  Kami selalu membuka peluang kerja untuk tenaga medis dan non-medis yang profesional dan berkomitmen
                </p>
                <Link href="/contact">
                  <Button className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-full">
                    Hubungi Kami
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
      <Footer />
    </div>
  );
}