'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Syringe, 
  MapPin,
  Clock,
  Phone,
  Calendar,
  Users,
  CheckCircle,
  ShoppingCart,
  Waves
} from 'lucide-react';
import Link from 'next/link';

// Tipe untuk detail paket
interface PackageDetail {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  category: string;
  icon: string; // Kita akan mengonversi string menjadi ikon
  duration: string;
  preparation: string;
  includedTests: string[];
  additionalBenefits: string[];
  suitableFor: string[];
  popularity: number;
}

interface PackageDetailClientProps {
  pkg: PackageDetail;
}

export default function PackageDetailClient({ pkg }: PackageDetailClientProps) {
  // Fungsi untuk mendapatkan ikon berdasarkan string
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Syringe':
        return <Syringe className="h-8 w-8" />;
      case 'Waves':
        return <Waves className="h-8 w-8" />;
      default:
        return <Syringe className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-6">
              <Link href="/packages" className="inline-flex items-center text-white/80 hover:text-white">
                <span className="mr-2">←</span>
                Kembali ke Semua Paket
              </Link>
            </nav>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-white/20 p-4 rounded-xl">
                {getIcon(pkg.icon)}
              </div>
              <div>
                <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30">
                  {pkg.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{pkg.name}</h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">Rp {pkg.price.toLocaleString()}</span>
                  <span className="text-lg text-white/70 line-through">Rp {pkg.discountPrice.toLocaleString()}</span>
                  <span className="text-emerald-200 bg-emerald-800/50 px-2 py-1 rounded text-sm ml-2">
                    Hemat Rp {(pkg.discountPrice - pkg.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi Paket</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Durasi: {pkg.duration}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pemeriksaan yang Termasuk</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.includedTests.map((test, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manfaat Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.additionalBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Untuk Siapa Paket Ini?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.suitableFor.map((target, index) => (
                      <li key={index} className="flex items-start">
                        <Users className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{target}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Persiapan Sebelum Pemeriksaan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{pkg.preparation}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Paket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Harga Normal</span>
                      <span className="line-through text-gray-500">Rp {pkg.discountPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Harga Spesial</span>
                      <span className="text-emerald-600">Rp {pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Tambahkan ke Keranjang
                      </Button>
                      
                      <Button variant="outline" className="w-full mt-3 py-6 text-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                        <Calendar className="h-5 w-5 mr-2" />
                        Pesan Sekarang
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                      <span>Durasi: {pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                      <span>Laboratorium RSI Siti Hajar</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-emerald-500" />
                      <span>(0370) 623xxx</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}