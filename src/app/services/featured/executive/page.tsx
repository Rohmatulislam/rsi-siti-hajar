import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  HeartPulse,
  Users,
  Calendar,
  MapPin,
  Clock,
  Stethoscope,
  FileText,
  Star,
  ChevronRight
} from 'lucide-react';
import { getExecutiveDoctors } from '@/lib/executive/executive-service';
import ExecutiveSpecializations from './executive-specializations';
import { initializeExecutiveSystem } from '@/lib/executive/executive-init';

// Inisialisasi sistem executive saat halaman dimuat
if (typeof window === 'undefined') { // Hanya di sisi server
  initializeExecutiveSystem();
}

async function ExecutivePage() {
  // Dalam implementasi sebenarnya, kita bisa mendapatkan data dokter untuk menampilkan informasi tambahan
  // const doctors = await getExecutiveDoctors();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-hidden pt-16">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[50vh] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: "url('/images/bener/baner-unggulan.jpg')" }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-emerald-900/50 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Poliklinik Eksekutif
            </h1>
            <p className="text-lg text-emerald-100 mb-6">
              Pelayanan cepat, nyaman, dan personal bagi pasien yang aktif
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Pelayanan rawat jalan premium tanpa antre panjang</span>
              </div>
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Jadwal konsultasi fleksibel</span>
              </div>
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Ruang tunggu eksklusif</span>
              </div>
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-emerald-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Ditangani dokter spesialis pilihan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 180"
            className="w-full h-[90px] text-white fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,112C672,107,768,149,864,160C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,180L0,180Z" />
          </svg>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="absolute inset-0">
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/40 blur-3xl rounded-full"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="bg-white/80 backdrop-blur-lg border border-emerald-100 shadow-lg rounded-3xl p-6 md:p-10">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Pilih Spesialisasi Anda</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Temukan dokter spesialis yang sesuai dengan kebutuhan kesehatan Anda.
                Kami menyediakan layanan konsultasi dengan dokter terbaik di setiap bidang.
              </p>
            </div>

            <ExecutiveSpecializations />

            <div className="mt-12 pt-8 border-t border-emerald-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Layanan Penunjang Terintegrasi Digital</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="font-medium text-gray-800">Laboratorium</span>
                  </div>
                  <p className="text-sm text-gray-600">Pemeriksaan darah, urine, dan berbagai tes laboratorium dengan hasil cepat.</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <HeartPulse className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="font-medium text-gray-800">Radiologi</span>
                  </div>
                  <p className="text-sm text-gray-600">Pemeriksaan X-ray, USG, CT Scan, dan MRI dengan peralatan modern.</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <Stethoscope className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="font-medium text-gray-800">Farmasi</span>
                  </div>
                  <p className="text-sm text-gray-600">Obat sesuai resep dokter tersedia secara langsung di apotek internal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

export default ExecutivePage;