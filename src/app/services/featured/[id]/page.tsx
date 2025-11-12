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
} from "lucide-react";
import Link from "next/link";
import { getServiceById, getDoctorsByServiceId } from "@/lib/service-service";
import { Service, Doctor } from "@/lib/admin-types";
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
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-hidden">
        {/* HERO IMAGE SKELETON */}
        <section className="relative w-full h-[45vh] bg-gradient-to-r from-emerald-900/70 via-emerald-900/30 to-transparent flex items-end justify-center pb-12 pl-6 md:pl-10">
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
          <div className="relative z-10 text-left text-white w-full max-w-6xl">
            <div className="h-4 w-1/4 bg-gray-400 rounded mb-4 animate-pulse"></div>
            <div className="h-8 w-3/4 bg-gray-400 rounded mb-3 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-400 rounded animate-pulse"></div>
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
                <div className="p-6 border-b border-emerald-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-300 rounded-lg flex-shrink-0 w-12 h-12"></div>
                    <div className="flex-1">
                      <div className="h-8 w-3/4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-300 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-300 rounded mt-1"></div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Fitur Skeleton */}
                  <div>
                    <div className="h-6 w-1/3 bg-gray-300 rounded mb-3"></div>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-gray-300 text-xs h-6 rounded px-2.5"></div>
                      <div className="bg-gray-300 text-xs h-6 rounded px-2.5"></div>
                      <div className="bg-gray-300 text-xs h-6 rounded px-2.5"></div>
                    </div>
                  </div>

                  {/* Informasi Skeleton */}
                  <div>
                    <div className="h-6 w-1/2 bg-gray-300 rounded mb-3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-gray-300 rounded-full w-5 h-5 mr-3 mt-0.5"></div>
                        <div>
                          <div className="h-4 w-1/4 bg-gray-300 rounded mb-1"></div>
                          <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-gray-300 rounded-full w-5 h-5 mr-3 mt-0.5"></div>
                        <div>
                          <div className="h-4 w-1/3 bg-gray-300 rounded mb-1"></div>
                          <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Skeleton */}
                  <div className="pt-5 border-t border-emerald-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="h-10 w-1/2 bg-gray-300 rounded-md"></div>
                    <div className="h-10 w-1/4 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* DOKTER TERKAIT SKELETON */}
            <div className="mt-14 animate-pulse">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-10 w-1/4 bg-gray-300 rounded-md mt-3 sm:mt-0"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-card border-border">
                    <div className="p-4">
                      <div className="flex items-center">
                        <div className="bg-gray-300 rounded-xl w-16 h-16 mr-3"></div>
                        <div>
                          <div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
                          <div className="h-3 w-20 bg-gray-300 rounded"></div>
                          <div className="flex items-center mt-1">
                            <div className="h-3 w-16 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="h-8 w-full bg-gray-300 rounded mt-3"></div>
                    </div>
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
      <section className="relative w-full h-[45vh] bg-cover bg-center bg-no-repeat overflow-hidden flex items-end justify-center"
        style={{ backgroundImage: `url(${service.image_url || "/images/bener/baner-unggulan.jpg"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-emerald-900/30 to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-left text-white pb-12 pl-6 md:pl-10 w-full max-w-6xl"
        >
          <nav className="text-sm text-emerald-200 mb-2">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <span className="mx-2">{'>'}</span>
            <Link href="/services" className="hover:text-white">Layanan</Link>
            <span className="mx-2">{'>'}</span>
            <Link href="/services/featured" className="hover:text-white">Layanan Unggulan</Link>
            <span className="mx-2">{'>'}</span>
            <span className="text-white">{service.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-md">
            {service.title}
          </h1>
          {service.description ? (
            <div className="max-w-2xl text-sm text-emerald-50/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: service.description }} />
          ) : (
            <p className="max-w-2xl text-sm text-emerald-50/90 leading-relaxed">
              Deskripsi layanan tidak tersedia.
            </p>
          )}
        </motion.div>

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
      <section className="relative -mt-10 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-emerald-100 rounded-2xl overflow-hidden">
              <CardHeader className="p-6 border-b border-emerald-100">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl text-foreground mb-2">
                      {service.title}
                    </CardTitle>
                    {service.description ? (
                      <div className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: service.description }} />
                    ) : null}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Fitur */}
                {service.features && service.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-foreground">Fitur Unggulan:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, i) => (
                        <Badge
                          key={i}
                          className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-xs border border-emerald-200 shadow-sm px-2.5 py-1"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informasi */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-foreground">Detail Informasi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.location && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground">Lokasi</h4>
                          <p className="text-muted-foreground">{service.location}</p>
                        </div>
                      </div>
                    )}
                    {service.operating_hours && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground">Jam Operasional</h4>
                          <p className="text-muted-foreground">{service.operating_hours}</p>
                        </div>
                      </div>
                    )}
                    {service.contact_info && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground">Kontak</h4>
                          <p className="text-muted-foreground">{service.contact_info}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-5 border-t border-emerald-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto border-primary/30 dark:border-emerald-500/50 text-primary dark:text-emerald-400 hover:bg-primary/5 dark:hover:bg-emerald-500/10"
                  >
                    <Link href="/services/featured">← Kembali ke Daftar Layanan</Link>
                  </Button>
                  
                  <Button 
                    asChild
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Link href="/appointment">Hubungi Kami</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* DOKTER TERKAIT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-14"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="font-semibold text-lg text-foreground">Dokter Spesialis Terkait</h3>
              <Button 
                asChild
                variant="outline"
                className="mt-3 sm:mt-0 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-1.5 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Link href="/doctors">Lihat Semua Dokter</Link>
              </Button>
            </div>
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="bg-card border-border hover:shadow-md transition-all">
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
                          <h4 className="font-medium text-foreground">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">Spesialis {doctor.specialty}</p>
                          <div className="flex items-center mt-1">
                            <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                            <span className="text-sm text-muted-foreground">4.9</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-1.5 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                      >
                        <Link href={`/doctors/${doctor.slug || doctor.id}`}>Lihat Profil</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl">
                <p>Belum ada dokter yang terkait dengan layanan ini.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
