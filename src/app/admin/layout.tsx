import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { UserButtonWrapper } from "@/components/user-button-wrapper";

export const metadata = {
  title: "Admin Dashboard - RSI Siti Hajar Mataram",
  description: "Sistem Manajemen RSI Siti Hajar Mataram",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Periksa apakah pengguna adalah admin
  const supabase = await createSupabaseServerClient(true);
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !userData || userData.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center p-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sistem Manajemen RSI Siti Hajar Mataram</p>
            </div>
            <div className="flex items-center space-x-4">
              <UserButtonWrapper />
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}