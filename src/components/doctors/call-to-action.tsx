'use client';

import { MotionDiv } from '@/components/motion-wrapper';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  title?: string;
  subtitle?: string;
  emergencyNumber?: string;
}

export function CallToAction({ 
  title = 'Butuh Bantuan Cepat?', 
  subtitle = 'Layanan IGD RSI Siti Hajar siap melayani Anda 24/7 dengan tenaga medis profesional dan fasilitas terbaik.',
  emergencyNumber = '(0370) 123456'
}: CallToActionProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16 text-center"
    >
      <div className="bg-gradient-to-br from-slate-800 to-emerald-900 rounded-2xl p-8 text-white shadow-xl shadow-emerald-900/20">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg dark:bg-gray-200 dark:text-emerald-800 dark:hover:bg-emerald-100">
            Hubungi IGD: {emergencyNumber}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-700 dark:border-gray-300 dark:text-white dark:hover:bg-gray-200 dark:hover:text-emerald-800">
            Lihat Lokasi
          </Button>
        </div>
      </div>
    </MotionDiv>
  );
}