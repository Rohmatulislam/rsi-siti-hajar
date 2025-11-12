'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, HeartPulse, Stethoscope, Syringe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Service {
  id: string;
  category: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  contact_info: string | null;
  location: string | null;
  operating_hours: string | null;
  features: string[] | null;
  reviews: string[] | null;
  created_at: string;
}

const getIconForService = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("dokter") || lower.includes("medis")) return HeartPulse;
  if (lower.includes("bedah") || lower.includes("operasi")) return Syringe;
  if (lower.includes("umum") || lower.includes("check")) return Stethoscope;
  return Star;
};

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services?category=unggulan", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat layanan unggulan.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-1">
              Layanan Unggulan Kami
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Pilihan layanan kesehatan terbaik dengan tenaga profesional dan teknologi modern.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Skeleton loaders */}
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl border bg-gray-100/70 backdrop-blur-lg shadow-md animate-pulse"
              >
                <div className="relative aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
                <div className="relative p-4 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-200 rounded-full w-8 h-8"></div>
                    <div className="bg-gray-200 h-4 flex-1 rounded"></div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="bg-gray-200 h-3 rounded w-full"></div>
                    <div className="bg-gray-200 h-3 rounded w-4/5"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <div className="bg-gray-200 text-[9px] px-1.5 py-0.5 rounded w-10" />
                    <div className="bg-gray-200 text-[9px] px-1.5 py-0.5 rounded w-12" />
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-3 h-3 mr-1" />
                      <div className="bg-gray-200 h-2 rounded w-24" />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-3 h-3 mr-1" />
                      <div className="bg-gray-200 h-2 rounded w-16" />
                    </div>
                  </div>
                  
                  <div className="bg-gray-200 h-6 rounded-md w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-3">Belum ada layanan unggulan yang tersedia.</p>
        <p className="text-sm text-muted-foreground/80 mb-4">Silakan periksa kembali nanti atau hubungi administrator untuk informasi lebih lanjut.</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="border-emerald-400 text-emerald-600 hover:bg-emerald-50"
        >
          Muat Ulang Halaman
        </Button>
      </div>
    );
  }

  return (
    <section className="py-10 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-1">
            Layanan Unggulan Kami
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Pilihan layanan kesehatan terbaik dengan tenaga profesional dan teknologi modern.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = getIconForService(service.title);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-100/50 
                bg-white/70 backdrop-blur-lg shadow-md hover:shadow-xl 
                hover:shadow-emerald-100/40 hover:scale-[1.015] transition-all duration-500"
              >
                {/* Gambar */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                  <img
                    src={service.image_url || "/images/placeholder.jpg"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                    Unggulan
                  </div>
                </div>

                {/* Konten */}
                <div className="relative p-4 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-100 p-1.5 rounded-full">
                      <Icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {service.title}
                    </h3>
                  </div>

                  {service.description ? (
                    <div className="text-xs text-gray-600 line-clamp-2 mb-3" dangerouslySetInnerHTML={{ __html: service.description }} />
                  ) : (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      Tidak ada deskripsi tersedia.
                    </p>
                  )}

                  {/* Fitur */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.features?.slice(0, 2).map((feature, i) => (
                      <Badge
                        key={i}
                        className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-1.5 py-0.5"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {service.features && service.features.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 border-emerald-300 text-[9px] px-1.5 py-0.5"
                      >
                        +{service.features.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5 mb-3 text-[10px] text-gray-500">
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
                  </div>

                  {/* Tombol */}
                  <Button
                    asChild
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] py-1.5 rounded-md shadow-sm hover:shadow-md transition-all"
                  >
                    <Link href={`/services/featured/${service.id}`}>Lihat Detail</Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
