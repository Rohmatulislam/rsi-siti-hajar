'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, RotateCcw } from 'lucide-react';
import { Schedule } from '@/lib/admin-types';

interface RealTimeSchedulesProps {
  doctorId: string;
}

export function RealTimeSchedules({ doctorId }: RealTimeSchedulesProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Ambil jadwal dari SIMRS Khanza
      const response = await fetch(`/api/schedules/khanza?date=${new Date().toISOString().split('T')[0]}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil jadwal dari SIMRS Khanza');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSchedules(result.schedules || []);
        setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      } else {
        throw new Error(result.error || 'Gagal mengambil jadwal');
      }
    } catch (err) {
      console.error('Error fetching real-time schedules:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil jadwal');
      // Jika gagal, bisa ditampilkan jadwal default atau kosong
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    
    // Refresh setiap 5 menit
    const interval = setInterval(fetchSchedules, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [doctorId]);

  const refreshSchedules = () => {
    fetchSchedules();
  };

  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Jadwal Praktek (Real-time)
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshSchedules}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Memuat...' : 'Refresh'}
          </Button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
            <p>{error}</p>
            <p className="text-sm mt-1">Menggunakan data lokal sebagai fallback</p>
          </div>
        )}
        
        <div className="text-sm text-slate-500 dark:text-gray-400 mb-4">
          Terakhir diperbarui: {lastUpdated || 'Belum diperbarui'}
        </div>
        
        {schedules.length > 0 ? (
          <div className="grid gap-4">
            {schedules.map((schedule, index) => (
              <div 
                key={`${schedule.id || index}`} 
                className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-gray-700/50 dark:border-gray-600"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {schedule.date ? 
                      new Date(schedule.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Tanggal tidak diketahui'}
                  </div>
                  <div className="text-slate-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {schedule.start_time || 'TBD'} - {schedule.end_time || 'TBD'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Kapasitas: {schedule.current_patients || 0}/{schedule.max_patients || 'N/A'} pasien
                  </div>
                </div>
                <Badge className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  (schedule.max_patients && schedule.current_patients && schedule.current_patients < schedule.max_patients) 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700' 
                    : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
                }`}>
                  {schedule.max_patients && schedule.current_patients && schedule.current_patients < schedule.max_patients 
                    ? 'Tersedia' 
                    : 'Penuh'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {loading 
                ? 'Mengambil jadwal dari SIMRS Khanza...' 
                : 'Jadwal tidak tersedia atau terjadi kesalahan'}
            </p>
            <p className="text-sm mt-2">
              {loading ? 'Mohon tunggu...' : 'Silakan refresh untuk mencoba lagi'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}