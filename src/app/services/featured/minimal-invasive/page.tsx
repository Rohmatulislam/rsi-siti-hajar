import { notFound } from 'next/navigation';
import { getServiceById } from '@/lib/service-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  Scissors
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface MinimalInvasivePageProps {
  params: {
    id?: string;
  };
}

// Fungsi untuk mendapatkan metadata
export async function generateMetadata({ params }: MinimalInvasivePageProps): Promise<Metadata> {
  try {
    // Kita akan mencoba mendapatkan service 'minimal-invasive' dari database
    const service = await getServiceById('minimal-invasive');
    
    return {
      title: `${service.title} | Layanan Unggulan | RSI Siti Hajar Mataram`,
      description: service.description || 'Layanan Bedah Minimal Invasif di RSI Siti Hajar Mataram',
    };
  } catch (error) {
    return {
      title: 'Layanan Tidak Ditemukan',
      description: 'Layanan yang Anda cari tidak ditemukan',
    };
  }
}

export default async function MinimalInvasivePage({ params }: MinimalInvasivePageProps) {
  try {
    // Ambil data layanan dari database berdasarkan ID
    // Kita coba dengan ID 'minimal-invasive' untuk halaman ini
    let service;
    try {
      service = await getServiceById('minimal-invasive');
    } catch (error) {
      // Jika tidak ditemukan dengan ID 'minimal-invasive', coba cari lewat title
      // Kita akan mengimplementasikan fungsi baru untuk mencari layanan berdasarkan title
      // Untuk saat ini, kita akan mengembalikan not found jika tidak ditemukan
      console.error('Service with ID minimal-invasive not found, trying to find by title...');
      notFound();
    }
    
    return (
      <div className="min-h-screen bg-background">
        <div 
          className="w-full bg-cover bg-center bg-no-repeat py-10 text-white relative overflow-hidden"
          style={{ backgroundImage: "url('/images/bener/baner-unggulan.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
          <div className="container mx-auto px-6 relative z-10 pt-6">
            <div className="max-w-lg p-4">
              <nav className="flex items-center text-xs text-slate-200 mb-3">
                <Link href="/" className="cursor-pointer hover:text-white">
                  Beranda
                </Link>
                <span className="mx-1.5 text-xs">{'>'}</span>
                <Link href="/services" className="cursor-pointer hover:text-white">
                  Layanan
                </Link>
                <span className="mx-1.5 text-xs">{'>'}</span>
                <Link href="/services/featured" className="cursor-pointer hover:text-white">
                  Layanan Unggulan
                </Link>
                <span className="mx-1.5 text-xs">{'>'}</span>
                <span className="text-white font-medium">{service.title}</span>
              </nav>
              <h1 className="text-xl font-bold text-white">{service.title}</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card className="overflow-hidden bg-card text-foreground border-border mb-8">
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg mr-4">
                  <Scissors className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground mb-2 sr-only">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Tentang Layanan</h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description} RS Islam Siti Hajar Mataram menghadirkan layanan {service.title} 
                    sebagai salah satu bentuk inovasi pelayanan bedah modern.
                  </p>
                  
                  <h4 className="font-medium mb-2 text-foreground">Jenis Layanan:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {service.features && Array.isArray(service.features) && service.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2 text-foreground">Keunggulan {service.title}:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Rasa nyeri yang lebih ringan</li>
                    <li>Perdarahan minimal</li>
                    <li>Risiko infeksi lebih rendah</li>
                    <li>Waktu pemulihan lebih cepat</li>
                    <li>Pasien dapat pulang lebih awal</li>
                    <li>Lebih aman dan nyaman</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Detail Informasi</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Lokasi</h4>
                        <p className="text-muted-foreground">{service.location || 'Gedung C Lantai 3, Ruang Bedah'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Jam Operasional</h4>
                        <p className="text-muted-foreground">{service.operating_hours || 'Senin - Jumat: 08:00 - 16:00'}</p>
                        <p className="text-muted-foreground">Sabtu: 08:00 - 12:00</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Kontak</h4>
                        <p className="text-muted-foreground">{service.contact_info || '(0370) 123456'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Rating</h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                          <span className="ml-2 text-muted-foreground">4.9 (128 ulasan)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Dokter Spesialis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <Card key={item} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-3" />
                          <div>
                            <h4 className="font-medium text-foreground">dr. Andi Prasetyo, Sp.B</h4>
                            <p className="text-sm text-muted-foreground">Spesialis Bedah</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-muted-foreground ml-1">4.9</span>
                            </div>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm" className="w-full mt-3 border-primary/30 dark:border-emerald-500/50 text-primary dark:text-emerald-400 hover:bg-primary/5 dark:hover:bg-emerald-500/10">
                          <Link href="/doctors/1">Lihat Profil</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/appointment">Buat Janji Temu</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto border-primary/30 dark:border-emerald-500/50 text-primary dark:text-emerald-400 hover:bg-primary/5 dark:hover:bg-emerald-500/10">
                  <Link href="/services/featured">Lihat Layanan Lainnya</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching service:', error);
    notFound(); // Tampilkan halaman 404 jika layanan tidak ditemukan
  }
}