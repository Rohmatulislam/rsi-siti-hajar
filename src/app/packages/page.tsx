'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Syringe, 
  Waves, 
  MapPin,
  Clock,
  Phone,
  Search,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { useState } from 'react';

// Data untuk semua paket layanan
const allPackages = [
  // Laboratorium
  {
    id: 1,
    name: "Paket Basic Check Up",
    price: 250000,
    discountPrice: 350000,
    description: "Pemeriksaan dasar untuk mengetahui kondisi kesehatan umum",
    category: "Laboratorium",
    tests: [
      "Hemoglobin",
      "Jumlah darah lengkap (CBC)",
      "Gula darah puasa",
      "Kolesterol total",
      "Fungsi hati (SGOT/SGPT)"
    ],
    icon: <Syringe className="h-6 w-6" />,
    duration: "1-2 hari",
    popularity: 95
  },
  {
    id: 2,
    name: "Paket Silver Check Up",
    price: 450000,
    discountPrice: 650000,
    description: "Pemeriksaan komprehensif untuk deteksi dini berbagai penyakit",
    category: "Laboratorium",
    tests: [
      "Paket Basic Check Up +",
      "Fungsi ginjal (Creatinine, Ureum)",
      "Asam urat",
      "Trigliserida",
      "HDL dan LDL"
    ],
    icon: <Syringe className="h-6 w-6" />,
    duration: "1-2 hari",
    popularity: 85
  },
  // Radiologi
  {
    id: 3,
    name: "Paket X-Ray Dasar",
    price: 100000,
    discountPrice: 150000,
    description: "Pemeriksaan X-Ray dasar untuk tulang dan dada",
    category: "Radiologi",
    tests: [
      "X-Ray Thoraks AP",
      "X-Ray Tulang (satu area)",
      "Interpretasi dokter spesialis"
    ],
    icon: <Waves className="h-6 w-6" />,
    duration: "30 menit",
    popularity: 90
  },
  {
    id: 4,
    name: "Paket USG Kehamilan",
    price: 250000,
    discountPrice: 350000,
    description: "Pemeriksaan USG untuk ibu hamil dengan 4D technology",
    category: "Radiologi",
    tests: [
      "USG Kehamilan (4D)",
      "Pemantauan detak jantung janin",
      "Pemeriksaan plasenta",
      "Konsultasi dokter kandungan"
    ],
    icon: <Waves className="h-6 w-6" />,
    duration: "30-45 menit",
    popularity: 80
  },
  // Tambahkan paket-paket tambahan
  {
    id: 5,
    name: "Paket Gold Check Up",
    price: 750000,
    discountPrice: 1100000,
    description: "Pemeriksaan lengkap untuk deteksi dini berbagai penyakit serius",
    category: "Laboratorium",
    tests: [
      "Paket Silver Check Up +",
      "TSH, T3, T4",
      "Tumor marker (AFP, CEA)",
      "HbA1c",
      "Protein total dan albumin"
    ],
    icon: <Syringe className="h-6 w-6" />,
    duration: "1-2 hari",
    popularity: 75
  },
  {
    id: 6,
    name: "Paket CT-Scan Kepala",
    price: 1500000,
    discountPrice: 2000000,
    description: "Pemeriksaan CT-Scan kepala dengan kontras",
    category: "Radiologi",
    tests: [
      "CT-Scan Kepala dengan kontras",
      "3D Reconstruction",
      "Interpretasi dokter spesialis",
      "Konsultasi neurologi"
    ],
    icon: <Waves className="h-6 w-6" />,
    duration: "30-60 menit",
    popularity: 70
  },
  {
    id: 7,
    name: "Paket Diamond Check Up",
    price: 1200000,
    discountPrice: 1800000,
    description: "Paket komprehensif lengkap dengan pemeriksaan lanjutan",
    category: "Laboratorium",
    tests: [
      "Paket Gold Check Up +",
      "Cardiac marker",
      "Vitamin D",
      "Hormon reproduksi",
      "Elektrolit (Na, K, Cl)"
    ],
    icon: <Syringe className="h-6 w-6" />,
    duration: "2-3 hari",
    popularity: 65
  },
  {
    id: 8,
    name: "Paket MRI Otak",
    price: 2000000,
    discountPrice: 2500000,
    description: "Pemeriksaan MRI otak untuk diagnosis presisi",
    category: "Radiologi",
    tests: [
      "MRI Otak dengan kontras",
      "Functional MRI",
      "Interpretasi dokter spesialis",
      "Konsultasi neurologi"
    ],
    icon: <Waves className="h-6 w-6" />,
    duration: "45-60 menit",
    popularity: 60
  }
];

// Data kategori layanan
const categories = ["Semua", "Laboratorium", "Radiologi"];

export default function AllPackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity"); // options: popularity, price-low, price-high

  // Fungsi untuk memfilter paket berdasarkan kategori dan pencarian
  let filteredPackages = allPackages.filter(pkg => {
    const matchesCategory = selectedCategory === "Semua" || pkg.category === selectedCategory;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.tests.some(test => test.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Fungsi untuk mengurutkan paket
  if (sortBy === "price-low") {
    filteredPackages.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredPackages.sort((a, b) => b.price - a.price);
  } else if (sortBy === "popularity") {
    filteredPackages.sort((a, b) => b.popularity - a.popularity);
  }

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cari Paket Pemeriksaan</h1>
            <p className="text-xl text-white/90">
              Temukan paket pemeriksaan yang sesuai dengan kebutuhan kesehatan Anda
            </p>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari paket pemeriksaan..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`text-base px-4 py-2 cursor-pointer ${
                    selectedCategory === category 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort and Results Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Menampilkan {filteredPackages.length} dari {allPackages.length} paket
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Urutkan:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popularity">Popularitas</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
              </select>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-emerald-100 rounded-lg p-2">
                      {pkg.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {pkg.category}
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
                    <ul className="text-xs text-gray-600 max-h-20 overflow-y-auto">
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => viewDetail(pkg)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
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

      {/* Info Bar */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Butuh Bantuan?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Hubungi kami jika Anda membutuhkan informasi lebih lanjut tentang paket pemeriksaan yang tersedia
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
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
                  <p className="font-medium">RSI Siti Hajar Mataram</p>
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
      </div>
    </div>
  );
}