'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  Stethoscope,
  User,
  FileText,
  ChevronRight
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  sip: string;
  schedule: string[];
  photo?: string;
}

export default function ExecutiveSpecializationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specializationName, setSpecializationName] = useState('');

  useEffect(() => {
    if (typeof id === 'string') {
      fetchDoctorsBySpecialization(id);
    }
  }, [id]);

  const fetchDoctorsBySpecialization = async (specId: string) => {
    setLoading(true);
    try {
      // Ambil nama spesialisasi berdasarkan ID
      const specNames: Record<string, string> = {
        'anak': 'Anak',
        'penyakit-dalam': 'Penyakit Dalam',
        'ortopedi': 'Ortopedi',
        'bedah-anak': 'Bedah Anak',
        'bedah-umum': 'Bedah Umum',
        'bedah-digestif': 'Bedah Digestif',
        'bedah-onkologi': 'Bedah Onkologi',
        'bedah-urologi': 'Bedah Urologi',
        'saraf': 'Saraf',
        'kulit-kelamin': 'Kulit & Kelamin',
        'rehab-medis': 'Rehabilitasi Medik',
        'psikiatri': 'Psikiatri',
        'paru': 'Paru',
      };

      setSpecializationName(specNames[specId] || 'Spesialisasi Tidak Dikenal');

      // Simulasi pengambilan data dokter dari API
      // Dalam implementasi asli, ini akan diambil dari SIMRS Khanza
      const mockDoctors: Doctor[] = [
        {
          id: 'dr001',
          name: 'dr. Ahmad Santoso, Sp.A',
          specialization: 'Spesialis Anak',
          sip: 'SIP-2023-001',
          schedule: ['Senin: 08:00-10:00', 'Rabu: 08:00-10:00', 'Jumat: 08:00-10:00'],
          photo: '/placeholder-doctor.jpg'
        },
        {
          id: 'dr002',
          name: 'dr. Siti Nurhaliza, Sp.A',
          specialization: 'Spesialis Anak',
          sip: 'SIP-2023-002',
          schedule: ['Selasa: 09:00-11:00', 'Kamis: 09:00-11:00', 'Sabtu: 09:00-11:00'],
          photo: '/placeholder-doctor.jpg'
        },
        {
          id: 'dr003',
          name: 'dr. Bambang Prasetyo, Sp.A',
          specialization: 'Spesialis Anak',
          sip: 'SIP-2023-003',
          schedule: ['Senin: 14:00-16:00', 'Rabu: 14:00-16:00', 'Jumat: 14:00-16:00'],
          photo: '/placeholder-doctor.jpg'
        }
      ];

      // Filter dokter berdasarkan spesialisasi
      const filteredDoctors = mockDoctors.filter(doctor => 
        doctor.specialization.toLowerCase().includes(specNames[specId]?.toLowerCase() || '')
      );

      setDoctors(filteredDoctors.length > 0 ? filteredDoctors : mockDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Dalam kasus error, tetap tampilkan beberapa data dummy
      setDoctors([
        {
          id: 'dr001',
          name: 'dr. Ahmad Santoso, Sp.A',
          specialization: 'Spesialis Anak',
          sip: 'SIP-2023-001',
          schedule: ['Senin: 08:00-10:00', 'Rabu: 08:00-10:00', 'Jumat: 08:00-10:00'],
          photo: '/placeholder-doctor.jpg'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow">
                    <div className="flex items-center">
                      <div className="h-16 w-16 bg-gray-200 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-8 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              className="mr-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => router.back()}
            >
              ← Kembali
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              {specializationName}
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-emerald-100 shadow-lg rounded-3xl p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Tentang {specializationName}</h2>
              <p className="text-gray-600">
                Layanan spesialis {specializationName.toLowerCase()} kami menyediakan pemeriksaan, diagnosis, 
                dan pengobatan berbagai kondisi kesehatan terkait dengan spesialisasi ini. Tim dokter kami 
                memiliki pengalaman dan kompetensi tinggi dalam bidangnya.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Manfaat bagi pasien:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Konsultasi langsung dengan dokter spesialis berpengalaman</li>
                <li>Waktu tunggu minimal berkat sistem pendaftaran eksekutif</li>
                <li>Pemeriksaan menyeluruh sesuai kebutuhan pasien</li>
                <li>Follow-up yang teratur dan terjadwal</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Dukungan layanan penunjang digital:</h3>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 text-emerald-600 mr-2" />
                <span>Hasil laboratorium dan radiologi langsung tersedia digital</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Dokter Spesialis {specializationName}</h2>
            
            <div className="space-y-4">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-emerald-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4" />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-xs text-gray-500 mt-1">SIP: {doctor.sip}</p>
                            </div>
                            
                            <Button 
                              asChild
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                            >
                              <Link href={`/services/featured/executive/register?doctorId=${doctor.id}&specialization=${encodeURIComponent(specializationName)}`}>
                                Daftar Sekarang
                              </Link>
                            </Button>
                          </div>
                          
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Jadwal Praktik:</h4>
                            <div className="flex flex-wrap gap-2">
                              {doctor.schedule.map((schedule, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {schedule}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}