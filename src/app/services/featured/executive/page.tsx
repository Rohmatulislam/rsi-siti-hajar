import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building,
  Syringe,
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  User,
  Stethoscope,
  Shield,
  Coffee
} from "lucide-react";
import Link from "next/link";

export default function ExecutiveServicePage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button asChild variant="outline" className="mr-4">
            <Link href="/services/featured">← Kembali</Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Layanan Eksekutif</h1>
        </div>
        
        <Card className="overflow-hidden bg-card text-foreground border-border mb-8">
          <div className="w-full h-64 overflow-hidden">
            <img 
              src="/placeholder.jpg" 
              alt="Layanan Eksekutif" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg mr-4">
                <Building className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground mb-2">Layanan Eksekutif</CardTitle>
                <p className="text-muted-foreground">Pelayanan khusus dengan fasilitas premium untuk kenyamanan maksimal pasien dan keluarga</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Tentang Layanan</h3>
                <p className="text-muted-foreground mb-4">
                  RS Islam Siti Hajar Mataram memahami kebutuhan masyarakat modern yang menginginkan pelayanan kesehatan 
                  yang efisien, nyaman, dan privat tanpa mengurangi mutu pelayanan medis. Untuk itu, kami menghadirkan 
                  Poliklinik Eksekutif, sebuah layanan rawat jalan yang dirancang khusus bagi pasien yang mengutamakan 
                  kenyamanan, waktu, dan pelayanan personal.
                </p>
                
                <h4 className="font-medium mb-2 text-foreground">Keunggulan Layanan:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Pelayanan tanpa antre panjang</li>
                  <li>Jadwal konsultasi yang fleksibel</li>
                  <li>Ruang tunggu yang eksklusif dengan suasana tenang dan profesional</li>
                  <li>Setiap pasien ditangani langsung oleh dokter spesialis pilihan dengan dukungan tim medis berpengalaman</li>
                  <li>Pemeriksaan berjalan cepat dan menyeluruh</li>
                  <li>Pendampingan personal dari staf administrasi khusus</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2 text-foreground">Lingkup Spesialisasi:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Anak</li>
                  <li>Penyakit Dalam</li>
                  <li>Ortopedi</li>
                  <li>Bedah Anak</li>
                  <li>Bedah Umum</li>
                  <li>Bedah Digestif</li>
                  <li>Bedah Onkologi</li>
                  <li>Bedah Urologi</li>
                  <li>Saraf</li>
                  <li>Kulit & Kelamin</li>
                  <li>Rehabilitasi Medik</li>
                  <li>Psikiatri</li>
                  <li>Paru</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2 text-foreground">Layanan Terintegrasi:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Layanan penunjang seperti laboratorium, radiologi, dan farmasi terintegrasi secara digital</li>
                  <li>Hasil pemeriksaan dapat langsung diakses oleh dokter untuk mempercepat proses diagnosis dan terapi</li>
                  <li>Proses pendaftaran, pembayaran, hingga pengaturan jadwal kunjungan berikutnya dilakukan dengan pendampingan khusus</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Detail Informasi</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Lokasi</h4>
                      <p className="text-muted-foreground">Gedung VIP Lantai 3, Sayap Timur</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Jam Operasional</h4>
                      <p className="text-muted-foreground">24 Jam (Pelayanan Penuh)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Kontak</h4>
                      <p className="text-muted-foreground">(0370) 112233</p>
                      <p className="text-muted-foreground">eksekutif@rsisitihajar.ac.id</p>
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
                        <span className="ml-2 text-muted-foreground">4.9 (156 ulasan)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Fasilitas Premium</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                      <h4 className="font-medium text-foreground">Keamanan 24/7</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Keamanan dan privasi terjaga dengan petugas khusus</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Coffee className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                      <h4 className="font-medium text-foreground">Lounge Keluarga</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Area nyaman untuk keluarga menunggu</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                      <h4 className="font-medium text-foreground">Monitoring Khusus</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Pemantauan intensif dengan peralatan canggih</p>
                  </CardContent>
                </Card>
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
                          <h4 className="font-medium text-foreground">dr. Muhammad Ridwan, Sp.JP</h4>
                          <p className="text-sm text-muted-foreground">Spesialis Jantung dan Pembuluh Darah</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-muted-foreground ml-1">4.9</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-3 border-primary/30 dark:border-emerald-500/50 text-primary dark:text-emerald-400 hover:bg-primary/5 dark:hover:bg-emerald-500/10">
                        <Link href="/doctors/4">Lihat Profil</Link>
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
}