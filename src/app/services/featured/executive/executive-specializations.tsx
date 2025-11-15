'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  ChevronRight
} from 'lucide-react';

interface Specialization {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function ExecutiveSpecializations() {
  const specializations: Specialization[] = [
    { id: 'anak', name: 'Anak', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'penyakit-dalam', name: 'Penyakit Dalam', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'ortopedi', name: 'Ortopedi', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'bedah-anak', name: 'Bedah Anak', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'bedah-umum', name: 'Bedah Umum', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'bedah-digestif', name: 'Bedah Digestif', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'bedah-onkologi', name: 'Bedah Onkologi', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'bedah-urologi', name: 'Bedah Urologi', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'saraf', name: 'Saraf', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'kulit-kelamin', name: 'Kulit & Kelamin', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'rehab-medis', name: 'Rehabilitasi Medik', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'psikiatri', name: 'Psikiatri', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
    { id: 'paru', name: 'Paru', icon: <HeartPulse className="h-6 w-6 text-emerald-600" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {specializations.map((specialization, index) => (
        <motion.div
          key={specialization.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="h-full"
        >
          <Link href={`/services/featured/executive/specializations/${specialization.id}`}>
            <Card className="h-full border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {specialization.name}
                </CardTitle>
                <div className="text-emerald-600">
                  {specialization.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Pilih dokter dan daftar</p>
                  <ChevronRight className="h-5 w-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}