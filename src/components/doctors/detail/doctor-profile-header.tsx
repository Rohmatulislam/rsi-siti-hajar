'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  User, 
  Clock4, 
  Stethoscope, 
  Share2,
  Shield,
  ArrowLeft,
  Users
} from 'lucide-react';
import { Doctor } from '@/lib/admin-types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface DoctorProfileHeaderProps {
  doctor: Doctor;
}

export function DoctorProfileHeader({ doctor }: DoctorProfileHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `RSI Siti Hajar - ${doctor.name}`,
        text: `Temukan dokter spesialis ${doctor.specialty} ${doctor.name} di RSI Siti Hajar Mataram`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "URL disalin",
        description: "Link profil dokter telah disalin ke clipboard",
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="rounded-3xl overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20">
        {/* Breadcrumb di paling atas */}
        <div className="px-8 pt-8">
          <nav className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <a href="/" className="cursor-pointer">
              Beranda
            </a>
            <span className="mx-2">{'>'}</span>
            <a href="/doctors" className="cursor-pointer">
              Cari Dokter
            </a>
            <span className="mx-2">{'>'}</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{doctor.name}</span>
          </nav>
        </div>
        
        <div className="p-8 pt-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Doctor Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-emerald-200 shadow-2xl transform-none scale-100">
                <AvatarImage src={doctor.image_url || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2 shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            
            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{doctor.name}</h1>
                  <div className="flex items-center mb-3">
                    <Stethoscope className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">{doctor.specialty}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200 transition-none transform-none scale-100"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>
              
              {/* Ratings and Stats */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-6">
                  <Star className="h-5 w-5 mr-1 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900 dark:text-white font-semibold">4.8</span>
                  <span className="text-slate-600 dark:text-gray-300 ml-1">(120 ulasan)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-slate-600 dark:text-gray-300">1.200+ pasien</span>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center text-slate-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  <span>RSI Siti Hajar Mataram</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-gray-300">
                  <User className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  <span>{doctor.experience_years} tahun pengalaman</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-gray-300">
                  <Clock4 className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  <span>Response cepat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}