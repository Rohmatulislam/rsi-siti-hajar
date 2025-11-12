'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { Article } from '@/lib/admin-types';

// Fungsi untuk mendapatkan semua artikel
export async function getAllArticles() {
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

  // Jika pengguna adalah admin, ambil semua artikel
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw new Error(`Error fetching articles: ${error.message || error}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    throw error;
  }
}

// Fungsi untuk menghapus artikel
export async function deleteArticle(articleId: string) {
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

  // Jika pengguna adalah admin, hapus artikel
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) {
      console.error('Error deleting article:', error);
      throw new Error(`Error deleting article: ${error.message || error}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    throw error;
  }
}

// Fungsi untuk membuat artikel baru
export async function createArticle(articleData: {
  title: string;
  slug?: string | null;
  content?: string | null;
  image_url?: string | null;
  category?: string | null;
  author_id?: string | null;
  excerpt?: string | null;
  published?: boolean;
  published_at?: string | null;
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

  // Jika pengguna adalah admin, buat artikel baru
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Generate slug jika tidak disediakan
    let slug = articleData.slug;
    if (!slug) {
      slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: articleData.title,
        slug: slug,
        content: articleData.content,
        image_url: articleData.image_url,
        category: articleData.category,
        author_id: articleData.author_id || userId,
        excerpt: articleData.excerpt,
        published: articleData.published || false,
        published_at: articleData.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      throw new Error(`Error creating article: ${error.message || error}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createArticle:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui artikel
export async function updateArticle(articleId: string, articleData: {
  title?: string;
  slug?: string | null;
  content?: string | null;
  image_url?: string | null;
  category?: string | null;
  author_id?: string | null;
  excerpt?: string | null;
  published?: boolean;
  published_at?: string | null;
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

  // Jika pengguna adalah admin, perbarui artikel
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Generate slug jika diperlukan
    let slug = articleData.slug;
    if (articleData.title && !slug) {
      slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (articleData.title !== undefined) updateData.title = articleData.title;
    if (slug !== undefined) updateData.slug = slug;
    if (articleData.content !== undefined) updateData.content = articleData.content;
    if (articleData.image_url !== undefined) updateData.image_url = articleData.image_url;
    if (articleData.category !== undefined) updateData.category = articleData.category;
    if (articleData.author_id !== undefined) updateData.author_id = articleData.author_id;
    if (articleData.excerpt !== undefined) updateData.excerpt = articleData.excerpt;
    if (articleData.published !== undefined) {
      updateData.published = articleData.published;
      updateData.published_at = articleData.published ? new Date().toISOString() : null;
    }
    
    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', articleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      throw new Error(`Error updating article: ${error.message || error}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateArticle:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail artikel
export async function getArticleById(articleId: string) {
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

  // Jika pengguna adalah admin, ambil detail artikel
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      throw new Error(`Error fetching article: ${error.message || error}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getArticleById:', error);
    throw error;
  }
}

// Fungsi untuk mencari artikel publik berdasarkan kata kunci
export async function searchPublicArticles(query: string) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Mencari di title dan content artikel
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .ilike('title', `%${query}%`) // pencarian case-insensitive di title
      .or(`content.ilike.%${query}%,excerpt.ilike.%${query}%`) // pencarian di content dan excerpt
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .order('published_at', { ascending: false });

    if (error) {
      console.error(`Error searching articles for query "${query}":`, error);
      throw new Error(`Error searching articles for query "${query}": ${error.message || error}`);
    }

    return data || [];
  } catch (error: any) {
    console.error(`Error in searchPublicArticles for query "${query}":`, error);
    throw new Error(`Error searching articles for query "${query}": ${error.message || error}`);
  }
}

// Fungsi untuk mempublikasikan artikel
export async function publishArticle(articleId: string) {
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

  // Jika pengguna adalah admin, publikasikan artikel
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .update({
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', articleId)
      .select()
      .single();

    if (error) {
      console.error('Error publishing article:', error);
      throw new Error(`Error publishing article: ${error.message || error}`);
    }

    return data;
  } catch (error) {
    console.error('Error in publishArticle:', error);
    throw error;
  }
}

// Fungsi untuk membatalkan publikasi artikel
export async function unpublishArticle(articleId: string) {
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

  // Jika pengguna adalah admin, batalkan publikasi artikel
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .update({
        published: false,
        published_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', articleId)
      .select()
      .single();

    if (error) {
      console.error('Error unpublishing article:', error);
      throw new Error(`Error unpublishing article: ${error.message || error}`);
    }

    return data;
  } catch (error) {
    console.error('Error in unpublishArticle:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan artikel publik (tanpa autentikasi)
export async function getPublicArticles() {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching public articles:', error);
      throw new Error(`Error fetching public articles: ${error.message || error}`);
    }

    // Ambil nama pengguna untuk setiap artikel
    const articlesWithAuthors = await Promise.all((data || []).map(async (article) => {
      let authorName = 'Unknown Author';
      if (article.author_id) {
        try {
          authorName = await getPublicUserName(article.author_id);
        } catch (userError) {
          console.error(`Error fetching user name for ${article.author_id}:`, userError);
          authorName = article.author_id;
        }
      }
      
      return {
        ...article,
        author_name: authorName
      };
    }));

    return articlesWithAuthors;
  } catch (error: any) {
    console.error('Error in getPublicArticles:', error);
    throw new Error(`Error fetching public articles: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan artikel terbaru
export async function getRecentArticles(limit: number = 5) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Error fetching recent articles (limit: ${limit}):`, error);
      throw new Error(`Error fetching recent articles (limit: ${limit}): ${error.message || error}`);
    }

    // Ambil nama pengguna untuk setiap artikel
    const articlesWithAuthors = await Promise.all((data || []).map(async (article) => {
      let authorName = 'Unknown Author';
      if (article.author_id) {
        try {
          authorName = await getPublicUserName(article.author_id);
        } catch (userError) {
          console.error(`Error fetching user name for ${article.author_id}:`, userError);
          authorName = article.author_id;
        }
      }
      
      return {
        ...article,
        author_name: authorName
      };
    }));

    return articlesWithAuthors;
  } catch (error: any) {
    console.error(`Error in getRecentArticles (limit: ${limit}):`, error);
    throw new Error(`Error fetching recent articles (limit: ${limit}): ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan artikel publik berdasarkan kategori
export async function getPublicArticlesByCategory(category: string) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .eq('category', category) // filter berdasarkan kategori
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .order('published_at', { ascending: false });

    if (error) {
      console.error(`Error fetching public articles by category ${category}:`, error);
      throw new Error(`Error fetching public articles by category ${category}: ${error.message || error}`);
    }

    // Ambil nama pengguna untuk setiap artikel
    const articlesWithAuthors = await Promise.all((data || []).map(async (article) => {
      let authorName = 'Unknown Author';
      if (article.author_id) {
        try {
          authorName = await getPublicUserName(article.author_id);
        } catch (userError) {
          console.error(`Error fetching user name for ${article.author_id}:`, userError);
          authorName = article.author_id;
        }
      }
      
      return {
        ...article,
        author_name: authorName
      };
    }));

    return articlesWithAuthors;
  } catch (error: any) {
    console.error(`Error in getPublicArticlesByCategory (${category}):`, error);
    throw new Error(`Error fetching public articles by category ${category}: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan artikel publik berdasarkan penulis
export async function getPublicArticlesByAuthor(authorId: string) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .eq('author_id', authorId) // filter berdasarkan penulis
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .order('published_at', { ascending: false });

    if (error) {
      console.error(`Error fetching public articles by author ${authorId}:`, error);
      throw new Error(`Error fetching public articles by author ${authorId}: ${error.message || error}`);
    }

    return data || [];
  } catch (error: any) {
    console.error(`Error in getPublicArticlesByAuthor (${authorId}):`, error);
    throw new Error(`Error fetching public articles by author ${authorId}: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan detail artikel publik (tanpa autentikasi)
export async function getPublicArticleBySlug(slug: string) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .eq('slug', slug) // filter berdasarkan slug
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .single();

    if (error) {
      console.error(`Error fetching public article by slug ${slug}:`, error);
      throw new Error(`Error fetching public article by slug ${slug}: ${error.message || error}`);
    }

    // Ambil nama pengguna jika author_id tersedia
    let authorName = 'Unknown Author';
    if (data.author_id) {
      try {
        // Gunakan fungsi khusus untuk mendapatkan nama pengguna publik
        authorName = await getPublicUserName(data.author_id);
      } catch (userError) {
        console.error(`Error fetching user name for ${data.author_id}:`, userError);
        authorName = data.author_id; // Gunakan ID sebagai fallback
      }
    }

    // Tambahkan author_name ke data artikel
    return {
      ...data,
      author_name: authorName
    };
  } catch (error: any) {
    console.error(`Error in getPublicArticleBySlug (${slug}):`, error);
    throw new Error(`Error fetching public article by slug ${slug}: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan jumlah total artikel
export async function getArticlesCount() {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true }) // hanya hitung, tidak ambil data
      .is('deleted_at', null); // hanya hitung artikel yang tidak dihapus

    if (error) {
      console.error('Error counting articles:', error);
      throw new Error(`Error counting articles: ${error.message || error}`);
    }

    return count || 0;
  } catch (error: any) {
    console.error('Error in getArticlesCount:', error);
    throw new Error(`Error counting articles: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan jumlah artikel berdasarkan status publikasi
export async function getArticlesCountByStatus(published?: boolean) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact', head: true }) // hanya hitung, tidak ambil data
      .is('deleted_at', null); // hanya hitung artikel yang tidak dihapus

    if (published !== undefined) {
      query = query.eq('published', published);
    }

    const { count, error } = await query;

    if (error) {
      console.error(`Error counting articles by status (${published}):`, error);
      throw new Error(`Error counting articles by status (${published}): ${error.message || error}`);
    }

    return count || 0;
  } catch (error: any) {
    console.error(`Error in getArticlesCountByStatus (${published}):`, error);
    throw new Error(`Error counting articles by status (${published}): ${error.message || error}`);
  }
}

// Fungsi bantu untuk mendapatkan nama pengguna secara publik
async function getPublicUserName(userId: string): Promise<string> {
  const supabase = await createSupabaseServerClient(true); // Gunakan service role
  
  const { data, error } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('user_id', userId)
    .single();

  if (error) {
    // Jika pengguna tidak ditemukan, kembalikan userId sebagai fallback
    if (error.code === 'PGRST116') { // Record not found
      console.warn(`User with ID ${userId} not found in users table`);
      return userId;
    }
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }

  return data.full_name || data.email || userId;
}

// Fungsi untuk mendapatkan artikel publik berdasarkan slug (ekspor dengan nama yang digunakan di halaman artikel)
export async function getArticleBySlug(slug: string) {
  try {
    // Gunakan service role untuk API route
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true) // hanya tampilkan artikel yang sudah dipublikasikan
      .eq('slug', slug) // filter berdasarkan slug
      .is('deleted_at', null) // hanya tampilkan artikel yang tidak dihapus
      .single();

    if (error) {
      console.error(`Error fetching article by slug ${slug}:`, error);
      throw new Error(`Error fetching article by slug ${slug}: ${error.message || error}`);
    }

    // Ambil nama pengguna jika author_id tersedia
    let authorName = 'Unknown Author';
    if (data.author_id) {
      try {
        // Gunakan fungsi khusus untuk mendapatkan nama pengguna publik
        authorName = await getPublicUserName(data.author_id);
      } catch (userError) {
        console.error(`Error fetching user name for ${data.author_id}:`, userError);
        authorName = data.author_id; // Gunakan ID sebagai fallback
      }
    }

    // Tambahkan author_name ke data artikel
    return {
      ...data,
      author_name: authorName
    };
  } catch (error: any) {
    console.error(`Error in getArticleBySlug (${slug}):`, error);
    throw new Error(`Error fetching article by slug ${slug}: ${error.message || error}`);
  }
}