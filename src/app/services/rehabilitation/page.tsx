import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  WavesLadder,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText,
  Search
} from "lucide-react";
import Link from "next/link";

export default function RehabilitationServicePage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg shadow border border-border">
          {/* Service Header */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src="/placeholder-rehabilitation.jpg" 
              alt="Rehabilitasi Medik" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 dark:from-emerald-700/80 dark:to-teal-800/80 flex items-end p-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <WavesLadder className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Rehabilitasi Medik</h1>
                  <p className="mt-2 opacity-90 text-white">Layanan pemulihan fungsi tubuh setelah cedera atau operasi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Form Pencarian Terapi */}
                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Search className="h-5 w-5 mr-2 text-emerald-600" />
                      Cari Terapi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="therapy-search" className="text-sm font-medium text-foreground mb-1 block">Jenis Terapi</label>
                        <Input
                          id="therapy-search"
                          type="text"
                          placeholder="Cari jenis terapi..."
                          className="bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground py-3 transition-all duration-200 border-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] border-input dark:border-gray-700 focus:shadow-none focus:transform focus:translate-x-[2px] focus:translate-y-[2px] focus:border-emerald-500"
                        />
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]">
                        Cari Terapi
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tentang Layanan Rehabilitasi Medik</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      RS Islam Siti Hajar Mataram menghadirkan layanan Rehabilitasi Medik sebagai bagian 
                      dari upaya komprehensif dalam proses pemulihan pasien. Tujuan utama layanan ini adalah 
                      memulihkan fungsi tubuh yang menurun akibat penyakit, cedera, atau kondisi pascaoperasi, 
                      sehingga pasien dapat kembali beraktivitas secara mandiri dan optimal.
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-muted-foreground">
                        Layanan Rehabilitasi Medik kami ditangani oleh dokter spesialis kedokteran fisik 
                        dan rehabilitasi yang berpengalaman, didukung oleh tim fisioterapis, okupasi terapis, 
                        dan terapis wicara profesional. Dengan pendekatan terpadu, kami merancang program 
                        terapi sesuai kebutuhan individu, berdasarkan evaluasi menyeluruh terhadap kondisi 
                        fisik dan kemampuan fungsional pasien.
                      </p>
                      
                      <p className="text-muted-foreground">
                        Fasilitas Rehabilitasi Medik dilengkapi dengan alat terapi berteknologi modern, 
                        ruang latihan yang nyaman, serta suasana yang mendukung semangat pemulihan pasien. 
                        Kami juga mengedepankan aspek pendampingan spiritual dan motivasi psikologis, agar 
                        pasien tidak hanya pulih secara fisik, tetapi juga kuat secara mental dan emosional.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Jenis Terapi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Fisioterapi Muskuloskeletal</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Terapi untuk gangguan otot, tulang, dan sendi</li>
                          <li>• Pemulihan fungsi gerak</li>
                          <li>• Penanganan nyeri otot dan sendi</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Rehabilitasi Pascastroke</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Memulihkan kekuatan setelah stroke</li>
                          <li>• Meningkatkan koordinasi gerak</li>
                          <li>• Membantu pemulihan kemampuan bergerak</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Terapi Cedera Olahraga</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Mempercepat penyembuhan cedera olahraga</li>
                          <li>• Mencegah kekambuhan cedera</li>
                          <li>• Pemulihan fungsi otot dan sendi</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Terapi Pascaoperasi</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Membantu pemulihan fungsi tubuh setelah tindakan bedah</li>
                          <li>• Mencegah komplikasi pascaoperasi</li>
                          <li>• Mempercepat proses penyembuhan</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Terapi Anak (Pediatric Therapy)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Untuk anak dengan keterlambatan tumbuh kembang</li>
                          <li>• Gangguan motorik dan koordinasi</li>
                          <li>• Pendekatan khusus untuk anak-anak</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Terapi Nyeri (Pain Management)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Dengan modalitas modern</li>
                          <li>• Pendekatan holistik untuk penanganan nyeri</li>
                          <li>• Meningkatkan kualitas hidup pasien</li>
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
                          <h4 className="font-semibold text-foreground">Tim Profesional</h4>
                          <p className="text-sm text-muted-foreground">Ditangani oleh fisioterapis dan terapis berlisensi</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Peralatan Lengkap</h4>
                          <p className="text-sm text-muted-foreground">Menggunakan peralatan rehabilitasi modern</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Program Terapi</h4>
                          <p className="text-sm text-muted-foreground">Program terapi disesuaikan dengan kebutuhan pasien</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Pemulihan Optimal</h4>
                          <p className="text-sm text-muted-foreground">Membantu pemulihan fungsi tubuh secara optimal</p>
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
                      <span className="ml-2 font-medium text-foreground">4.7 dari 5</span>
                      <span className="ml-2 text-muted-foreground">(150 ulasan)</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Agus Santoso</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Terapi yang diberikan sangat membantu pemulihan pasca operasi. Fisioterapisnya sangat profesional.</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Dewi Lestari</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Program terapi sangat terstruktur. Saya merasakan peningkatan signifikan dalam mobilitas saya.</p>
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
                          <p className="text-muted-foreground">07:00 - 16:00 WITA (Senin - Sabtu)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Lokasi</p>
                          <p className="text-muted-foreground">Lantai 3, RSI Siti Hajar Mataram</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <Phone className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Kontak</p>
                          <p className="text-muted-foreground">(0370) 623xxx</p>
                        </div>
                      </div>
                      
                      <Button 
                        asChild 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                      >
                        <Link href="/appointment">
                          <Calendar className="h-4 w-4 mr-2" />
                          Buat Janji
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        asChild 
                        className="w-full text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 py-2 transition-all duration-200 font-medium bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]"
                      >
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