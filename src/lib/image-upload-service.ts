'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

// Fungsi untuk upload gambar ke Supabase Storage
export async function uploadImage(fileBuffer: Buffer, fileName: string, folder: string = 'doctors') {
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
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    let uploadResult = null;
    let publicData = null;
    
    // Upload file ke Supabase Storage
    const result = await supabase
      .storage
      .from(folder)
      .upload(`${folder}/${fileName}`, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
      });

    if (result.error) {
      const uploadError = result.error;
      console.error('Error uploading image to Supabase:', uploadError);
      
      // Jika bucket tidak ditemukan, coba upload ke bucket default
      if (uploadError.message.includes('404') || uploadError.message.includes('Bucket not found')) {
        console.log(`Bucket '${folder}' tidak ditemukan, mencoba upload ke bucket 'avatars' sebagai fallback...`);
        
        // Coba upload ke bucket default
        const fallbackResult = await supabase
          .storage
          .from('avatars')
          .upload(`avatars/${fileName}`, fileBuffer, {
            cacheControl: '3600',
            upsert: true,
          });

        if (fallbackResult.error) {
          console.error('Error uploading image to fallback bucket:', fallbackResult.error);
          throw new Error(`Upload failed: ${fallbackResult.error.message}. Harap buat bucket '${folder}' di Supabase Storage terlebih dahulu.`);
        }
        
        uploadResult = fallbackResult;
        
        // Dapatkan URL publik dari bucket fallback
        const fallbackUrlResult = await supabase
          .storage
          .from('avatars')
          .getPublicUrl(`avatars/${fileName}`);
          
        publicData = fallbackUrlResult.data;
      } else {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    } else {
      uploadResult = result;
      
      // Dapatkan URL publik
      const urlResult = await supabase
        .storage
        .from(folder)
        .getPublicUrl(`${folder}/${fileName}`);

      publicData = urlResult.data;
    }

    return publicData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

// Fungsi untuk menghapus gambar dari Supabase Storage
export async function deleteImage(imageUrl: string, folder: string = 'doctors') {
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
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Ekstrak nama file dari URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid image URL');
    }

    // Hapus file dari Supabase Storage
    const { error: deleteError } = await supabase
      .storage
      .from(folder)
      .remove([`${folder}/${fileName}`]);

    if (deleteError) {
      console.error('Error deleting image from Supabase:', deleteError);
      throw new Error(`Delete failed: ${deleteError.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
}