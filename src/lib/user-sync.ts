import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

// Fungsi untuk mendapatkan informasi pengguna dari Clerk API
// Catatan: Pastikan untuk menginstal @clerk/backend: npm install @clerk/backend
async function getClerkUserInfo(userId: string) {
  try {
    // Dapatkan Clerk API instance
    const { createClerkClient } = await import('@clerk/backend');
    
    // Buat klien Clerk dengan informasi dari environment
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    // Ambil informasi pengguna
    const clerkUser = await clerkClient.users.getUser(userId);
    return clerkUser;
  } catch (error) {
    console.error('Error fetching user from Clerk API:', error);
    return null;
  }
}

export async function syncUserToDatabase(userId: string) {
  try {
    console.log('Syncing user to database:', userId);
    
    // Dapatkan informasi pengguna dari Clerk
    const clerkUser = await getClerkUserInfo(userId);
    
    if (!clerkUser) {
      console.error('User not found in Clerk');
      return null;
    }

    const supabase = await createSupabaseServerClient(true); // Gunakan service role key
    
    // Cek apakah pengguna sudah ada di database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Jika pengguna belum ada, buat entri baru
    if (fetchError && fetchError.code === 'PGRST116') { // Record not found
      const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 
                       clerkUser.username || 
                       clerkUser.emailAddresses[0]?.emailAddress || '';
      
      console.log('Creating new user in database:', {
        user_id: userId,
        full_name: fullName,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        role: 'patient'
      });
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          user_id: userId,
          full_name: fullName,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          role: 'patient', // default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user in database:', insertError);
        return null;
      }

      console.log('✅ User created in database:', newUser?.id);
      return newUser;
    } else if (fetchError) {
      console.error('Error checking user in database:', fetchError);
      return null;
    }

    // Pengguna sudah ada, kembalikan data yang ada
    console.log('User already exists in database:', existingUser?.id);
    return existingUser;
  } catch (error) {
    console.error('Error in syncUserToDatabase:', error);
    return null;
  }
}

// Sinkronisasi paksa pengguna saat ini
export async function forceSyncCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.log('No user ID found in auth');
      return null;
    }

    console.log('Force syncing current user:', userId);
    return await syncUserToDatabase(userId);
  } catch (error) {
    console.error('Error in forceSyncCurrentUser:', error);
    return null;
  }
}

// Soft delete pengguna (set deleted_at timestamp)
export async function softDeleteUser(userId: string) {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role key
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        deleted_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error soft deleting user:', error);
      return null;
    }

    console.log('User soft deleted:', userId);
    return data;
  } catch (error) {
    console.error('Error in softDeleteUser:', error);
    return null;
  }
}

// Hard delete pengguna
export async function hardDeleteUser(userId: string) {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role key
    
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error hard deleting user:', error);
      return null;
    }

    console.log('User hard deleted:', userId);
    return data;
  } catch (error) {
    console.error('Error in hardDeleteUser:', error);
    return null;
  }
}

// Restore pengguna yang di-soft delete
export async function restoreUser(userId: string) {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role key
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error restoring user:', error);
      return null;
    }

    console.log('User restored:', userId);
    return data;
  } catch (error) {
    console.error('Error in restoreUser:', error);
    return null;
  }
}