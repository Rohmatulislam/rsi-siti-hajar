'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

// Fungsi untuk mendapatkan statistik admin
export async function getAdminStats() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  try {
    // Ambil statistik dari berbagai tabel - gunakan service role key untuk akses admin
    const supabase = await createSupabaseServerClient(true); // dengan service role

    // Ambil statistik dari berbagai tabel
    // Ambil statistik dari berbagai tabel secara terpisah untuk menghindari masalah RLS
    const { count: totalPatients } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');
    
    const { count: activeDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });
    
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', new Date().toISOString().split('T')[0])
      .eq('status', 'confirmed');

    // Ambil aktivitas terbaru
    const { data: recentActivities } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        created_at,
        status,
        doctors(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Format aktivitas terbaru
    const activities = recentActivities?.map((activity: any) => ({
      id: activity.id,
      action: `Janji temu ${activity.status}`,
      user: activity.doctors?.name || 'Dokter Tidak Diketahui',
      time: formatTimeAgo(new Date(activity.created_at)),
      type: activity.status === 'cancelled' ? 'error' : 'success'
    })) || [];

    // Tambahkan aktivitas tambahan
    activities.unshift({
      id: 'sys-1',
      action: 'Login admin',
      user: 'Anda',
      time: 'Baru saja',
      type: 'info'
    });

    return {
      stats: [
        { 
          title: "Total Pasien", 
          value: (totalPatients || 0).toString(), 
          change: "+5%", 
          icon: 'Users', 
          color: "emerald" 
        },
        { 
          title: "Dokter Aktif", 
          value: (activeDoctors || 0).toString(), 
          change: "+2%", 
          icon: 'Stethoscope', 
          color: "blue" 
        },
        { 
          title: "Janji Hari Ini", 
          value: (todayAppointments || 0).toString(), 
          change: "+10%", 
          icon: 'Calendar', 
          color: "purple" 
        },
        { 
          title: "Layanan Tersedia", 
          value: "10", 
          change: "-5%", 
          icon: 'HeartPulse', 
          color: "emerald" 
        }
      ],
      activities: activities.slice(0, 5) // Ambil 5 aktivitas terbaru
    };
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    // Kembalikan data default jika terjadi error
    return {
      stats: [
        { title: "Total Pasien", value: "0", change: "0%", icon: 'Users', color: "emerald" },
        { title: "Dokter Aktif", value: "0", change: "0%", icon: 'Stethoscope', color: "blue" },
        { title: "Janji Hari Ini", value: "0", change: "0%", icon: 'Calendar', color: "purple" },
        { title: "Layanan Tersedia", value: "0", change: "0%", icon: 'HeartPulse', color: "emerald" }
      ],
      activities: [
        { id: 1, action: "Gagal memuat statistik", user: "Sistem", time: "Baru saja", type: "error" }
      ]
    };
  }
}

// Fungsi bantuan untuk memformat waktu
function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  }
}