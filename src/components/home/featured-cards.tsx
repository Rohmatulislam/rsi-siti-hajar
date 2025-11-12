'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HeartPulse, 
  Building2, 
  Users, 
  CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { MotionSection, MotionCard } from "@/components/motion-wrapper";

export function AboutUs() {
  const tentangItems = [
    {
      title: "Visi Kami",
      description: "Menjadi rumah sakit islam terkemuka yang memberikan pelayanan kesehatan terbaik dengan pendekatan holistik berbasis teknologi dan nilai-nilai islami.",
      icon: HeartPulse,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      iconColor: "text-white"
    },
    {
      title: "Misi Kami",
      description: "Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.",
      icon: Building2,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      iconColor: "text-white"
    },
    {
      title: "Nilai Utama",
      description: "Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.",
      icon: Users,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconColor: "text-white"
    },
    {
      title: "Komitmen Kami",
      description: "Menyediakan fasilitas kesehatan modern, tenaga medis terlatih, dan layanan yang mudah diakses oleh masyarakat di seluruh NTB.",
      icon: CalendarCheck,
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      iconColor: "text-white"
    }
  ];

  return (
    <MotionSection 
      className="py-16 bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container px-4 md:px-6 mt-12 relative z-10">
        <MotionCard
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">Tentang RSI Siti Hajar</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto text-lg">Rumah Sakit Islam Siti Hajar Mataram, rumah sakit modern dengan pendekatan islami yang memberikan pelayanan kesehatan terbaik di Nusa Tenggara Barat</p>
        </MotionCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tentangItems.map((item, index) => (
            <MotionCard 
              key={index} 
              className="overflow-hidden transition-all hover:shadow-xl dark:hover:shadow-emerald-500/20 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
            >
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className={`p-4 rounded-xl ${item.color} mr-6`}>
                    <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}