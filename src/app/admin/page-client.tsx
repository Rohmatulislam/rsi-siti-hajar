"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Stethoscope,
  Calendar,
  Bed,
  HeartPulse,
  FileText,
  Activity,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus
} from "lucide-react";

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: string;
}

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface AdminDashboardClientProps {
  stats: Stat[];
  activities: Activity[];
}

// Mapping string icon ke komponen icon
const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'Users': return Users;
    case 'Stethoscope': return Stethoscope;
    case 'Calendar': return Calendar;
    case 'Bed': return Bed;
    case 'HeartPulse': return HeartPulse;
    case 'FileText': return FileText;
    case 'Activity': return Activity;
    case 'BarChart3': return TrendingUp;
    case 'DollarSign': return DollarSign;
    case 'MessageCircle': return MessageCircle;
    case 'Briefcase': return Briefcase;
    default: return Users; // fallback
  }
};

// Fungsi untuk mendapatkan kelas warna berdasarkan nama warna
const getColorClasses = (color: string) => {
  switch(color) {
    case 'emerald':
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-800'
      };
    case 'blue':
      return {
        text: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800'
      };
    case 'purple':
      return {
        text: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-800'
      };
    case 'teal':
      return {
        text: 'text-teal-600 dark:text-teal-400',
        bg: 'bg-teal-50 dark:bg-teal-900/30',
        border: 'border-teal-200 dark:border-teal-800'
      };
    case 'red':
      return {
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800'
      };
    default:
      return {
        text: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-900/30',
        border: 'border-gray-200 dark:border-gray-800'
      };
  }
};

export default function AdminDashboardClient({ stats, activities }: AdminDashboardClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">Selamat datang di sistem administrasi RSI Siti Hajar</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Laporan Mingguan
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = getIconComponent(stat.icon);
          const colorClasses = getColorClasses(stat.color);
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${colorClasses.bg} p-3 rounded-lg dark:text-white`}>
                  <Icon className={`h-6 w-6 ${colorClasses.text}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-xs ${
                  stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 
                  stat.change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {stat.change} dari bulan lalu
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <Activity className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 last:pb-0 border-b dark:border-gray-700 last:border-0">
                    <div className={`p-2 rounded-full mr-3 mt-0.5 ${
                      activity.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' : 
                      activity.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                    }`}>
                      {activity.type === 'error' ? 
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" /> : 
                        activity.type === 'success' ? 
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> : 
                        <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium dark:text-gray-200">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.user}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <a href="/admin/doctors">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Dokter
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/admin/articles">
                    <FileText className="h-4 w-4 mr-2" />
                    Kelola Artikel
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/admin/appointments">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Kelola Janji
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Kelola Pengguna
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* System Status */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <Activity className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Status Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm dark:text-gray-300">Database</span>
                  <Badge variant="default" className="dark:bg-green-700">Terhubung</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm dark:text-gray-300">Auth Service</span>
                  <Badge variant="default" className="dark:bg-green-700">Terhubung</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm dark:text-gray-300">API Service</span>
                  <Badge variant="default" className="dark:bg-green-700">Terhubung</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}