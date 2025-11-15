import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  HeartPulse,
  Users,
  Calendar,
  MapPin,
  Clock,
  Stethoscope,
  FileText,
  Star,
  ChevronRight,
  CheckCircle,
  User,
  Phone,
  MapPin as MapPinIcon
} from 'lucide-react';
import { getExecutiveDoctors } from '@/lib/executive/executive-service';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  education: string;
  sip: string;
  schedules: {
    day: string;
    startTime: string;
    endTime: string;
    quota?: number;
  }[];
}

async function SpecializationsPage() {
  const doctors: Doctor[] = await getExecutiveDoctors();

  // Grup dokter berdasarkan spesialisasi
  const doctorsBySpecialization: Record<string, Doctor[]> = {};
  
  doctors.forEach(doctor => {
    const specialization = doctor.specialization;
    if (!doctorsBySpecialization[specialization]) {
      doctorsBySpecialization[specialization] = [];
    }
    doctorsBySpecialization[specialization].push(doctor);
  });

  // Ambil spesialisasi unik
  const specializations = Object.keys(doctorsBySpecialization);

  // Ambil satu dokter dari setiap spesialisasi untuk ditampilkan
  const featuredDoctors = specializations.map(spec => ({
    name: spec,
    doctor: doctorsBySpecialization[spec][0]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-hidden pt-16">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[40vh] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: "url('/images/bener/baner-unggulan.jpg')" }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-emerald-900/50 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Pilih Spesialisasi Anda
            </h1>
            <p className="text-lg text-emerald-100 mb-6">
              Temukan dokter spesialis terbaik yang sesuai dengan kebutuhan kesehatan Anda
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Ditangani dokter spesialis pilihan</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Pelayanan cepat dan nyaman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 180"
            className="w-full h-[90px] text-white fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,112C672,107,768,149,864,160C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,180L0,180Z" />
          </svg>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="absolute inset-0">
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/40 blur-3xl rounded-full"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="bg-white/80 backdrop-blur-lg border border-emerald-100 shadow-lg rounded-3xl p-6 md:p-10">
            {/* Daftar Spesialisasi */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Kolom kiri - Daftar Spesialisasi */}
              <div className="lg:col-span-2">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Spesialisasi Tersedia</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Pilih spesialisasi yang sesuai dengan kebutuhan kesehatan Anda. 
                    Kami menyediakan layanan konsultasi dengan dokter terbaik di setiap bidang.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredDoctors.map((item, index) => (
                    <Card key={index} className="border-emerald-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-emerald-50 rounded-t-lg">
                        <CardTitle className="text-lg font-semibold text-emerald-800">
                          {item.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-800 mb-2">Dokter Terpilih:</h3>
                          <p className="text-gray-700">{item.doctor.name}</p>
                          <p className="text-sm text-gray-600">{item.doctor.education}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-2">Jadwal Praktek:</h4>
                          {item.doctor.schedules.map((schedule, idx) => (
                            <div key={idx} className="text-sm text-gray-700 mb-1">
                              {schedule.day}: {schedule.startTime} - {schedule.endTime}
                              {schedule.quota !== undefined && (
                                <span className="text-xs text-emerald-600 ml-2">
                                  (Kuota: {schedule.quota})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <Link href={`/services/featured/executive/doctors/${item.doctor.id}`}>
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Lihat Semua Dokter
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Kolom kanan - Daftar Dokter Terkait */}
              <div className="lg:col-span-1">
                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-6 flex items-center">
                    <HeartPulse className="mr-2" />
                    Dokter Tersedia
                  </h3>
                  
                  <div className="space-y-4">
                    {doctors.slice(0, 6).map((doctor, index) => (
                      <div key={doctor.id} className="bg-white rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start">
                          <div className="bg-emerald-100 rounded-full p-3 mr-4">
                            <User className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                            <p className="text-sm text-emerald-600">{doctor.specialization}</p>
                            <p className="text-xs text-gray-500 mt-1">{doctor.education}</p>
                            
                            <div className="mt-2 flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {doctor.schedules.length > 0 
                                  ? `${doctor.schedules[0].day}, ${doctor.schedules[0].startTime}-${doctor.schedules[0].endTime}`
                                  : 'Jadwal belum tersedia'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Link href={`/services/featured/executive/doctors/${doctor.id}`}>
                          <Button variant="outline" size="sm" className="w-full mt-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                            Detail Dokter
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-emerald-200">
                    <h4 className="font-medium text-gray-800 mb-3">Keunggulan Kami</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        <span>Dokter Spesialis Terbaik</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        <span>Pelayanan Cepat</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        <span>Waktu Praktek Fleksibel</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        <span>Layanan Premium</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SpecializationsPage;