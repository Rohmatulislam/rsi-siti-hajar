'use client';

import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { Dispatch, SetStateAction } from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  specialtyFilter: string;
  onSpecialtyChange: (value: string) => void;
  dayFilter: string;
  onDayChange: (value: string) => void;
  cardStyle: 'default' | 'glass' | 'gradient' | 'hover' | 'border' | 'neon' | 'cyber' | 'minimal';
  onCardStyleChange: (value: 'default' | 'glass' | 'gradient' | 'hover' | 'border' | 'neon' | 'cyber' | 'minimal') => void;
  specialties: string[];
  days: string[];
  cardStyles: { value: string; label: string; icon: any }[];
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  specialtyFilter,
  onSpecialtyChange,
  dayFilter,
  onDayChange,
  cardStyle,
  onCardStyleChange,
  specialties,
  days,
  cardStyles
}: SearchFilterProps) {
  return (
    <div className="mb-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700 shadow-lg shadow-emerald-100/50 dark:shadow-gray-900/50">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filter Pencarian</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <Input
                placeholder="Cari dokter berdasarkan nama atau spesialisasi..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90 dark:bg-gray-700/90 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
          </div>
          
          <div>
            <Select value={specialtyFilter} onValueChange={onSpecialtyChange}>
              <SelectTrigger className="rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90 dark:bg-gray-700/90 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Spesialisasi" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty} className="dark:text-white dark:focus:bg-gray-700">
                    {specialty === 'all' ? 'Semua Spesialisasi' : specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={dayFilter} onValueChange={onDayChange}>
              <SelectTrigger className="rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90 dark:bg-gray-700/90 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Hari Praktek" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {days.map((day) => (
                  <SelectItem key={day} value={day} className="dark:text-white dark:focus:bg-gray-700">
                    {day === 'all' ? 'Semua Hari' : day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={cardStyle} onValueChange={onCardStyleChange}>
              <SelectTrigger className="rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/90 dark:bg-gray-700/90 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Style Card" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {cardStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="dark:text-white dark:focus:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <style.icon className="h-4 w-4" />
                      {style.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}