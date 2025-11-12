'use client';

import { DoctorCard } from '@/components/doctors/doctor-card';
import { Doctor, Schedule } from '@/lib/admin-types';

interface DoctorListProps {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  schedules: Record<string, Schedule[]>;
  cardStyle?: 'default' | 'glass' | 'gradient' | 'hover' | 'border' | 'neon' | 'cyber' | 'minimal';
  loading?: boolean;
  title?: string;
  searchTerm?: string;
  specialtyFilter?: string;
  dayFilter?: string;
  onResetFilters?: () => void;
  getAvailableDays: (doctorId: string) => string;
}

export function DoctorList({
  doctors,
  filteredDoctors,
  schedules,
  cardStyle = 'default',
  loading = false,
  title = 'Terakhir Dilihat',
  searchTerm = '',
  specialtyFilter = 'all',
  dayFilter = 'all',
  onResetFilters,
  getAvailableDays,
}: DoctorListProps) {
  // 🔸 Loading state
  if (loading) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full flex items-start gap-4 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900 bg-white/70 dark:bg-gray-900/70 animate-pulse"
            >
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔸 Jika tidak ada dokter ditemukan
  if (!filteredDoctors.length) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          Tidak ada dokter ditemukan.
        </p>
      </div>
    );
  }

  // 🔸 Tampilan utama
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base">
          Pilih dokter berdasarkan spesialisasi dan jadwal mereka.
        </p>
        {(searchTerm !== '' || specialtyFilter !== 'all' || dayFilter !== 'all') && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 items-center">
            <span className="text-sm text-slate-600 dark:text-gray-400">Filter aktif:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs">
                "{searchTerm}"
              </span>
            )}
            {specialtyFilter !== 'all' && (
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs">
                {specialtyFilter}
              </span>
            )}
            {dayFilter !== 'all' && (
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs">
                {dayFilter}
              </span>
            )}
            <button 
              onClick={onResetFilters}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        )}
        <div className="mt-3 h-1 w-24 bg-emerald-500 mx-auto rounded-full" />
      </div>

      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="transition-all">
            <DoctorCard
              doctor={doctor}
              schedules={schedules[doctor.id] || []}
              cardStyle={cardStyle}
              availableDays={getAvailableDays(doctor.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
