import { NextRequest } from 'next/server';
import { getPublicArticles, getPublicArticlesByCategory, getRecentArticles, searchPublicArticles } from '@/lib/article-service';
import { getUserById } from '@/lib/user-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');

    console.log('API route called with params:', { category, limit, search, slug });

    let articles = [];

    try {
      if (slug) {
        // This would require a different function to get single article by slug
        // For now, we'll return all articles and filter client-side if needed
        articles = await getPublicArticles();
        articles = articles.filter((article: any) => article.slug === slug);
      } else if (search) {
        // Search articles by query
        console.log('Searching articles for:', search);
        articles = await searchPublicArticles(search);
      } else if (category) {
        // Get articles by category
        // Special handling for "unggulan" category - this might be a featured category
        console.log('Fetching articles by category:', category);
        if (category === 'unggulan') {
          // Return recent articles as featured articles
          const limitNum = limit ? parseInt(limit) : 3;
          console.log('Fetching recent articles with limit:', limitNum);
          articles = await getRecentArticles(limitNum);
          console.log('Found recent articles:', articles.length);
        } else {
          articles = await getPublicArticlesByCategory(category);
        }
      } else if (limit) {
        // Get recent articles with limit
        const limitNum = parseInt(limit);
        console.log('Fetching recent articles with limit:', limitNum);
        articles = await getRecentArticles(limitNum);
        console.log('Found recent articles:', articles.length);
        
        // Jika tidak ada artikel ditemukan, coba ambil semua artikel tanpa filter
        if (articles.length === 0) {
          console.log('No recent articles found, checking all articles...');
          const allArticles = await getPublicArticles();
          console.log('Total published articles:', allArticles.length);
        }
      } else {
        // Get all public articles
        console.log('Fetching all public articles');
        articles = await getPublicArticles();
        console.log('Found all public articles:', articles.length);
      }
    } catch (error) {
      console.error('Error in API route:', error);
      articles = []; // Kembalikan array kosong jika ada error
    }

    console.log('Returning articles:', articles.length);

    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch articles', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}