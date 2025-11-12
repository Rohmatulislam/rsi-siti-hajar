import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getAdminStats } from '@/lib/admin-service';
import AdminDashboardClient from "./page-client";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  try {
    // Periksa apakah pengguna adalah admin
    const supabase = await createSupabaseServerClient(true);
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error || !userData || userData.role !== 'admin') {
      redirect('/admin');
    }

    // Ambil statistik admin
    const adminStats = await getAdminStats();

    // Render client component dengan data yang sudah divalidasi
    return <AdminDashboardClient stats={adminStats.stats} activities={adminStats.activities} />;
  } catch (error) {
    console.error("Error checking auth or fetching admin stats:", error);
    redirect('/admin');
  }
}