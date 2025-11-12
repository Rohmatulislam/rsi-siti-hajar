import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  HeartPulse, 
  Syringe, 
  Activity, 
  Microscope, 
  Scan,
  CalendarCheck,
  Star,
  Building
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      title: "Rawat Inap",
      description: "Fasilitas perawatan jangka panjang dengan kamar nyaman dan perawatan medis intensif",
      icon: Building,
      href: "/services/inpatient",
      category: "instalasi"
    },
    {
      title: "Rawat Jalan",
      description: "Pelayanan poliklinik dengan berbagai spesialisasi dokter dan fasilitas lengkap",
      icon: Stethoscope,
      href: "/services/outpatient",
      category: "instalasi"
    },
    {
      title: "Farmasi 24 Jam",
      description: "Layanan apotek yang buka 24 jam dengan obat-obatan lengkap dan konsultasi apoteker",
      icon: Activity,
      href: "/services/pharmacy",
      category: "instalasi"
    },
    {
      title: "Laboratorium",
      description: "Fasilitas laboratorium medis lengkap dengan hasil yang akurat dan cepat",
      icon: Microscope,
      href: "/services/laboratory",
      category: "instalasi"
    },
    {
      title: "Radiologi",
      description: "Pelayanan pencitraan medis dengan teknologi terkini untuk diagnosis yang tepat",
      icon: Scan,
      href: "/services/radiology",
      category: "instalasi"
    },
    {
      title: "Rehabilitasi Medik",
      description: "Program rehabilitasi untuk pemulihan pasca rawat inap atau cedera",
      icon: HeartPulse,
      href: "/services/rehabilitation",
      category: "instalasi"
    },
    {
      title: "MCU (Medical Check Up)",
      description: "Pemeriksaan kesehatan menyeluruh untuk deteksi dini gangguan kesehatan",
      icon: CalendarCheck,
      href: "/services/mcu",
      category: "instalasi"
    }
  ];

  const featuredServices = [
    {
      title: "Bedah Minimal Invasif",
      description: "Prosedur pembedahan dengan sayatan kecil untuk meminimalkan trauma dan mempercepat pemulihan",
      icon: Syringe,
      href: "/services/featured/minimal-invasive",
      category: "unggulan"
    },
    {
      title: "ESWL (Extracorporeal Shock Wave Lithotripsy)",
      description: "Terapi non-bedah untuk menghancurkan batu ginjal dan batu saluran kemih menggunakan gelombang kejut",
      icon: Microscope,
      href: "/services/featured/eswl",
      category: "unggulan"
    },
    {
      title: "Persalinan Syarii",
      description: "Pelayanan persalinan yang menggabungkan aspek medis dan spiritual sesuai prinsip syariah",
      icon: HeartPulse,
      href: "/services/featured/delivery",
      category: "unggulan"
    },
    {
      title: "Layanan Eksekutif",
      description: "Pelayanan khusus dengan fasilitas premium untuk kenyamanan maksimal pasien dan keluarga",
      icon: Star,
      href: "/services/featured/executive",
      category: "unggulan"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Layanan Kesehatan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Kami menyediakan berbagai layanan kesehatan berkualitas tinggi dengan fasilitas modern 
            dan tenaga medis profesional
          </p>
          
          <div className="max-w-3xl mx-auto">
            <Link href="/packages">
              <Card className="bg-emerald-50 border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">Cari Paket Pemeriksaan</h3>
                      <p className="text-emerald-600">Temukan paket pemeriksaan yang sesuai dengan kebutuhan kesehatan Anda</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Cari Paket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Instalasi Services */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Instalasi Pelayanan</h2>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Dasar
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="overflow-hidden bg-card text-foreground border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg mr-4">
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <CardTitle className="text-foreground">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Button asChild variant="outline" className="w-full border-primary/30 dark:border-emerald-500/50 text-primary dark:text-emerald-400 hover:bg-primary/5 dark:hover:bg-emerald-500/10">
                      <Link href={service.href}>Lihat Detail</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Services */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Layanan Unggulan</h2>
            <Badge variant="default" className="bg-amber-500 text-amber-50">
              Unggulan
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="overflow-hidden bg-card text-foreground border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mr-4">
                        <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle className="text-foreground">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Button asChild variant="outline" className="w-full border-amber-500/30 dark:border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-500/10">
                      <Link href={service.href}>Lihat Detail</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild variant="default" className="bg-amber-500 hover:bg-amber-600 text-amber-50">
              <Link href="/services/featured">
                Lihat Semua Layanan Unggulan
                <Star className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}