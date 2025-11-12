import PackageDetailClient from './package-detail-client';

// Data dummy untuk detail paket
const packageDetails = {
  id: 1,
  name: "Paket Basic Check Up",
  price: 250000,
  discountPrice: 350000,
  description: "Pemeriksaan dasar untuk mengetahui kondisi kesehatan umum. Cocok untuk pemeriksaan kesehatan rutin dan deteksi dini gangguan kesehatan.",
  category: "Laboratorium",
  icon: "Syringe",
  duration: "1-2 hari",
  preparation: "Puasa minimal 8 jam sebelum pemeriksaan",
  includedTests: [
    "Hemoglobin",
    "Jumlah darah lengkap (CBC)",
    "Gula darah puasa",
    "Kolesterol total",
    "Fungsi hati (SGOT/SGPT)",
    "Tekanan darah",
    "Tinggi dan berat badan"
  ],
  additionalBenefits: [
    "Konsultasi dokter umum",
    "Rekomendasi kesehatan",
    "Hasil dalam 24 jam",
    "Laporan digital"
  ],
  suitableFor: [
    "Pemeriksaan rutin tahunan",
    "Persiapan kerja",
    "Deteksi dini penyakit"
  ],
  popularity: 95
};

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pkg = packageDetails; // Dalam implementasi sebenarnya, ini akan diambil dari params

  return <PackageDetailClient pkg={pkg} />;
}