"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bed,
  Pill,
  Syringe,
  Activity,
  HeartPulse,
  User,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText
} from "lucide-react";
import { getServiceById } from "@/lib/service-service";
import { Service } from "@/lib/admin-types";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBooking = () => {
    router.push('/appointment');
  };

  const handleConsultation = () => {
    // For now, redirect to appointment page, in the future this could open a consultation modal
    router.push('/appointment');
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (typeof id === 'string') {
          const serviceData = await getServiceById(id);
          if (serviceData) {
            setService(serviceData);
          } else {
            console.error("Service not found with id:", id);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Memuat data layanan...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Layanan tidak ditemukan.</div>
      </div>
    );
  }

  // Define icon based on service category
  const getServiceIcon = () => {
    if (!service.category) return <HeartPulse className="h-8 w-8" />;
    
    switch (service.category.toLowerCase()) {
      case 'inpatient':
      case 'rawat inap':
        return <Bed className="h-8 w-8" />;
      case 'outpatient':
      case 'rawat jalan':
        return <User className="h-8 w-8" />;
      case 'pharmacy':
      case 'farmasi':
        return <Pill className="h-8 w-8" />;
      case 'laboratory':
      case 'laboratorium':
        return <Syringe className="h-8 w-8" />;
      case 'radiology':
      case 'radiologi':
        return <Activity className="h-8 w-8" />;
      case 'rehabilitation':
      case 'rehabilitasi medik':
        return <HeartPulse className="h-8 w-8" />;
      case 'mcu':
      case 'medical check up':
        return <Activity className="h-8 w-8" />;
      default:
        return <HeartPulse className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg shadow border border-border">
          {/* Service Header */}
          {service.image_url ? (
            <div className="relative h-64 overflow-hidden">
              <img 
                src={service.image_url} 
                alt={service.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 dark:from-emerald-700/80 dark:to-teal-800/80 flex items-end p-6">
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-lg mr-4">
                    {getServiceIcon()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{service.title}</h1>
                    <p className="mt-2 opacity-90 text-white">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 dark:from-emerald-700 dark:to-teal-800">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  {getServiceIcon()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{service.title}</h1>
                  <p className="mt-2 opacity-90 text-white">{service.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tentang Layanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {service.description || "Deskripsi layanan akan segera diupdate. Layanan ini menyediakan pemeriksaan dan perawatan medis terbaik dengan dukungan tenaga medis profesional dan peralatan modern."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Fasilitas & Layanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.features?.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full mr-3 mt-0.5">
                            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Ulasan Pasien</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 font-medium text-foreground">4.8 dari 5</span>
                      <span className="ml-2 text-muted-foreground">(120 ulasan)</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Ahmad S.</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Pelayanan sangat baik, dokternya ramah dan profesional. Antrian tidak terlalu lama.</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Siti R.</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Fasilitas lengkap dan bersih. Perawatnya sangat membantu selama perawatan.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking & Info */}
              <div>
                <Card className="sticky top-6 bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Info Layanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {service.operating_hours && (
                        <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                          <Clock className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-foreground">Jam Operasional</p>
                            <p className="text-muted-foreground">{service.operating_hours}</p>
                          </div>
                        </div>
                      )}
                      
                      {service.location && (
                        <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                          <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-foreground">Lokasi</p>
                            <p className="text-muted-foreground">{service.location}</p>
                          </div>
                        </div>
                      )}
                      
                      {service.contact_info && (
                        <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                          <Phone className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-foreground">Kontak</p>
                            <p className="text-muted-foreground">{service.contact_info}</p>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4 dark:bg-emerald-700 dark:hover:bg-emerald-800" onClick={handleBooking}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Buat Janji
                      </Button>
                      
                      <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted dark:hover:bg-card" onClick={handleConsultation}>
                        Konsultasi Online
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}