// Halaman daftar dokter
'use client';

import { useState, useEffect } from 'react';
import { getAllDoctorsWithSchedules } from '@/lib/doctor-service';
import { Doctor, Schedule } from '@/lib/admin-types';
import { DoctorPageHeader } from '@/components/doctors/header';
import { SearchFilter } from '@/components/doctors/search-filter';
import { DoctorList } from '@/components/doctors/doctor-list';
import { CallToAction } from '@/components/doctors/call-to-action';
import { Search, Filter, Sparkles, Zap, Heart, ArrowRight } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [cardStyle, setCardStyle] = useState<'default' | 'glass' | 'gradient' | 'hover' | 'border' | 'neon' | 'cyber' | 'minimal'>('gradient');
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<Record<string, Schedule[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Spesialisasi untuk filter
  const specialties = [
    'all',
    'Jiwa',
    'Penyakit Dalam',
    'Anak',
    'Bedah',
    'Kandungan',
    'Mata',
    'THT',
    'Kulit & Kelamin',
    'Gigi & Mulut',
    'Saraf',
    'Orthopedi',
    'Jantung',
    'Paru-Paru'
  ];

  // Hari-hari untuk filter
  const days = [
    'all',
    'Senin', 
    'Selasa', 
    'Rabu', 
    'Kamis', 
    'Jumat', 
    'Sabtu', 
    'Minggu'
  ];

  const cardStyles = [
    { value: 'gradient', label: 'Gradient', icon: Sparkles },
    { value: 'glass', label: 'Glass', icon: Zap },
    { value: 'hover', label: 'Hover', icon: Heart },
    { value: 'border', label: 'Border', icon: ArrowRight },
    { value: 'neon', label: 'Neon', icon: Sparkles },
    { value: 'cyber', label: 'Cyber', icon: Zap },
    { value: 'minimal', label: 'Minimal', icon: Heart },
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Ambil semua dokter dengan jadwal dalam satu permintaan yang dioptimalkan
        const doctorsData = await getAllDoctorsWithSchedules();
        
        // Pisahkan data dokter dan jadwal
        const doctors = doctorsData.map(doctor => {
          const { schedules, ...doctorInfo } = doctor;
          return doctorInfo;
        });
        
        setDoctors(doctors);
        setFilteredDoctors(doctors);
        
        // Format data jadwal untuk state
        const schedulesData: Record<string, Schedule[]> = {};
        doctorsData.forEach(doctor => {
          schedulesData[doctor.id] = doctor.schedules || [];
        });
        
        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;

    // Filter berdasarkan pencarian
    if (searchTerm) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan spesialisasi
    if (specialtyFilter !== 'all') {
      result = result.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
      );
    }

    // Filter berdasarkan hari
    if (dayFilter !== 'all') {
      result = result.filter(doctor => {
        const doctorSchedules = schedules[doctor.id] || [];
        return doctorSchedules.some(schedule => 
          new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase() === dayFilter.toLowerCase()
        );
      });
    }

    setFilteredDoctors(result);
  }, [searchTerm, specialtyFilter, dayFilter, doctors, schedules]);

  const getAvailableDays = (doctorId: string) => {
    const doctorSchedules = schedules[doctorId] || [];
    const dayNames = doctorSchedules.map(schedule => 
      new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long' })
    );
    return dayNames.slice(0, 2).join(', ');
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <DoctorPageHeader />
        
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          specialtyFilter={specialtyFilter}
          onSpecialtyChange={setSpecialtyFilter}
          dayFilter={dayFilter}
          onDayChange={setDayFilter}
          cardStyle={cardStyle}
          onCardStyleChange={setCardStyle}
          specialties={specialties}
          days={days}
          cardStyles={cardStyles}
        />
        
        <DoctorList
          doctors={doctors}
          filteredDoctors={filteredDoctors}
          schedules={schedules}
          cardStyle={cardStyle}
          loading={loading}
          searchTerm={searchTerm}
          specialtyFilter={specialtyFilter}
          dayFilter={dayFilter}
          onResetFilters={() => {
            setSearchTerm('');
            setSpecialtyFilter('all');
            setDayFilter('all');
          }}
          getAvailableDays={getAvailableDays}
        />
        
        <CallToAction />
      </div>
    </div>
  );
}