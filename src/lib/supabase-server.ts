import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ⚠️ pastikan ini di .env

// 🔥 Client khusus untuk server (termasuk webhook dan akses admin)
export async function createSupabaseServerClient(useServiceRole = false) {
  if (useServiceRole) {
    console.log("🔐 Using Supabase Service Role Key (Admin/Service mode)");
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
      global: {
        fetch: (url, options = {}) =>
          fetch(url, {
            ...options,
            cache: "no-store",
          }),
      },
      auth: {
        // Nonaktifkan auto-refresh token untuk service role
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // 🧠 Jika bukan service role, gunakan auth token dari Clerk
  const { getToken } = await auth();
  const token = await getToken();

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      fetch: (url, options = {}) =>
        fetch(url, {
          ...options,
          cache: "no-store",
        }),
    },
  });
}