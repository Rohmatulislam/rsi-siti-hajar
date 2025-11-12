import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Schedule } from '@/lib/admin-types';

interface DoctorScheduleSectionProps {
  schedules: Schedule[];
}

export function DoctorScheduleSection({ schedules }: DoctorScheduleSectionProps) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Jadwal Praktek
        </h3>
        {schedules.length > 0 ? (
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-gray-700/50 dark:border-gray-600">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {new Date(schedule.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-slate-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {schedule.start_time} - {schedule.end_time}
                  </div>
                </div>
                <Badge className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  schedule.available 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700' 
                    : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
                }`}>
                  {schedule.available ? 'Tersedia' : 'Penuh'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Jadwal belum tersedia</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}