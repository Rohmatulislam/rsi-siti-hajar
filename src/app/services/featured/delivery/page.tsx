import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Baby,
  Syringe,
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  User,
  Stethoscope,
  Users,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button asChild variant="outline" className="mr-4">
            <Link href="/services/featured">← Kembali</Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Persalinan Syarii</h1>
        </div>
        
        <Card className="overflow-hidden bg-card text-foreground border-border mb-8">
          <div className="w-full h-64 overflow-hidden">
            <img 
              src="/placeholder.jpg" 
              alt="Persalinan Syarii" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg mr-4">
                <Baby className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground mb-2">Persalinan Syarii</CardTitle>
                <p className="text-muted-foreground">Pelayanan persalinan yang menggabungkan aspek medis dan spiritual sesuai prinsip syariah</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Tentang Layanan</h3>
                <p className="text-muted-foreground mb-4">
                  RS Islam Siti Hajar Mataram menghadirkan layanan Persalinan Syari sebagai bentuk komitmen menghadirkan 
                  pelayanan kesehatan yang tidak hanya aman secara medis, tetapi juga sesuai dengan nilai-nilai Islam. 
                  Layanan ini dirancang khusus untuk memberikan pengalaman melahirkan yang menenangkan, penuh kasih, 
                  serta menjaga kehormatan dan kenyamanan ibu selama proses persalinan.
                </p>
                
                <h4 className="font-medium mb-2 text-foreground">Prinsip Layanan:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Konsep Persalinan Syari menekankan prinsip "lahir dengan tenang, sesuai tuntunan syariat"</li>
                  <li>Ibu akan ditangani oleh tenaga kesehatan perempuan, mulai dari dokter spesialis kebidanan dan kandungan, bidan, hingga perawat pendamping</li>
                  <li>Menjaga aspek aurat dan privasi secara optimal</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2 text-foreground">Lingkungan Spiritual:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Suasana dibuat tenang dengan lantunan dzikir, doa, dan ayat suci Al-Qur'an</li>
                  <li>Mendukung ibu agar lebih rileks dan fokus menghadapi momen kelahiran</li>
                  <li>Pendampingan spiritual selama persalinan</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2 text-foreground">Lingkup Layanan:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Persalinan normal dan caesar syari</li>
                  <li>Ruang bersalin privat berstandar rumah sakit Islam</li>
                  <li>Bimbingan doa dan dzikir menjelang persalinan</li>
                  <li>Keluarga dapat berperan aktif dalam proses ini</li>
                  <li>Suami diperkenankan mendampingi istri untuk memberikan dukungan emosional dan spiritual, sesuai dengan adab dan etika syariat Islam</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Detail Informasi</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Lokasi</h4>
                      <p className="text-muted-foreground">Gedung B Lantai 1, Ruang Bersalin</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Jam Operasional</h4>
                      <p className="text-muted-foreground">24 Jam (Siaga Penuh)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Kontak</h4>
                      <p className="text-muted-foreground">(0370) 987654</p>
                      <p className="text-muted-foreground">persalinan@rsisitihajar.ac.id</p>
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
                        <span className="ml-2 text-muted-foreground">4.9 (215 ulasan)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Fasilitas Tambahan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                      <h4 className="font-medium text-foreground">Kamar Keluarga</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Kamar nyaman untuk keluarga pasien</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                      <h4 className="font-medium text-foreground">Konseling</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Sesi konseling pra dan pasca persalinan</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                      <h4 className="font-medium text-foreground">Monitoring 24/7</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Pemantauan terus-menerus untuk ibu dan bayi</p>
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
                          <h4 className="font-medium text-foreground">dr. Dewi Kartika, Sp.OG</h4>
                          <p className="text-sm text-muted-foreground">Spesialis Obstetri & Ginekologi</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-muted-foreground ml-1">4.9</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-3 border-primary/30 dark:border-emerald-500/50 text-primary dark:text-emerald-400 hover:bg-primary/5 dark:hover:bg-emerald-500/10">
                        <Link href="/doctors/3">Lihat Profil</Link>
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