'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Syringe,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  FileText,
  Check,
  Search,
  ShoppingCart,
  Eye
} from "lucide-react";
import Link from "next/link";
import { LaboratoryAppointmentForm } from "@/components/appointment/laboratory-appointment-form";
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Data untuk paket-paket laboratorium
const laboratoryPackages = [
  {
    id: 1,
    name: "Paket Basic Check Up",
    price: 250000,
    discountPrice: 350000,
    description: "Pemeriksaan dasar untuk mengetahui kondisi kesehatan umum",
    tests: [
      "Hemoglobin",
      "Jumlah darah lengkap (CBC)",
      "Gula darah puasa",
      "Kolesterol total",
      "Fungsi hati (SGOT/SGPT)"
    ],
    duration: "1-2 hari",
    popularity: 95
  },
  {
    id: 2,
    name: "Paket Silver Check Up",
    price: 450000,
    discountPrice: 650000,
    description: "Pemeriksaan komprehensif untuk deteksi dini berbagai penyakit",
    tests: [
      "Paket Basic Check Up +",
      "Fungsi ginjal (Creatinine, Ureum)",
      "Asam urat",
      "Trigliserida",
      "HDL dan LDL"
    ],
    duration: "1-2 hari",
    popularity: 85
  },
  {
    id: 3,
    name: "Paket Gold Check Up",
    price: 750000,
    discountPrice: 1100000,
    description: "Pemeriksaan lengkap untuk deteksi dini berbagai penyakit serius",
    tests: [
      "Paket Silver Check Up +",
      "TSH, T3, T4",
      "Tumor marker (AFP, CEA)",
      "HbA1c",
      "Protein total dan albumin"
    ],
    duration: "1-2 hari",
    popularity: 75
  },
  {
    id: 4,
    name: "Paket Diamond Check Up",
    price: 1200000,
    discountPrice: 1800000,
    description: "Paket komprehensif lengkap dengan pemeriksaan lanjutan",
    tests: [
      "Paket Gold Check Up +",
      "Cardiac marker",
      "Vitamin D",
      "Hormon reproduksi",
      "Elektrolit (Na, K, Cl)"
    ],
    duration: "2-3 hari",
    popularity: 65
  },
  {
    id: 5,
    name: "Paket Kehamilan",
    price: 300000,
    discountPrice: 400000,
    description: "Pemeriksaan rutin untuk ibu hamil",
    tests: [
      "Hemoglobin",
      "Golongan darah",
      "HbsAg",
      "VDRL",
      "Gula darah",
      "USG Kehamilan"
    ],
    duration: "1 hari",
    popularity: 80
  },
  {
    id: 6,
    name: "Paket Pria Dewasa",
    price: 500000,
    discountPrice: 700000,
    description: "Paket khusus untuk pria dewasa",
    tests: [
      "Paket Basic Check Up +",
      "PSA (Prostate Specific Antigen)",
      "Tumor marker (AFP, CEA)",
      "Hormon reproduksi",
      "Asam urat"
    ],
    duration: "1-2 hari",
    popularity: 70
  },
  {
    id: 7,
    name: "Paket Wanita Dewasa",
    price: 600000,
    discountPrice: 850000,
    description: "Paket khusus untuk wanita dewasa",
    tests: [
      "Paket Basic Check Up +",
      "Pap smear",
      "Mammografi",
      "Hormon reproduksi",
      "Tumor marker (CA-125, CA 19-9)"
    ],
    duration: "2-3 hari",
    popularity: 60
  },
  {
    id: 8,
    name: "Paket Diabetes",
    price: 400000,
    discountPrice: 550000,
    description: "Paket khusus untuk pemantauan diabetes",
    tests: [
      "Gula darah puasa",
      "HbA1c",
      "Fungsi ginjal",
      "Lipid profile",
      "Microalbumin"
    ],
    duration: "1 hari",
    popularity: 85
  }
];

export default function LaboratoryServicePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fungsi untuk memfilter paket berdasarkan pencarian
  const filteredPackages = laboratoryPackages.filter(pkg => {
    return pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           pkg.tests.some(test => test.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Fungsi untuk menambahkan paket ke keranjang
  const addToCart = (pkg: any) => {
    console.log(`Menambahkan ${pkg.name} ke keranjang`);
    // Di sini akan ditambahkan logika untuk menambahkan ke keranjang
  };

  // Fungsi untuk melihat detail paket
  const viewDetail = (pkg: any) => {
    console.log(`Melihat detail ${pkg.name}`);
    // Di sini akan ditambahkan logika untuk melihat detail
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full mr-4">
                <Syringe className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Laboratorium</h1>
            </div>
            <p className="text-xl text-white/90 mt-4 max-w-2xl mx-auto">
              Pemeriksaan laboratorium dengan akurasi tinggi dan pelayanan terbaik di RSI Siti Hajar Mataram
            </p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-full p-2 mr-3">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jam Operasional</p>
                <p className="font-medium">06:00 - 17:00 WITA</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-full p-2 mr-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lokasi</p>
                <p className="font-medium">Lantai 1, RSI Siti Hajar Mataram</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-full p-2 mr-3">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kontak</p>
                <p className="font-medium">(0370) 623xxx</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Search Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari paket pemeriksaan laboratorium..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-emerald-100 rounded-lg p-2">
                      <Syringe className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Laboratorium
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-bold text-emerald-600">Rp {pkg.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">Rp {pkg.discountPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-gray-500">Durasi: {pkg.duration}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Pemeriksaan:</h4>
                    <ul className="text-xs text-gray-600 max-h-16 overflow-y-auto">
                      {pkg.tests.slice(0, 3).map((test, index) => (
                        <li key={index} className="truncate">{test}</li>
                      ))}
                      {pkg.tests.length > 3 && (
                        <li className="text-xs text-emerald-600">+{pkg.tests.length - 3} lainnya</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link href={`/packages/${pkg.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => addToCart(pkg)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Paket tidak ditemukan. Silakan coba kata kunci lain.</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Butuh Pemeriksaan Khusus?</h2>
              <p className="text-gray-600">
                Jika Anda membutuhkan pemeriksaan yang tidak termasuk dalam paket di atas, 
                Anda dapat memesan pemeriksaan secara individual.
              </p>
            </div>
            
            <div className="text-center">
              <p className="mb-4">Untuk pemeriksaan individual atau pendaftaran di luar paket, silakan mendaftar terlebih dahulu:</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg">
                <Link href="/sign-up">Daftar dan Buat Janji Temu</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}