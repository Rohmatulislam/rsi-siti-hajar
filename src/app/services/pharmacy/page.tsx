import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Pill,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function PharmacyServicePage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg shadow border border-border">
          {/* Service Header */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src="/placeholder-pharmacy.jpg" 
              alt="Farmasi 24 Jam" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 dark:from-emerald-700/80 dark:to-teal-800/80 flex items-end p-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <Pill className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Farmasi 24 Jam</h1>
                  <p className="mt-2 opacity-90 text-white">Layanan apotek yang tersedia 24 jam untuk kebutuhan obat pasien</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tentang Layanan Farmasi 24 Jam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Layanan Farmasi 24 Jam RSI Siti Hajar Mataram menyediakan obat-obatan 
                      resep dan obat bebas dengan pelayanan yang cepat, akurat, dan aman. 
                      Dilengkapi dengan apoteker profesional yang siap memberikan informasi 
                      tentang penggunaan obat secara benar dan efektif.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Jenis Layanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Layanan Resep</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Pelayanan resep rawat jalan</li>
                          <li>• Pelayanan resep rawat inap</li>
                          <li>• Verifikasi resep oleh apoteker</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Layanan Informasi Obat</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Konsultasi penggunaan obat</li>
                          <li>• Interaksi obat</li>
                          <li>• Efek samping obat</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Layanan Obat Generik</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Obat generik berkualitas</li>
                          <li>• Harga terjangkau</li>
                          <li>• Tersedia berbagai jenis</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Layanan Obat Khusus</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Obat kemoterapi</li>
                          <li>• Obat imunobiologik</li>
                          <li>• Obat kontrol ketat</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Keunggulan Layanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Verifikasi Resep</h4>
                          <p className="text-sm text-muted-foreground">Setiap resep diverifikasi oleh apoteker berpengalaman</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Obat Berkualitas</h4>
                          <p className="text-sm text-muted-foreground">Obat-obatan yang kami sediakan bersertifikat dan terjamin kualitasnya</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Pelayanan 24 jam</h4>
                          <p className="text-sm text-muted-foreground">Tersedia setiap saat untuk kebutuhan obat pasien</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Konsultasi Gratis</h4>
                          <p className="text-sm text-muted-foreground">Konsultasi gratis dengan apoteker tentang penggunaan obat</p>
                        </div>
                      </div>
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
                      <span className="ml-2 font-medium text-foreground">4.9 dari 5</span>
                      <span className="ml-2 text-muted-foreground">(180 ulasan)</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Ahmad Fauzi</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Layanan sangat baik, apotekernya ramah dan memberikan informasi yang lengkap tentang obat.</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Sari Indah</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Obat lengkap dan tersedia 24 jam. Sangat membantu ketika ada kebutuhan mendesak.</p>
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
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <Clock className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Jam Operasional</p>
                          <p className="text-muted-foreground">24 Jam (Setiap Hari)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Lokasi</p>
                          <p className="text-muted-foreground">Lantai 1, RSI Siti Hajar Mataram</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <Phone className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Kontak</p>
                          <p className="text-muted-foreground">(0370) 623xxx</p>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                        <Calendar className="h-4 w-4 mr-2" />
                        Konsultasi Obat
                      </Button>
                      
                      <Button variant="outline" asChild className="w-full border-border text-foreground hover:bg-muted dark:hover:bg-card">
                        <Link href="/information/contact">Kontak Kami</Link>
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