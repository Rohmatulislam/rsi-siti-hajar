'use client';

import { MotionDiv } from '@/components/motion-wrapper';

interface DoctorPageHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DoctorPageHeader({ 
  title = 'Cari Dokter', 
  subtitle = 'Temukan dokter spesialis terbaik di RSI Siti Hajar Mataram untuk kebutuhan kesehatan Anda' 
}: DoctorPageHeaderProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full bg-gray-50 dark:bg-slate-900 overflow-hidden rounded-3xl mb-10"
    >
      {/* Breadcrumb di posisi lebih atas */}
      <div className="absolute top-16 left-0 z-20 px-4 md:px-6 pt-4">
        <nav className="flex items-center text-sm text-slate-600 dark:text-slate-400">
          <a href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 cursor-pointer">
            Beranda
          </a>
          <span className="mx-2">{'>'}</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Cari Dokter</span>
        </nav>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-6 min-h-[250px] pt-20 md:pt-20">
        
        {/* Kiri: title dan subtitle */}
        <div className="flex-1 text-left z-10 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Kanan: gambar dokter */}
        <div className="hidden md:block w-1/2 relative" style={{ minHeight: '250px' }}>
          {/* ✅ Gradient kiri lebih lebar agar sudut gambar benar-benar tertutup */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-gray-50 dark:from-slate-900 via-gray-50/90 dark:via-slate-900/90 to-transparent z-10"></div>

          <img
            src="/images/bener/baner-doctors.jpg"
            alt="Dokter RSI Siti Hajar"
            className="w-full h-full object-cover absolute top-0 right-0 z-0"
            style={{ objectPosition: 'center right', minHeight: '250px' }}
            loading="lazy"
          />
        </div>
      </div>

      {/* Overlay lembut di tengah */}
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-slate-900/40 z-0 pointer-events-none"></div>

      {/* Overlay halus di kanan */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/70 dark:from-slate-900/60 to-transparent pointer-events-none" />
    </MotionDiv>
  );
}
