import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
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
      return new Response(JSON.stringify({ error: 'Access denied: Admin only' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return new Response(JSON.stringify({ error: 'Access denied: Admin only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'doctors';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validasi tipe file
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Only PNG, JPG, JPEG are allowed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validasi ukuran file (misalnya maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size too large. Maximum 5MB allowed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Baca file sebagai ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Buat nama file unik
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folder}/${randomUUID()}.${fileExt}`;
    
    // Coba upload ke folder yang diminta
    let uploadResult = null;
    let publicData = null;
    
    // Upload file ke Supabase Storage
    const result = await supabase
      .storage
      .from(folder)
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
      });

    if (result.error) {
      console.error('Error uploading image to Supabase:', result.error);
      
      // Jika bucket tidak ditemukan, coba upload ke bucket default
      if (result.error.message.includes('404') || result.error.message.includes('Bucket not found')) {
        console.log(`Bucket '${folder}' tidak ditemukan, mencoba upload ke bucket 'avatars' sebagai fallback...`);
        
        // Coba upload ke bucket default
        const fallbackResult = await supabase
          .storage
          .from('avatars')
          .upload(fileName, fileBuffer, {
            cacheControl: '3600',
            upsert: true,
          });

        if (fallbackResult.error) {
          console.error('Error uploading image to fallback bucket:', fallbackResult.error);
          return new Response(JSON.stringify({ 
            error: `Upload failed: ${fallbackResult.error.message}. Harap buat bucket '${folder}' di Supabase Storage terlebih dahulu.` 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        uploadResult = fallbackResult;
        
        // Dapatkan URL publik dari bucket fallback
        const fallbackUrlResult = await supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        // getPublicUrl() tidak mengembalikan objek dengan properti error, 
        // melainkan selalu mengembalikan objek dengan data yang berisi publicUrl
        publicData = fallbackUrlResult.data;
      } else {
        return new Response(JSON.stringify({ error: `Upload failed: ${result.error.message}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      uploadResult = result;
      
      // Dapatkan URL publik
      const urlResult = await supabase
        .storage
        .from(folder)
        .getPublicUrl(fileName);

      // getPublicUrl() tidak mengembalikan objek dengan properti error, 
      // melainkan selalu mengembalikan objek dengan data yang berisi publicUrl
      publicData = urlResult.data;
    }

    return new Response(JSON.stringify({ url: publicData?.publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in upload API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}