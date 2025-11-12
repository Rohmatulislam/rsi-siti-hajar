'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { FAQ } from '@/lib/admin-types';

// Fungsi untuk mendapatkan semua FAQ
export async function getAllFAQs() {
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

  // Jika pengguna adalah admin, ambil semua FAQ
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching FAQs:', error);
      throw new Error(`Error fetching FAQs: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllFAQs:', error);
    throw error;
  }
}

// Fungsi untuk menghapus FAQ
export async function deleteFAQ(faqId: string) {
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

  // Jika pengguna adalah admin, hapus FAQ
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', faqId);

    if (error) {
      console.error('Error deleting FAQ:', error);
      throw new Error(`Error deleting FAQ: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFAQ:', error);
    throw error;
  }
}

// Fungsi untuk membuat FAQ baru
export async function createFAQ(faqData: {
  question: string;
  answer: string;
  category?: string | null;
  priority?: number;
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

  // Jika pengguna adalah admin, buat FAQ baru
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('faqs')
      .insert([{
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category,
        priority: faqData.priority || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating FAQ:', error);
      throw new Error(`Error creating FAQ: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createFAQ:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui FAQ
export async function updateFAQ(faqId: string, faqData: {
  question?: string;
  answer?: string;
  category?: string | null;
  priority?: number;
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

  // Jika pengguna adalah admin, perbarui FAQ
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (faqData.question !== undefined) updateData.question = faqData.question;
    if (faqData.answer !== undefined) updateData.answer = faqData.answer;
    if (faqData.category !== undefined) updateData.category = faqData.category;
    if (faqData.priority !== undefined) updateData.priority = faqData.priority;
    
    const { data, error } = await supabase
      .from('faqs')
      .update(updateData)
      .eq('id', faqId)
      .select()
      .single();

    if (error) {
      console.error('Error updating FAQ:', error);
      throw new Error(`Error updating FAQ: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateFAQ:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail FAQ
export async function getFAQById(faqId: string) {
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

  // Jika pengguna adalah admin, ambil detail FAQ
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', faqId)
      .single();

    if (error) {
      console.error('Error fetching FAQ:', error);
      throw new Error(`Error fetching FAQ: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getFAQById:', error);
    throw error;
  }
}

// Fungsi untuk mengatur prioritas FAQ
export async function reorderFAQs(faqOrder: { id: string; priority: number }[]) {
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

  // Jika pengguna adalah admin, atur ulang prioritas FAQ
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Update setiap FAQ dengan prioritas baru
    const updates = faqOrder.map(async (faq) => {
      return await supabase
        .from('faqs')
        .update({ priority: faq.priority, updated_at: new Date().toISOString() })
        .eq('id', faq.id);
    });
    
    await Promise.all(updates);
    
    return true;
  } catch (error) {
    console.error('Error in reorderFAQs:', error);
    throw error;
  }
}