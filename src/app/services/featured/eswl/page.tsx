import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Waves,
  Syringe,
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  User,
  Stethoscope,
  Search
} from "lucide-react";
import Link from "next/link";

export default function ESWLPage() {
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
              <span className="text-white font-medium">ESWL</span>
            </nav>
            <h1 className="text-xl font-bold text-white">ESWL (Extracorporeal Shock Wave Lithotripsy)</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            asChild 
            variant="outline" 
            className="mr-4 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-2 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Link href="/services/featured">← Kembali</Link>
          </Button>
        </div>

        {/* Form Pencarian Informasi ESWL */}
        <Card className="overflow-hidden bg-card text-foreground border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Search className="h-5 w-5 mr-2 text-emerald-600" />
              Cari Informasi ESWL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="eswl-info-search" className="text-sm font-medium text-foreground mb-1 block">Cari Informasi</label>
                <Input
                  id="eswl-info-search"
                  type="text"
                  placeholder="Cari informasi tentang ESWL..."
                  className="bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground py-3 transition-all duration-200 border-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] border-input dark:border-gray-700 focus:shadow-none focus:transform focus:translate-x-[2px] focus:translate-y-[2px] focus:border-emerald-500"
                />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]">
                Cari Informasi
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-card text-foreground border-border mb-8">
          <div className="w-full h-48 overflow-hidden">
            <img 
              src="/placeholder.jpg" 
              alt="ESWL" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg mr-3">
                <Waves className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground mb-1">ESWL (Extracorporeal Shock Wave Lithotripsy)</CardTitle>
                <p className="text-sm text-muted-foreground">Terapi non-bedah untuk menghancurkan batu ginjal dan batu saluran kemih menggunakan gelombang kejut</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Tentang Layanan</h3>
                <p className="text-muted-foreground mb-4">
                  Extracorporeal Shockwave Lithotripsy (ESWL) adalah salah satu layanan unggulan di RS Islam Siti Hajar Mataram 
                  yang menawarkan penanganan batu saluran kemih tanpa operasi. ESWL menggunakan gelombang kejut (shockwave) 
                  berenergi tinggi yang difokuskan langsung pada batu ginjal atau batu saluran kemih melalui kulit.
                </p>
                
                <h4 className="font-medium mb-2 text-foreground">Keunggulan ESWL:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Metode non-bedah tanpa sayatan</li>
                  <li>Minim rasa sakit</li>
                  <li>Pemulihan yang cepat</li>
                  <li>Prosedur rawat jalan</li>
                  <li>Pasien dapat kembali beraktivitas dalam waktu singkat</li>
                  <li>Cocok untuk pasien dengan kondisi medis tertentu</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2 text-foreground">Prosedur ESWL:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Pasien akan menjalani pemeriksaan menyeluruh seperti USG, rontgen, atau CT-scan</li>
                  <li>Selama tindakan, pasien akan berbaring di atas meja khusus</li>
                  <li>Gelombang kejut diberikan selama kurang lebih 30–60 menit</li>
                  <li>Setelah prosedur, pasien dianjurkan untuk banyak minum air putih</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Detail Informasi</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Lokasi</h4>
                      <p className="text-muted-foreground">Gedung A Lantai 2, Ruang Urologi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Jam Operasional</h4>
                      <p className="text-muted-foreground">Senin - Sabtu: 07:00 - 15:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Kontak</h4>
                      <p className="text-muted-foreground">(0370) 654321</p>
                      <p className="text-muted-foreground">urologi@rsisitihajar.ac.id</p>
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
                        <span className="ml-2 text-muted-foreground">4.8 (96 ulasan)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Dokter Spesialis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2].map((item) => (
                  <Card key={item} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-3" />
                        <div>
                          <h4 className="font-medium text-foreground">dr. Siti Nurhaliza, Sp.U</h4>
                          <p className="text-sm text-muted-foreground">Spesialis Urologi</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-muted-foreground ml-1">4.8</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-1.5 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                      >
                        <Link href="/doctors/2">Lihat Profil</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button 
                asChild 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Link href="/appointment">Buat Janji Temu</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-2 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Link href="/services/featured">Lihat Layanan Lainnya</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}