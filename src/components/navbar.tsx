"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Moon, Sun, ChevronDown, Stethoscope, Heart, Info, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import SafeUserButton from "./safe-user-button";
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Gunakan nilai default yang sama antara server dan client
  const [navbarClasses, setNavbarClasses] = useState('bg-white/90 text-gray-900');
  const { theme, setTheme } = useTheme();
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();

  // Gunakan state untuk melacak apakah pengguna berada di halaman admin
  // Inisialisasi dengan nilai berdasarkan pathname untuk konsistensi server-client
  const [isAdminPage, setIsAdminPage] = useState(pathname?.startsWith('/admin') || false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Hanya jalankan di client side

    // Selalu gunakan warna navbar putih, tidak perlu mengubah saat scroll
    setNavbarClasses('bg-white/90 text-gray-900');
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${navbarClasses} ${isAdminPage ? 'hidden' : ''}`}
    >
      <div className="max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 py-2">
        {/* Logo */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              if (window.location.pathname !== '/') {
                // Jika bukan di halaman home, maka navigasi ke home
                window.location.href = '/';
              } else {
                // Jika sudah di halaman home, scroll ke atas
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }}
          className="flex items-center space-x-3 group flex-shrink-0 mr-8"
          aria-label="Kembali ke bagian atas halaman atau ke halaman utama"
        >
          <div className="h-12 w-12 flex items-center justify-center">
            <img
              src="/hospital-icon.png"
              alt="Logo RSI Siti Hajar"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">RSI Siti Hajar</span>
            <p className="text-xs text-current/80 group-hover:text-gray-700 dark:group-hover:text-gray-300 mt-0.5 transition-colors duration-300">Mataram</p>
          </div>
        </button>

        {/* Navigation Menu - Dipusatkan */}
        {!isAdminPage && (
          <nav className="hidden lg:flex items-center justify-center flex-1 max-w-7xl mx-auto">
            <div className="flex items-center space-x-1">
              <Link
                href="/doctors"
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-current hover:bg-white/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group"
              >
                <Stethoscope className="h-4 w-4 mr-2 text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
                Cari Dokter
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-current hover:bg-white/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group">
                  <Heart className="h-4 w-4 mr-2 text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
                  Layanan Kesehatan
                  <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180 text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/90 backdrop-blur-xl border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 shadow-xl rounded-xl mt-2">
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/inpatient" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      Rawat Inap
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/outpatient" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      Rawat Jalan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/pharmacy" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      Farmasi 24 Jam
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/laboratory" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      Laboratorium
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/radiology" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      Radiologi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/rehabilitation" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      Rehabilitasi Medik
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/mcu" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                      MCU (Medical Check Up)
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-current hover:bg-white/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
                  Layanan Unggulan
                  <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180 text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/90 backdrop-blur-xl border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 shadow-xl rounded-xl mt-2">
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/featured" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      Semua Layanan Unggulan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/featured/minimal-invasive" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      Bedah Minimal Invasif
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/featured/eswl" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      ESWL
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/featured/delivery" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      Persalinan Syarii
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/services/featured/executive" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      Layanan Eksekutif
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-current hover:bg-white/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group">
                  <Info className="h-4 w-4 mr-2 text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
                  Pusat Informasi
                  <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180 text-current group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white/90 backdrop-blur-xl border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 shadow-xl rounded-xl mt-2">
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/information/contact" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Kontak & Operator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/information/emergency" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                      IGD
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/information/pr" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Humas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/articles" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Artikel & Berita
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/jobs" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Lowongan Kerja
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/faq" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50">
                    <Link href="/information/map" className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Peta Lokasi
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        )}

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-white/20 text-current hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5 text-current hover:text-emerald-600 dark:hover:text-emerald-400 duration-300" />
          </Button>

          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-current hidden md:block bg-white/20 px-3 py-1 rounded-full backdrop-blur-md hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">
                {user?.firstName || user?.fullName || 'User'}
              </span>
              {isSignedIn && <SafeUserButton />}
            </div>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="border-current/30 text-current hover:bg-white hover:text-emerald-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-200 backdrop-blur-md">
                Masuk
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-current hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200">
                {mounted && theme === "dark" ? (
                  <Sun className="h-5 w-5 text-current hover:text-emerald-600 dark:hover:text-emerald-400 duration-300" />
                ) : (
                  <Moon className="h-5 w-5 text-current hover:text-emerald-600 dark:hover:text-emerald-400 duration-300" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white/90 backdrop-blur-xl border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 shadow-xl rounded-xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50 py-3">
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50 py-3">
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700 focus:bg-emerald-50 py-3">
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
          <div className="max-w-screen-2xl mx-auto px-6 py-4 space-y-2">
            {!isAdminPage && (
              <>
                <Link
                  href="/doctors"
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Stethoscope className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-300" />
                  Cari Dokter
                </Link>

                <div className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-300" />
                    Layanan Kesehatan
                  </div>
                  <div className="mt-2 ml-7 space-y-2">
                    <Link href="/services/inpatient" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Rawat Inap</Link>
                    <Link href="/services/outpatient" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Rawat Jalan</Link>
                    <Link href="/services/pharmacy" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Farmasi 24 Jam</Link>
                    <Link href="/services/laboratory" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Laboratorium</Link>
                    <Link href="/services/radiology" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Radiologi</Link>
                    <Link href="/services/rehabilitation" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Rehabilitasi Medik</Link>
                    <Link href="/services/mcu" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>MCU</Link>
                  </div>
                </div>

                <div className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                    Layanan Unggulan
                  </div>
                  <div className="mt-2 ml-7 space-y-2">
                    <Link href="/services/featured" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Semua Layanan Unggulan</Link>
                    <Link href="/services/featured/minimal-invasive" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Bedah Minimal Invasif</Link>
                    <Link href="/services/featured/eswl" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>ESWL</Link>
                    <Link href="/services/featured/delivery" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Persalinan Syarii</Link>
                    <Link href="/services/featured/executive" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Layanan Eksekutif</Link>
                  </div>
                </div>

                <div className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-300" />
                    Pusat Informasi
                  </div>
                  <div className="mt-2 ml-7 space-y-2">
                    <Link href="/information/contact" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Kontak & Operator</Link>
                    <Link href="/information/emergency" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>IGD</Link>
                    <Link href="/information/pr" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Humas</Link>
                    <Link href="/articles" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Artikel & Berita</Link>
                    <Link href="/jobs" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Lowongan Kerja</Link>
                    <Link href="/faq" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                    <Link href="/information/map" className="block py-2 text-gray-600 hover:text-emerald-600 dark:hover:text-emerald-400" onClick={() => setMobileMenuOpen(false)}>Peta Lokasi</Link>
                  </div>
                </div>
              </>
            )}
            {isAdminPage && (
              <div className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="text-lg font-bold">Admin Panel</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Anda sedang di halaman admin</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}