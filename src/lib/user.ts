import { currentUser } from "@clerk/nextjs/server";
import { syncUserToDatabase } from "./user-sync";

export async function getCurrentUser() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    // Sinkronkan pengguna ke database Supabase secara otomatis
    console.log('Syncing user to database:', clerkUser.id);
    const syncedUser = await syncUserToDatabase(clerkUser.id);
    
    return syncedUser;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    // Jika sinkronisasi gagal, kembalikan null
    return null;
  }
}

// Fungsi untuk memastikan pengguna disinkronkan saat login
export async function ensureUserSync() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    // Cek apakah pengguna sudah ada di database
    const syncedUser = await syncUserToDatabase(clerkUser.id);
    
    return syncedUser;
  } catch (error) {
    console.error('Error in ensureUserSync:', error);
    return null;
  }
}