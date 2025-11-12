"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  XCircle,
  CheckCircle,
  X,
  AlertTriangle
} from "lucide-react";
import { getDoctorBySlug, getDoctorById, getDoctorSchedules } from "@/lib/doctor-service";
import { Doctor, Schedule } from "@/lib/admin-types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { DoctorProfileHeader } from "@/components/doctors/detail/doctor-profile-header";
import { DoctorDetailTabs } from "@/components/doctors/detail/doctor-detail-tabs";
import { DoctorAboutSection } from "@/components/doctors/detail/doctor-about-section";
import { DoctorTreatmentSection } from "@/components/doctors/detail/doctor-treatment-section";
import { DoctorEducationSection } from "@/components/doctors/detail/doctor-education-section";
import { DoctorScheduleSection } from "@/components/doctors/detail/doctor-schedule-section";
import { BookingSection } from "@/components/doctors/detail/booking-section";
import { DoctorFeaturedServices } from "@/components/doctors/detail/doctor-featured-services";

export default function DoctorDetailPage() {
  const { slug } = useParams();
  const slugValue = Array.isArray(slug) ? slug[0] : slug;
  
  // Penanganan khusus untuk nilai 'null' atau 'undefined' dalam string
  const normalizedSlugValue = (slugValue === 'null' || slugValue === 'undefined') ? null : slugValue;
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Fungsi untuk menampilkan alert kecil di kanan atas
  const showAlertWithScroll = (alertData: { type: 'success' | 'error' | 'warning'; message: string }) => {
    setAlert(alertData);
    setShowAlert(true);
  };

  // Fungsi untuk menutup alert
  const closeAlert = () => {
    setShowAlert(false);
    setTimeout(() => {
      setAlert(null);
    }, 300);
  };

  // Auto close alert setelah 5 detik untuk success, 8 detik untuk warning/error
  useEffect(() => {
    if (alert && showAlert) {
      const timer = setTimeout(() => {
        closeAlert();
      }, alert.type === 'success' ? 5000 : 8000);

      return () => clearTimeout(timer);
    }
  }, [alert, showAlert]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('id-ID', { month: 'short' })
    };
  };

  // Data fetching
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        if (normalizedSlugValue && typeof normalizedSlugValue === 'string') {
          let doctorData = null;
          
          // Cek apakah slug adalah UUID yang valid (untuk ID)
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          
          // Jika format adalah UUID, langsung coba cari berdasarkan ID
          if (uuidRegex.test(normalizedSlugValue)) {
            try {
              doctorData = await getDoctorById(normalizedSlugValue);
            } catch (idError) {
              console.error("Error fetching doctor by ID:", idError);
            }
          } else {
            // Jika bukan UUID, coba cari berdasarkan slug
            try {
              doctorData = await getDoctorBySlug(normalizedSlugValue);
            } catch (slugError) {
              console.log(`Doctor with slug ${normalizedSlugValue} not found`);
            }
          }
          
          if (doctorData) {
            setDoctor(doctorData);
            const doctorSchedules = await getDoctorSchedules(doctorData.id);
            setSchedules(doctorSchedules);
            
            // Jika dokter diakses melalui ID tapi memiliki slug, redirect ke URL berbasis slug
            // Hanya redirect jika normalizedSlugValue adalah ID (bukan slug) dan dokter memiliki slug
            if (uuidRegex.test(normalizedSlugValue) && doctorData.slug) {
              router.replace(`/doctors/${doctorData.slug}`);
            }
          } else {
            // Jika dokter tidak ditemukan baik dengan slug maupun ID
            setDoctor(null);
          }
        } else {
          // Jika slug tidak valid, langsung atur ke status tidak ditemukan
          setDoctor(null);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    if (normalizedSlugValue) fetchDoctorData();
  }, [normalizedSlugValue, router]);

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb Skeleton */}
          <div className="px-8 pt-8 mb-6">
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Profile Header Skeleton */}
          <div className="mb-8">
            <div className="rounded-3xl overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-800">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Doctor Avatar Skeleton */}
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-200 dark:bg-emerald-700 animate-pulse"></div>
                  </div>
                  
                  {/* Doctor Info Skeleton */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div>
                        <div className="h-8 w-64 bg-slate-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                        <div className="h-6 w-48 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="h-10 w-24 bg-slate-200 dark:bg-gray-700 rounded-lg animate-pulse mt-4 lg:mt-0"></div>
                    </div>
                    
                    {/* Ratings and Stats Skeleton */}
                    <div className="flex items-center mb-4">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-gray-700 rounded mr-6 animate-pulse"></div>
                      <div className="h-4 w-32 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Additional Info Skeleton */}
                    <div className="flex flex-wrap gap-6">
                      <div className="h-4 w-40 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Doctor Details Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Navigation Tabs Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 py-3 px-4 rounded-xl bg-slate-200 dark:bg-gray-700 animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Content Section Skeleton */}
              <div className="border-0 shadow-lg rounded-2xl">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 w-1/3 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Section Skeleton */}
            <div className="space-y-6">
              {/* Booking Card Skeleton */}
              <div className="sticky top-6 border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white pb-4 p-6">
                  <div className="h-6 w-1/2 bg-emerald-400 rounded animate-pulse"></div>
                </div>
                <div className="pt-6 px-6 pb-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="h-5 w-1/2 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-12 rounded-lg bg-slate-200 dark:bg-gray-700 animate-pulse"></div>
                        <div className="h-12 rounded-lg bg-slate-200 dark:bg-gray-700 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-1/3 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-8 w-20 bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-full bg-slate-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                      <div className="h-4 w-full bg-amber-200 dark:bg-amber-800 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-2/3 bg-amber-200 dark:bg-amber-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-12 w-full bg-emerald-200 dark:bg-emerald-700 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="px-8 pt-8 mb-6">
            <nav className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <a href="/" className="cursor-pointer">
                Beranda
              </a>
              <span className="mx-2">{'>'}</span>
              <a href="/doctors" className="cursor-pointer">
                Cari Dokter
              </a>
              <span className="mx-2">{'>'}</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">Dokter Tidak Ditemukan</span>
            </nav>
          </div>

          <div className="text-center py-16">
            <div className="text-6xl mb-4">🩺</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dokter Tidak Ditemukan</h1>
            <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Maaf, dokter yang Anda cari tidak ditemukan. Silakan coba mencari dokter lain atau kembali ke halaman utama.
            </p>
            <a 
              href="/doctors" 
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-base shadow-md transition-none transform-none scale-100 cursor-pointer"
            >
              Cari Dokter Lain
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/30 py-8">
      {/* Floating Alert - Posisi di kanan atas */}
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
        {alert && showAlert && (
          <div className="w-full">
            <div className={`
              relative overflow-hidden border shadow-2xl rounded-xl backdrop-blur-sm
              ${alert.type === 'success' 
                ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 shadow-emerald-500/20' 
                : alert.type === 'error' 
                ? 'bg-white dark:bg-gray-800 border-rose-200 dark:border-rose-700 shadow-rose-500/20' 
                : 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700 shadow-amber-500/20'
              }
              transition-none transform-none
            `}>
              <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  alert.type === 'success' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
                    : alert.type === 'error' 
                    ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400' 
                    : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                }`}>
                  {alert.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : alert.type === 'error' ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </div>
                
                {/* Message */}
                <div className="flex-grow min-w-0">
                  <p className={`text-sm font-medium ${
                    alert.type === 'success' 
                      ? 'text-emerald-900 dark:text-emerald-100' 
                      : alert.type === 'error' 
                      ? 'text-rose-900 dark:text-rose-100' 
                      : 'text-amber-900 dark:text-amber-100'
                  }`}>
                    {alert.message}
                  </p>
                </div>
                
                {/* Close Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full transition-none transform-none flex-shrink-0 cursor-pointer"
                  onClick={closeAlert}
                >
                  <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className={`absolute bottom-0 left-0 h-0.5 ${
                alert.type === 'success' 
                  ? 'bg-emerald-500 dark:bg-emerald-400' 
                  : alert.type === 'error' 
                  ? 'bg-rose-500 dark:bg-rose-400' 
                  : 'bg-amber-500 dark:bg-amber-400'
              } transition-none`} 
              style={{ 
                width: showAlert ? '0%' : '100%'
              }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <DoctorProfileHeader doctor={doctor} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <DoctorDetailTabs activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Content Sections */}
            <div className="space-y-6">
              {/* About Section */}
              {activeSection === "about" && (
                <DoctorAboutSection doctor={doctor} />
              )}

              {/* Treatment Section - Layanan Unggulan */}
              {activeSection === "treatment" && (
                <DoctorFeaturedServices doctor={doctor} />
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <DoctorEducationSection />
              )}

              {/* Schedule Section */}
              {activeSection === "schedule" && (
                <DoctorScheduleSection schedules={schedules} />
              )}
            </div>
          </div>

          {/* Right Column - Booking Section */}
          <div className="space-y-6">
            {/* Booking Card */}
            <BookingSection doctor={doctor} schedules={schedules} />
          </div>
        </div>
      </div>
    </div>
  );
}