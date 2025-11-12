"use client";

import Link from "next/link";
import { 
  Users,
  Stethoscope,
  FileText,
  HeartPulse,
  CalendarCheck,
  Settings,
  LayoutDashboard,
  MessageCircle,
  Briefcase,
  Menu,
  X,
  Shield,
  Clock,
  BookOpen,
  ChevronRight,
  Star
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButtonWrapper } from "@/components/user-button-wrapper";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  
  // Menu navigasi admin
  const adminMenu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Pengguna", href: "/admin/users", icon: Users },
    { name: "Manajemen Dokter", href: "/admin/doctors", icon: Stethoscope },
    { name: "Manajemen Jadwal", href: "/admin/schedules", icon: Clock },
    { name: "Manajemen Janji", href: "/admin/appointments", icon: CalendarCheck },
    { name: "Manajemen Artikel", href: "/admin/articles", icon: FileText },
    { name: "Manajemen Layanan", href: "/admin/services", icon: HeartPulse, hasSubmenu: true },
    { name: "Manajemen FAQ", href: "/admin/faqs", icon: MessageCircle },
    { name: "Manajemen Lowongan", href: "/admin/job-listings", icon: Briefcase },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  // Submenu untuk layanan
  const servicesSubmenu = [
    { name: "Semua Layanan", href: "/admin/services", icon: HeartPulse },
    { name: "Layanan Unggulan", href: "/admin/services/featured", icon: Star },
  ];

  return (
    <div className={`h-full bg-gray-900 text-white border-r border-gray-700 ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
        {sidebarOpen ? (
          <div className="flex items-center">
            <div className="bg-emerald-600 text-white p-2 rounded-lg mr-3">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">RSI Siti Hajar</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-600 text-white p-2 rounded-lg mx-auto">
            <Shield className="h-5 w-5" />
          </div>
        )}
        
        {sidebarOpen && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {adminMenu.map((item) => (
            <li key={item.name}>
              {item.hasSubmenu ? (
                <>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      pathname.startsWith("/admin/services")
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`h-4 w-4 mr-3 ${pathname.startsWith("/admin/services") ? 'text-white' : 'text-gray-400'}`} />
                      {sidebarOpen && <span>{item.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-90' : ''}`} 
                      />
                    )}
                  </button>
                  
                  {sidebarOpen && servicesOpen && (
                    <ul className="mt-1 ml-8 space-y-1">
                      {servicesSubmenu.map((subItem) => (
                        <li key={subItem.name}>
                          <Link 
                            href={subItem.href}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                              pathname === subItem.href
                                ? 'bg-emerald-600/50 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            <subItem.icon className={`h-3 w-3 mr-2 ${pathname === subItem.href ? 'text-white' : 'text-gray-400'}`} />
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link 
                  href={item.href} 
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === item.href 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-4 w-4 mr-3 ${pathname === item.href ? 'text-white' : 'text-gray-400'}`} />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">Administrator</p>
            </div>
            <div>
              <UserButtonWrapper />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminSidebar };