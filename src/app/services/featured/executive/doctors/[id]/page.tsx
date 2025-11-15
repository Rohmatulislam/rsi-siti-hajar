// src/app/services/featured/executive/doctors/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Calendar,
  Clock,
  MapPin,
  FileText,
  Stethoscope
} from 'lucide-react';
import { ExecutiveDoctor, getExecutiveDoctors } from '@/lib/executive/executive-service';

export default async function ExecutiveDoctorDetailPage({
  params
}: {
  params: { id: string };
}) {
  const allDoctors = await getExecutiveDoctors();
  const doctor = allDoctors.find(d => d.id === params.id);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-8 pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              className="mr-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              asChild
            >
              <Link href="/services/featured/executive">← Kembali</Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Detail Dokter</h1>
          </div>

          <Card className="border-emerald-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center mr-0 md:mr-6 mb-4 md:mb-0" />
                
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
                  <p className="text-emerald-600 font-medium">{doctor.specialization}</p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-emerald-600" />
                      <span>SIP: {doctor.sip}</span>
                    </div>
                    <div className="flex items-center">
                      <Stethoscope className="h-4 w-4 mr-2 text-emerald-600" />
                      <span>Pendidikan: {doctor.education}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <Button 
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Link href={`/services/featured/executive/register?doctorId=${doctor.id}&specialization=${encodeURIComponent(doctor.specialization)}`}>
                      Daftar Sekarang
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Jadwal Praktik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctor.schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-emerald-100 rounded-lg bg-emerald-50/30"
                  >
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-emerald-600 mr-2" />
                        <span className="font-medium">{schedule.day}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-emerald-600 mr-2" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-0">
                      <Badge variant="secondary" className="bg-white text-emerald-700 border-emerald-200">
                        Kuota: {schedule.quota ? `${10 - Math.floor(Math.random() * 4)}/${schedule.quota}` : 'Tersedia'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-emerald-100">
                <h3 className="font-medium text-gray-800 mb-2">Lokasi Praktik</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                  <span className="text-gray-600">Poli Eksekutif, Lantai 2, RSI Siti Hajar Mataram</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}