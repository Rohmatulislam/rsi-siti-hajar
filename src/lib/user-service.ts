'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { User } from '@/lib/admin-types';

// Fungsi untuk mendapatkan semua pengguna
export async function getAllUsers() {
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

  // Jika pengguna adalah admin, ambil semua pengguna
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Error fetching users: ${error.message}`);
    }

    return users || [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

// Fungsi untuk menghapus pengguna (soft delete)
export async function deleteUser(user_id: string) {
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

  // Jika pengguna adalah admin, soft delete pengguna
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { error } = await supabase
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('user_id', user_id);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(`Error deleting user: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui role pengguna
export async function updateUserRole(user_id: string, role: string) {
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

  // Jika pengguna adalah admin, perbarui role pengguna
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('users')
      .update({ role: role, updated_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw new Error(`Error updating user role: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail pengguna
export async function getUserById(user_id: string) {
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

  // Jika pengguna adalah admin, ambil detail pengguna
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui data pengguna
export async function updateUser(user_id: string, userData: {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userDataAdmin, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userDataAdmin || userDataAdmin.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, perbarui data pengguna
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw new Error(`Error updating user: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
}

// Fungsi untuk mengembalikan pengguna yang telah dihapus (undelete)
export async function restoreUser(user_id: string) {
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

  // Jika pengguna adalah admin, kembalikan pengguna yang telah dihapus
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('users')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error restoring user:', error);
      throw new Error(`Error restoring user: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in restoreUser:', error);
    throw error;
  }
}