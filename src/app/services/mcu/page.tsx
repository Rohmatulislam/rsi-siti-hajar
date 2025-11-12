import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Activity,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText,
  Search
} from "lucide-react";
import Link from "next/link";

export default function MCUServicePage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg shadow border border-border">
          {/* Service Header */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src="/placeholder-mcu.jpg" 
              alt="Medical Check Up" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 dark:from-emerald-700/80 dark:to-teal-800/80 flex items-end p-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <Activity className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Medical Check Up</h1>
                  <p className="mt-2 opacity-90 text-white">Pemeriksaan kesehatan menyeluruh untuk deteksi dini penyakit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Form Pencarian Paket MCU */}
                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Search className="h-5 w-5 mr-2 text-emerald-600" />
                      Cari Paket MCU
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="mcu-search" className="text-sm font-medium text-foreground mb-1 block">Jenis Pemeriksaan</label>
                        <Input
                          id="mcu-search"
                          type="text"
                          placeholder="Cari paket MCU..."
                          className="bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground py-3 transition-all duration-200 border-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] border-input dark:border-gray-700 focus:shadow-none focus:transform focus:translate-x-[2px] focus:translate-y-[2px] focus:border-emerald-500"
                        />
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]">
                        Cari Paket
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tentang Layanan Medical Check Up</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      RS Islam Siti Hajar Mataram menyediakan layanan Medical Check Up (MCU) yang dirancang 
                      untuk membantu masyarakat dalam melakukan deteksi dini terhadap berbagai penyakit dan 
                      memantau kondisi kesehatan secara menyeluruh. Dengan pemeriksaan yang komprehensif, 
                      MCU membantu Anda mengenali risiko kesehatan sejak dini agar dapat melakukan pencegahan 
                      sebelum timbul gejala atau komplikasi yang lebih serius.
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-muted-foreground">
                        Layanan Medical Check Up di RS Islam Siti Hajar Mataram dilaksanakan oleh tim dokter 
                        spesialis berpengalaman, dengan dukungan fasilitas laboratorium, radiologi, dan 
                        pemeriksaan penunjang berteknologi modern. Setiap pemeriksaan disusun secara 
                        personalized, menyesuaikan usia, jenis kelamin, gaya hidup, serta riwayat kesehatan 
                        individu atau keluarga.
                      </p>
                      
                      <p className="text-muted-foreground">
                        Seluruh proses dilakukan secara cepat, nyaman, dan terintegrasi, mulai dari pendaftaran 
                        hingga konsultasi hasil bersama dokter. Hasil MCU disajikan secara jelas dengan 
                        interpretasi medis yang mudah dipahami, sehingga pasien dapat mengetahui kondisi 
                        kesehatannya dan langkah pencegahan yang perlu dilakukan.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Paket Pemeriksaan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Dini Penyakit Jantung</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Menilai fungsi jantung</li>
                          <li>• Risiko penyakit kardiovaskular</li>
                          <li>• Pemeriksaan EKG dan lainnya</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Dini Diabetes</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Memeriksa kadar gula darah</li>
                          <li>• Fungsi metabolisme tubuh</li>
                          <li>• Pemeriksaan terkait diabetes</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Dini Penyakit Ginjal</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Mengevaluasi fungsi ginjal</li>
                          <li>• Mendeteksi gangguan sejak awal</li>
                          <li>• Pemeriksaan fungsi ginjal</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Dini Penyakit Hati</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Menilai fungsi hati</li>
                          <li>• Mendeteksi potensi gangguan hepatik</li>
                          <li>• Pemeriksaan fungsi hati</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Lengkap (Comprehensive Check Up)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Pemeriksaan menyeluruh seluruh organ tubuh</li>
                          <li>• Evaluasi kesehatan menyeluruh</li>
                          <li>• Screening berbagai penyakit</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Skrining Pranikah</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Memastikan kesiapan kesehatan pasangan sebelum menikah</li>
                          <li>• Pemeriksaan genetik dan reproduksi</li>
                          <li>• Konseling kesehatan pranikah</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Dini Kanker Laki-laki</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Meliputi pemeriksaan prostat</li>
                          <li>• Pemeriksaan testis</li>
                          <li>• Pemeriksaan organ terkait</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Deteksi Dini Kanker Perempuan</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Mencakup pemeriksaan payudara</li>
                          <li>• Pemeriksaan serviks</li>
                          <li>• Pemeriksaan organ reproduksi</li>
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
                          <h4 className="font-semibold text-foreground">Pemeriksaan Personalized</h4>
                          <p className="text-sm text-muted-foreground">Disusun menyesuaikan usia, jenis kelamin, dan riwayat kesehatan</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Peralatan Modern</h4>
                          <p className="text-sm text-muted-foreground">Menggunakan teknologi terkini</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Tim Medis Berpengalaman</h4>
                          <p className="text-sm text-muted-foreground">Dilaksanakan oleh tim dokter spesialis berpengalaman</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Proses Terintegrasi</h4>
                          <p className="text-sm text-muted-foreground">Cepat, nyaman, dan terintegrasi</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Interpretasi Mudah Dipahami</h4>
                          <p className="text-sm text-muted-foreground">Hasil MCU disajikan dengan interpretasi medis yang mudah dipahami</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-0.5">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Sentuhan Etika & Spiritualitas</h4>
                          <p className="text-sm text-muted-foreground">Pemeriksaan kesehatan sebagai bentuk ikhtiar menjaga amanah tubuh dari Allah SWT</p>
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
                      <span className="ml-2 text-muted-foreground">(320 ulasan)</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Firman Siregar</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">MCU di sini sangat lengkap dan hasilnya akurat. Dokternya juga memberikan penjelasan yang jelas.</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <div className="flex items-center mb-2">
                          <div className="bg-muted border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">Ratna Dewi</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Pelayanan MCU sangat memuaskan. Prosesnya terorganisir dengan baik dan tidak perlu menunggu lama.</p>
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
                          <p className="text-muted-foreground">07:00 - 15:00 WITA (Senin - Sabtu)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Lokasi</p>
                          <p className="text-muted-foreground">Lantai 2, RSI Siti Hajar Mataram</p>
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