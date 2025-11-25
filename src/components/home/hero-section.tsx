'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Stethoscope, Star, Microscope, Scan, Activity, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MotionSection, MotionDiv } from "@/components/motion-wrapper";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HeroSection() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect ke halaman pencarian dengan query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <MotionSection
      className="w-full min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image dengan mask-image linear gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bener/baner.JPG')",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)"
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className={`absolute inset-0 ${isMounted && theme === 'dark' ? 'bg-black/5' : 'bg-black/10'}`}></div>
      </div>

      <div className="relative px-4 md:px-6 flex flex-col justify-center min-h-screen pt-16">
        <div className="max-w-6xl">
          {/* Main Content */}
          <MotionDiv
            className="text-left pl-8 md:pl-12 mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-white/30 mb-8">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-xs font-medium text-black">
                Rumah Sakit Islam Terpercaya di NTB
              </span>
            </div>

            <MotionDiv
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-4 max-w-6xl">
                <span className="block text-black font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                  SELAMAT DATANG DI RUMAH SAKIT ISLAM
                  <br />
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold  tracking-tight text-emerald-800">
                   SITI HAJAR MATARAM
                  </span>
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black max-w-4xl leading-relaxed mb-6">
                Memberikan pelayanan kesehatan terbaik dengan teknologi modern
                dan tenaga medis profesional di Mataram
              </p>
            </MotionDiv>

            {/* Search Bar - Without Button */}
            <form onSubmit={handleSearch}>
            <MotionDiv
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative mb-8"
            >
              <div className="relative flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/80" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari dokter, layanan, atau informasi kesehatan..."
                    className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-2xl text-base focus:bg-white/90 focus:text-gray-900 focus:placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md transition-all duration-300" />
                </div>
              </div>
            </MotionDiv>
            </form>
          </MotionDiv>
        </div>

        {/* Services Grid - Independent Container for Center Alignment */}
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <MotionDiv
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-4xl sm:max-w-5xl mx-auto mt-8 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Cari Dokter */}
            <Link href="/doctors" className="group relative block">
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:border-emerald-400/50 hover:bg-white/30 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group-hover:shadow-emerald-500/30 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black text-base mb-1">Cari Dokter</h3>
                <p className="text-sm text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Dokter Spesialis
                </p>
              </div>
            </Link>

            {/* Layanan Unggulan */}
            <Link href="/services/featured" className="group relative block">
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:border-amber-400/50 hover:bg-white/30 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group-hover:shadow-amber-500/30 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black text-base mb-1">Layanan Unggulan</h3>
                <p className="text-sm text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Fasilitas Terbaik
                </p>
              </div>
            </Link>

            {/* Poli Executive */}
            <Link href="/services/featured/executive" className="group relative block">
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:border-amber-400/50 hover:bg-white/30 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group-hover:shadow-amber-500/30 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black text-base mb-1">Poli Executive</h3>
                <p className="text-sm text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Pelayanan Premium
                </p>
              </div>
            </Link>

            {/* Medical Check Up */}
            <Link href="/services/mcu" className="group relative block">
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:border-blue-400/50 hover:bg-white/30 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group-hover:shadow-blue-500/30 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black text-base mb-1">Medical Check Up</h3>
                <p className="text-sm text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Pemeriksaan Lengkap
                </p>
              </div>
            </Link>

            {/* Lab */}
            <Link href="/services/laboratory" className="group relative block">
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:border-purple-400/50 hover:bg-white/30 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group-hover:shadow-purple-500/30 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Microscope className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black text-base mb-1">Laboratorium</h3>
                <p className="text-sm text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Tes & Analisis
                </p>
              </div>
            </Link>

            {/* Radiologi */}
            <Link href="/services/radiology" className="group relative block">
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:border-red-400/50 hover:bg-white/30 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group-hover:shadow-red-500/30 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Scan className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-black text-base mb-1">Radiologi</h3>
                <p className="text-sm text-red-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Pencitraan Medis
                </p>
              </div>
            </Link>


          </MotionDiv>
        </div>

        {/* Bottom Stats - Independent Container for Center Alignment */}
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <MotionDiv
            className="text-center mt-8 pb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="inline-flex flex-wrap justify-center items-center gap-3 text-white">
              <div className="text-center min-w-[60px]">
                <div className="text-base sm:text-lg font-bold text-white">50+</div>
                <div className="text-sm sm:text-base font-medium text-white">Dokter Spesialis</div>
              </div>
              <div className="w-1 h-3 bg-emerald-400/30 rounded-full hidden sm:block"></div>
              <div className="text-center min-w-[60px]">
                <div className="text-base sm:text-lg font-bold text-white">24/7</div>
                <div className="text-sm sm:text-base font-medium text-white">Layanan IGD</div>
              </div>
              <div className="w-1 h-3 bg-emerald-400/30 rounded-full hidden sm:block"></div>
              <div className="text-center min-w-[60px]">
                <div className="text-base sm:text-lg font-bold text-white">99%</div>
                <div className="text-sm sm:text-base font-medium text-white">Kepuasan Pasien</div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}