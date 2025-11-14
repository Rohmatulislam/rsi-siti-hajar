'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Scissors,
  Syringe,
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Stethoscope,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Star
} from "lucide-react";
import Link from "next/link";
import { getServiceById, getDoctorsByServiceId } from "@/lib/service-service";
import { Service, Doctor } from "@/lib/admin-types";
import { KhanzaSchedule } from "@/lib/khanza/types";
import { motion } from "framer-motion";

const getIconForService = (serviceName: string) => {
  const lower = serviceName.toLowerCase();
  if (lower.includes("bedah")) return Scissors;
  if (lower.includes("jantung")) return HeartPulse;
  if (lower.includes("eksekutif")) return Building;
  return Syringe;
};

export default function FeaturedServiceDetailPage() {
  const params = useParams();
  const { id } = params;
  const [service, setService] = useState<Service | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<KhanzaSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        if (typeof id === "string") {
          const serviceData = await getServiceById(id);
          if (serviceData) {
            setService(serviceData);

            // Ambil dokter terkait dengan layanan ini
            try {
              const relatedDoctors = await getDoctorsByServiceId(id);
              setDoctors(relatedDoctors);
            } catch (doctorError) {
              console.error("❌ Error fetching related doctors:", doctorError);
              // Jika gagal mengambil dokter, kosongkan array dokter
              setDoctors([]);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error fetching service detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchServiceDetail();
  }, [id]);

  const fetchSchedules = async () => {
    if (!id) return;

    setSchedulesLoading(true);
    setSchedulesError(null);

    try {
      const res = await fetch(`/api/khanza/schedule?serviceId=${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching schedules:", error);
      setSchedulesError("Gagal memuat jadwal dokter.");
    } finally {
      setSchedulesLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-hidden">
        {/* HERO IMAGE SKELETON */}
        <section className="relative w-full h-[45vh] bg-gradient-to-r from-emerald-900/70 via-emerald-900/30 to-transparent flex items-end justify-center pb-12 pl-6 md:pl-10">
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
          {/* Badge skeleton */}
          <div className="absolute top-4 left-4 z-10">
            <div className="h-4 w-14 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
          <div className="relative z-10 text-left text-white w-full max-w-6xl">
            <div className="h-4 w-1/4 bg-gray-400 rounded mb-3 animate-pulse"></div>
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-gray-400 rounded-full w-6 h-6 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 w-3/4 bg-gray-400 rounded mb-3 animate-pulse"></div>
                <div className="h-3 w-full bg-gray-400 rounded mb-1 animate-pulse"></div>
                <div className="h-3 w-4/5 bg-gray-400 rounded animate-pulse"></div>
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

        {/* DETAIL SKELETON */}
        <section className="relative -mt-10 pb-16 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse">
              <div className="bg-white/90 backdrop-blur-sm shadow-lg border border-emerald-100 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-emerald-100 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-300 rounded-full w-6 h-6 animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 w-4/5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-gray-300 rounded animate-pulse mt-1"></div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Fitur Skeleton */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <div className="bg-gray-300 text-[9px] h-4 w-10 rounded animate-pulse"></div>
                    <div className="bg-gray-300 text-[9px] h-4 w-12 rounded animate-pulse"></div>
                    <div className="bg-gray-300 text-[9px] h-4 w-8 rounded animate-pulse"></div>
                  </div>

                  {/* Informasi Skeleton */}
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <div className="bg-gray-300 rounded-full w-2.5 h-2.5 mr-1 animate-pulse"></div>
                      <div className="h-2.5 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-300 rounded-full w-2.5 h-2.5 mr-1 animate-pulse"></div>
                      <div className="h-2.5 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-300 rounded-full w-2.5 h-2.5 mr-1 animate-pulse"></div>
                      <div className="h-2.5 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* CTA Skeleton */}
                  <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div className="h-8 w-1/2 bg-gray-300 rounded-md"></div>
                    <div className="h-8 w-1/4 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* DOKTER TERKAIT SKELETON */}
            <div className="mt-14 animate-pulse">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="h-5 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-8 w-1/5 bg-gray-300 rounded-md mt-3 sm:mt-0"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
                    <div className="flex items-center">
                      <div className="bg-gray-300 rounded-xl w-16 h-16 mr-3"></div>
                      <div>
                        <div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-gray-300 rounded mb-1"></div>
                        <div className="flex items-center mt-1">
                          <div className="h-2.5 w-16 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-7 w-full bg-gray-300 rounded mt-3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center text-gray-500">
        Data layanan tidak ditemukan.
      </div>
    );
  }

  const IconComponent = getIconForService(service.title);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-hidden">
      {/* HERO IMAGE */}
      <section
        className="relative w-full h-[45vh] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center"
        style={{ backgroundImage: `url(${service.image_url || "/images/bener/baner-unggulan.jpg"})` }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-transparent md:bg-gradient-to-r md:from-emerald-900/70 md:via-emerald-900/30 md:to-transparent"></div>

        {/* Badge "Unggulan" di posisi yang konsisten dengan halaman utama */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
            Unggulan
          </Badge>
        </div>

        {/* Hero Content - sekarang posisi teks di sebelah kiri seperti halaman utama */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <nav className="text-sm text-emerald-200 mb-2">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <span className="mx-1 md:mx-2">{'>'}</span>
              <Link href="/services" className="hover:text-white">Layanan</Link>
              <span className="mx-1 md:mx-2">{'>'}</span>
              <Link href="/services/featured" className="hover:text-white">Layanan Unggulan</Link>
              <span className="mx-1 md:mx-2">{'>'}</span>
              <span className="text-white">{service.title}</span>
            </nav>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 md:mb-3 drop-shadow-md">
                  {service.title}
                </h1>
                {service.description ? (
                  <div className="text-xs sm:text-sm md:text-base text-emerald-50/90 max-w-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: service.description.length > 150 ? `${service.description.substring(0, 150)}...` : service.description }} />
                ) : (
                  <p className="text-xs sm:text-sm md:text-base text-emerald-50/90 max-w-lg leading-relaxed">
                    Deskripsi layanan tidak tersedia.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
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

      {/* DETAIL SECTION */}
      <section className="pt-16 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-emerald-100 rounded-2xl overflow-hidden">
                <CardHeader className="p-4 border-b border-emerald-100 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-100 p-1.5 rounded-full">
                      <IconComponent className="h-4 w-4 text-emerald-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-800">
                      {service.title}
                    </CardTitle>
                  </div>

                  {service.description ? (
                    <div className="text-xs text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: service.description }} />
                  ) : (
                    <p className="text-xs text-gray-600 mb-3">
                      Tidak ada deskripsi tersedia.
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Fitur */}
                  {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <Badge
                          key={i}
                          className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-[9px] px-1.5 py-0.5 border border-emerald-200"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-emerald-600 border-emerald-300 text-[9px] px-1.5 py-0.5"
                        >
                          +{service.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Informasi */}
                  <div className="space-y-0.5 text-[10px] text-gray-500">
                    {service.location && (
                      <div className="flex items-center">
                        <MapPin className="h-2.5 w-2.5 mr-1 text-emerald-500" />
                        <span className="truncate">{service.location}</span>
                      </div>
                    )}
                    {service.operating_hours && (
                      <div className="flex items-center">
                        <Clock className="h-2.5 w-2.5 mr-1 text-emerald-500" />
                        <span>{service.operating_hours}</span>
                      </div>
                    )}
                    {service.contact_info && (
                      <div className="flex items-center">
                        <Phone className="h-2.5 w-2.5 mr-1 text-emerald-500" />
                        <span>{service.contact_info}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm py-2"
                    >
                      <Link href="/services/featured">← Kembali ke Daftar Layanan</Link>
                    </Button>

                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                      <Button
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px] flex-1 min-w-[120px]"
                      >
                        <Link href="/appointment">Hubungi Kami</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="text-emerald-600 border-2 border-emerald-600 text-sm py-2 px-4 transition-all duration-200 font-medium shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px] flex-1 min-w-[120px]"
                      >
                        <Link href={`/appointment/book?serviceId=${id}`}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Daftar Pemeriksaan
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* JADWAL DOKTER */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="font-semibold text-lg text-foreground">Jadwal Dokter Terkait</h3>
                  <Button
                    onClick={fetchSchedules}
                    variant="outline"
                    className="mt-3 sm:mt-0 text-emerald-600 border-emerald-600 text-sm py-1.5 shadow-sm transition-all"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    {schedulesLoading ? 'Memuat...' : 'Lihat Jadwal'}
                  </Button>
                </div>

                {schedulesError && (
                  <div className="text-center py-4 text-red-600 bg-red-50 rounded-xl mb-6">
                    {schedulesError}
                  </div>
                )}

                {schedulesLoading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-8 bg-gray-200 rounded mt-3"></div>
                      </div>
                    ))}
                  </div>
                ) : schedules.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {schedules.map((schedule) => (
                      <Card key={schedule.id} className="border border-white/30 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-foreground text-sm">Dokter</h4>
                              <p className="text-xs text-muted-foreground">ID: {schedule.doctor_id}</p>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                              Tersedia: {schedule.available_slots}
                            </Badge>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center text-xs">
                              <Calendar className="h-3.5 w-3.5 text-emerald-600 mr-2" />
                              <span>{schedule.day}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Clock className="h-3.5 w-3.5 text-emerald-600 mr-2" />
                              <span>{schedule.start_time} - {schedule.end_time}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Users className="h-3.5 w-3.5 text-emerald-600 mr-2" />
                              <span>Maks: {schedule.max_patients} pasien</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 text-emerald-600 border-emerald-600 text-xs py-1.5"
                            asChild
                          >
                            <Link href={`/appointment/book?doctorId=${schedule.doctor_id}&scheduleId=${schedule.id}`}>
                              Buat Janji
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
                    <p>Belum ada jadwal dokter yang tersedia.</p>
                    {!schedulesError && (
                      <p className="text-sm mt-2">Klik tombol "Lihat Jadwal" untuk memuat data dari sistem SIMRS.</p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* DOKTER TERKAIT */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="font-semibold text-lg text-foreground">Dokter Spesialis Terkait</h3>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-3 sm:mt-0 text-emerald-600 border-emerald-600 text-sm py-1.5 shadow-sm transition-all"
                  >
                    <Link href="/doctors">Lihat Semua Dokter</Link>
                  </Button>
                </div>
                {doctors.length > 0 ? (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <Card key={doctor.id} className="border border-white/30 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            {doctor.image_url ? (
                              <img
                                src={doctor.image_url}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-xl object-cover mr-3 border border-gray-200"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null; // Prevent infinite loop if fallback fails
                                  target.src = "/images/placeholder.jpg";
                                }}
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-3" />
                            )}
                            <div>
                              <h4 className="font-medium text-foreground text-sm">{doctor.name}</h4>
                              <p className="text-xs text-muted-foreground">Spesialis {doctor.specialty}</p>
                              <div className="flex items-center mt-1">
                                <Stethoscope className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                                <span className="text-xs text-muted-foreground">4.9</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 text-emerald-600 border-emerald-600 text-xs py-1.5"
                          >
                            <Link href={`/doctors/${doctor.slug || doctor.id}`}>Lihat Profil</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
                    <p>Belum ada dokter yang terkait dengan layanan ini.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
