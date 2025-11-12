'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { JobListing } from '@/lib/admin-types';

// Fungsi untuk mendapatkan semua lowongan pekerjaan
export async function getAllJobListings() {
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

  // Jika pengguna adalah admin, ambil semua lowongan pekerjaan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching job listings:', error);
      throw new Error(`Error fetching job listings: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllJobListings:', error);
    throw error;
  }
}

// Fungsi untuk menghapus lowongan pekerjaan
export async function deleteJobListing(jobId: string) {
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

  // Jika pengguna adalah admin, hapus lowongan pekerjaan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Error deleting job listing:', error);
      throw new Error(`Error deleting job listing: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteJobListing:', error);
    throw error;
  }
}

// Fungsi untuk membuat lowongan pekerjaan baru
export async function createJobListing(jobData: {
  title: string;
  department?: string | null;
  description?: string | null;
  requirements?: string[] | null;
  salary_range?: string | null;
  location?: string | null;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship' | null;
  status?: 'active' | 'filled' | 'cancelled';
  application_deadline?: string | null;
}) {
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

  // Jika pengguna adalah admin, buat lowongan pekerjaan baru
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('job_listings')
      .insert([{
        title: jobData.title,
        department: jobData.department,
        description: jobData.description,
        requirements: jobData.requirements,
        salary_range: jobData.salary_range,
        location: jobData.location,
        employment_type: jobData.employment_type,
        status: jobData.status || 'active',
        application_deadline: jobData.application_deadline,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating job listing:', error);
      throw new Error(`Error creating job listing: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createJobListing:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui lowongan pekerjaan
export async function updateJobListing(jobId: string, jobData: {
  title?: string;
  department?: string | null;
  description?: string | null;
  requirements?: string[] | null;
  salary_range?: string | null;
  location?: string | null;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship' | null;
  status?: 'active' | 'filled' | 'cancelled';
  application_deadline?: string | null;
}) {
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

  // Jika pengguna adalah admin, perbarui lowongan pekerjaan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (jobData.title !== undefined) updateData.title = jobData.title;
    if (jobData.department !== undefined) updateData.department = jobData.department;
    if (jobData.description !== undefined) updateData.description = jobData.description;
    if (jobData.requirements !== undefined) updateData.requirements = jobData.requirements;
    if (jobData.salary_range !== undefined) updateData.salary_range = jobData.salary_range;
    if (jobData.location !== undefined) updateData.location = jobData.location;
    if (jobData.employment_type !== undefined) updateData.employment_type = jobData.employment_type;
    if (jobData.status !== undefined) updateData.status = jobData.status;
    if (jobData.application_deadline !== undefined) updateData.application_deadline = jobData.application_deadline;
    
    const { data, error } = await supabase
      .from('job_listings')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error updating job listing:', error);
      throw new Error(`Error updating job listing: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateJobListing:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail lowongan pekerjaan
export async function getJobListingById(jobId: string) {
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

  // Jika pengguna adalah admin, ambil detail lowongan pekerjaan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error fetching job listing:', error);
      throw new Error(`Error fetching job listing: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getJobListingById:', error);
    throw error;
  }
}

// Fungsi untuk mengubah status lowongan pekerjaan
export async function updateJobListingStatus(jobId: string, status: 'active' | 'filled' | 'cancelled') {
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

  // Jika pengguna adalah admin, ubah status lowongan pekerjaan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('job_listings')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error updating job listing status:', error);
      throw new Error(`Error updating job listing status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateJobListingStatus:', error);
    throw error;
  }
}