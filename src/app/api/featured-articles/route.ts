import { NextResponse } from 'next/server';
import { getRecentArticles } from '@/lib/article-service';

// API endpoint khusus untuk artikel unggulan di komponen NewsHealthPedia
export async function GET() {
  try {
    // Ambil 3 artikel terbaru sebagai artikel unggulan
    const articles = await getRecentArticles(3);
    
    // Pastikan hasilnya adalah array dan kembalikan
    const result = Array.isArray(articles) ? articles : [];
    
    console.log('Featured articles result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    
    // Kembalikan array kosong jika terjadi error, bukan objek error
    return NextResponse.json([], { status: 200 });
  }
}