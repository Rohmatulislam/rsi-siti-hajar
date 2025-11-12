import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bed,
  User,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText,
  Search
} from "lucide-react";
import Link from "next/link";

export default function InpatientServicePage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-lg shadow border border-border">
          {/* Service Header */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src="/placeholder-inpatient.jpg" 
              alt="Rawat Inap" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 dark:from-emerald-700/80 dark:to-teal-800/80 flex items-end p-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <Bed className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Rawat Inap</h1>
                  <p className="mt-2 opacity-90 text-white">Layanan perawatan pasien yang membutuhkan perawatan intensif di rumah sakit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Service Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Form Pencarian Kamar */}
                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Search className="h-5 w-5 mr-2 text-emerald-600" />
                      Cari Kamar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="room-search" className="text-sm font-medium text-foreground mb-1 block">Jenis Kamar</label>
                        <Input
                          id="room-search"
                          type="text"
                          placeholder="Cari jenis kamar..."
                          className="bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground py-3 transition-all duration-200 border-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] border-input dark:border-gray-700 focus:shadow-none focus:transform focus:translate-x-[2px] focus:translate-y-[2px] focus:border-emerald-500"
                        />
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-all duration-200 border-2 border-emerald-700 shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] active:shadow-none active:transform active:translate-x-[2px] active:translate-y-[2px]">
                        Cari Kamar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tentang Layanan Rawat Inap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Layanan Rawat Inap RS Islam Siti Hajar Mataram dirancang untuk memberikan pengalaman 
                      perawatan yang nyaman, aman, dan berorientasi pada kebutuhan pasien dan keluarga. 
                      Kami memahami bahwa masa perawatan di rumah sakit merupakan waktu yang penting bagi 
                      proses penyembuhan, sehingga setiap aspek pelayanan kami fokuskan pada kenyamanan, 
                      keselamatan, dan ketenangan spiritual pasien.
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-muted-foreground">
                        Pasien rawat inap akan mendapatkan pengawasan medis secara menyeluruh oleh dokter 
                        spesialis dan perawat profesional selama 24 jam, dengan dukungan tim multidisiplin 
                        yang bekerja secara terkoordinasi. Kami menerapkan standar keselamatan pasien sesuai 
                        ketentuan Kementerian Kesehatan dan prinsip mutu pelayanan berkelanjutan.
                      </p>
                      
                      <p className="text-muted-foreground">
                        Selama dirawat, pasien akan merasakan sentuhan pelayanan Islami, seperti pembacaan 
                        doa, pendampingan rohani, serta pelayanan penuh kasih sesuai nilai-nilai Islam. 
                        Kami percaya bahwa kesembuhan tidak hanya berasal dari pengobatan medis, tetapi juga 
                        dari ketenangan jiwa dan doa yang tulus.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Jenis Kamar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Kelas VIP dan VVIP</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Ruang eksklusif dengan fasilitas lengkap</li>
                          <li>• Kamar mandi dalam</li>
                          <li>• Fasilitas untuk kenyamanan maksimal pasien dan keluarga</li>
                          <li>• Pelayanan personal</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Kelas I</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Ruang perawatan nyaman, bersih, dan memenuhi standar keselamatan</li>
                          <li>• Kamar mandi dalam</li>
                          <li>• Privasi pasien terjaga</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Kelas II</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Ruang perawatan nyaman, bersih, dan memenuhi standar keselamatan</li>
                          <li>• Kamar mandi luar</li>
                          <li>• Privasi pasien terjaga</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Kelas III</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Ruang perawatan nyaman, bersih, dan memenuhi standar keselamatan</li>
                          <li>• Kamar mandi luar</li>
                          <li>• Privasi pasien terjaga</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Ruang Isolasi</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Untuk pasien yang membutuhkan pengawasan ketat</li>
                          <li>• Peralatan medis canggih</li>
                          <li>• Protokol khusus untuk mencegah penularan</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Perawatan Intensif (ICU)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Untuk pasien yang membutuhkan pengawasan ketat</li>
                          <li>• Peralatan medis canggih</li>
                          <li>• Tim medis khusus 24 jam</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted dark:bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Ruang Bersalin dan Perawatan Ibu & Bayi</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Dirancang khusus dengan pendekatan ramah ibu dan bayi</li>
                          <li>• Mendukung program rooming in</li>
                          <li>• Fasilitas untuk kenyamanan ibu dan bayi</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-foreground border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Prosedur Pendaftaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Kunjungi bagian pendaftaran rawat inap</li>
                      <li>Bawa surat rujukan (jika ada) dan kartu identitas</li>
                      <li>Isi formulir pendaftaran</li>
                      <li>Lakukan pembayaran administrasi</li>
                      <li>Pasien dipersilakan ke kamar sesuai kelas yang dipilih</li>
                    </ol>
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
                      <span className="ml-2 text-muted-foreground">(240 ulasan)</span>
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
                        <p className="text-muted-foreground">Perawatnya sangat ramah dan profesional. Kamar bersih dan nyaman untuk beristirahat.</p>
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
                        <p className="text-muted-foreground">Lingkungan rumah sakit tenang dan mendukung proses penyembuhan. Makanan juga enak.</p>
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
                          <p className="text-muted-foreground">24 Jam</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                        <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">Lokasi</p>
                          <p className="text-muted-foreground">Lantai 2-5, RSI Siti Hajar Mataram</p>
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