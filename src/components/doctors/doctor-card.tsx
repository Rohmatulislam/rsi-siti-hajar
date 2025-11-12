'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Doctor } from '@/lib/admin-types';

interface DoctorCardProps {
  doctor: Doctor;
  schedules?: { date: string }[];
  cardStyle?: 'default' | 'glass' | 'gradient' | 'hover' | 'border' | 'neon' | 'cyber' | 'minimal';
  availableDays?: string;
}

export function DoctorCard({ doctor, schedules = [], cardStyle = 'default', availableDays }: DoctorCardProps) {
  const getAvailableDays = () => {
    // Gunakan availableDays dari props jika tersedia, jika tidak gunakan schedules
    if (availableDays) return availableDays;
    if (!schedules.length) return 'Tidak ada jadwal';
    const first = new Date(schedules[0].date);
    const dayName = first.toLocaleDateString('id-ID', { weekday: 'long' });
    const dateFormatted = first.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return `${dayName}, ${dateFormatted}`;
  };

  const getCardClasses = () => {
    const baseClasses = "flex flex-col gap-4 rounded-3xl p-5 transition-all duration-300 min-h-[260px] overflow-hidden";
    
    switch (cardStyle) {
      case 'glass':
        return `${baseClasses} bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 shadow-lg shadow-emerald-500/10`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/20 border border-emerald-100/50 dark:border-emerald-800/50 shadow-lg shadow-emerald-500/10`;
      case 'hover':
        return `${baseClasses} bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform duration-300`;
      case 'border':
        return `${baseClasses} bg-white dark:bg-gray-900 border-2 border-emerald-500 dark:border-emerald-600 shadow-sm`;
      case 'neon':
        return `${baseClasses} bg-gray-900 border border-emerald-400 shadow-lg shadow-emerald-500/50 text-white`;
      case 'cyber':
        return `${baseClasses} bg-gradient-to-r from-gray-900 via-emerald-900/20 to-gray-900 border border-emerald-500 text-white [text-shadow:0_0_2px_#065f46,0_0_5px_#065f46]`;
      case 'minimal':
        return `${baseClasses} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm`;
      case 'default':
      default:
        return `${baseClasses} bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800 rounded-3xl shadow-sm`;
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl transition-all duration-300">
        <Card
          className={getCardClasses()}
        >
          {/* Bagian Atas */}
          <div className="flex items-center gap-4">
            {/* Foto Dokter */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-emerald-200 bg-emerald-50 shadow-md">
                <Image
                  src={
                    doctor.image_url ||
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={doctor.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Info Dokter */}
            <div className="flex flex-col text-left">
              <p className="text-xs text-emerald-600 font-medium mb-1 tracking-wide">
                Online & Kunjungan Rumah Sakit
              </p>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {doctor.name}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {doctor.specialty}
              </p>
            </div>
          </div>

          {/* Garis Pemisah */}
          <hr className="border-emerald-100 dark:border-emerald-800" />

          {/* Lokasi & Jadwal */}
          <div className="text-sm text-slate-700 dark:text-gray-300 space-y-1">
            <p className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-emerald-600" />
              {doctor.hospital || 'RSI Siti Hajar'}
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span>
                <strong>{getAvailableDays().split(',')[0]},</strong>{' '}
                {getAvailableDays().split(',')[1]}
              </span>
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            <Button
              variant="outline"
              className="
                flex-1 border-2 border-emerald-600 text-emerald-700
                hover:bg-emerald-50 dark:hover:bg-emerald-900/30
                rounded-xl text-sm font-medium py-2
                transition-all duration-300
              "
              asChild
            >
              <Link href={`/doctors/${doctor.slug}`}>
                Konsultasi Online
              </Link>
            </Button>
            <Button
              className="
                flex-1 bg-emerald-600 hover:bg-emerald-700
                text-white rounded-xl text-sm font-medium py-2
                shadow-md hover:shadow-emerald-400/30
                transition-all duration-300
              "
              asChild
            >
              <Link href={`/doctors/${doctor.slug}`}>
                Pesan Janji Temu
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
