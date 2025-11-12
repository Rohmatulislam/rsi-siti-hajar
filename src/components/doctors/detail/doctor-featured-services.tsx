import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HeartPulse, 
  Stethoscope, 
  Activity, 
  Microscope, 
  Scan, 
  Users,
  Star,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { Doctor } from '@/lib/admin-types';

interface DoctorFeaturedServicesProps {
  doctor: Doctor;
}

// Mapping antara spesialisasi dokter dengan layanan yang relevan
const getServicesBySpecialty = (specialty: string) => {
  const serviceMap: Record<string, { id: string; title: string; description: string; icon: any }[]> = {
    'Jiwa': [
      {
        id: 'jiwa-001',
        title: 'Konseling Psikologi',
        description: 'Terapi dan konseling untuk berbagai masalah psikologis dan emosional.',
        icon: HeartPulse
      },
      {
        id: 'jiwa-002',
        title: 'Terapi Kognitif Perilaku',
        description: 'Metode terapi untuk mengatasi gangguan pikiran dan perilaku.',
        icon: Activity
      },
      {
        id: 'jiwa-003',
        title: 'Assesment Psikologi',
        description: 'Evaluasi psikologis untuk mengetahui kondisi mental pasien.',
        icon: Microscope
      },
      {
        id: 'jiwa-004',
        title: 'Terapi Keluarga',
        description: 'Konseling untuk permasalahan hubungan dalam keluarga.',
        icon: Users
      }
    ],
    'Penyakit Dalam': [
      {
        id: 'penyakit-dalam-001',
        title: 'Pemeriksaan Umum',
        description: 'Pemeriksaan menyeluruh untuk mengevaluasi kesehatan tubuh secara umum.',
        icon: Stethoscope
      },
      {
        id: 'penyakit-dalam-002',
        title: 'Konsultasi Penyakit Kronis',
        description: 'Pengelolaan dan pengobatan penyakit kronis seperti diabetes dan hipertensi.',
        icon: HeartPulse
      },
    ],
    'Anak': [
      {
        id: 'anak-001',
        title: 'Imunisasi',
        description: 'Pelayanan imunisasi untuk bayi dan anak-anak.',
        icon: HeartPulse
      },
      {
        id: 'anak-002',
        title: 'Pemeriksaan Tumbuh Kembang',
        description: 'Monitoring pertumbuhan dan perkembangan anak.',
        icon: Activity
      },
    ],
    'Bedah': [
      {
        id: 'bedah-001',
        title: 'Pembedahan Umum',
        description: 'Operasi untuk berbagai kondisi medis yang memerlukan tindakan pembedahan.',
        icon: Stethoscope
      },
      {
        id: 'bedah-002',
        title: 'Bedah Minimal Invasif',
        description: 'Teknik pembedahan dengan sayatan kecil untuk mempercepat pemulihan.',
        icon: Activity
      },
    ],
    'Kandungan': [
      {
        id: 'kandungan-001',
        title: 'Pemeriksaan Kehamilan',
        description: 'Pemeriksaan rutin untuk memantau kesehatan ibu dan janin.',
        icon: Activity
      },
      {
        id: 'kandungan-002',
        title: 'Persalinan',
        description: 'Pelayanan persalinan dengan tim medis terlatih.',
        icon: HeartPulse
      },
    ],
    'Mata': [
      {
        id: 'mata-001',
        title: 'Pemeriksaan Mata',
        description: 'Pemeriksaan kesehatan mata dan pengukuran tekanan intraokular.',
        icon: Scan
      },
      {
        id: 'mata-002',
        title: 'Laser Mata',
        description: 'Prosedur laser untuk mengatasi gangguan refraksi.',
        icon: Scan
      },
    ],
    'THT': [
      {
        id: 'tht-001',
        title: 'Pemeriksaan THT',
        description: 'Pemeriksaan telinga, hidung, dan tenggorokan.',
        icon: Scan
      },
      {
        id: 'tht-002',
        title: 'Operasi THT',
        description: 'Pembedahan untuk berbagai kondisi THT.',
        icon: Stethoscope
      },
    ],
    'default': [
      {
        id: 'umum-001',
        title: 'Konsultasi Spesialis',
        description: 'Konsultasi spesialis untuk berbagai masalah kesehatan.',
        icon: Stethoscope
      },
      {
        id: 'umum-002',
        title: 'Pemeriksaan Lengkap',
        description: 'Pemeriksaan menyeluruh untuk mengevaluasi kesehatan pasien.',
        icon: Microscope
      },
    ]
  };

  return serviceMap[specialty] || serviceMap.default;
};

export function DoctorFeaturedServices({ doctor }: DoctorFeaturedServicesProps) {
  const services = getServicesBySpecialty(doctor.specialty);

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg mr-3">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Layanan Unggulan
          </CardTitle>
        </div>
        <p className="text-slate-600 dark:text-gray-400 mt-2">
          Layanan yang dapat ditangani oleh Dr. {doctor.name}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.id} 
                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-gray-700/50 dark:border-gray-600"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                      {service.title}
                    </h4>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 text-sm dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
                      {doctor.specialty}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-gray-300 mt-1">
                    {service.description && service.description.startsWith('<') ? (
                      <div dangerouslySetInnerHTML={{ __html: service.description }} />
                    ) : (
                      service.description
                    )}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center mr-4">
                      <MapPin className="h-4 w-4 mr-1 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm text-slate-600 dark:text-gray-400">RSI Siti Hajar</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-slate-600 dark:text-gray-400">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}