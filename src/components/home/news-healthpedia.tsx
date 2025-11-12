'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import ImageWithFallback from "@/components/image-with-fallback";
import { getUserById } from '@/lib/user-service';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author_name?: string; // Tambahkan field opsional author_name
  image_url?: string; // Tambahkan field opsional image_url
}

export default function NewsHealthpedia() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/articles?limit=3');
        const data = await res.json();
        console.log('Articles data from API:', data); // Logging untuk melihat data
        const articlesWithImages = data.slice(0, 3).map((article: any) => {
          // Gunakan image_url jika tersedia, jika tidak gunakan image
          const imageUrl = article.image_url || article.image || "https://images.unsplash.com/photo-1599058917765-a780eda07f3b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400";
          return {
            ...article,
            image: imageUrl,
            author: article.author_name || article.author || "Unknown Author" // Gunakan author_name dari API jika tersedia
          };
        });
        console.log('Formatted articles:', articlesWithImages); // Logging hasil format
        setArticles(articlesWithImages);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Kategori artikel
  const categories = [
    "Semua Artikel", "Kesehatan Tubuh", "Kecantikan",
    "Ibu dan Anak", "Pola Hidup Sehat", "Kesehatan Mental"
  ];

  // Topik populer
  const popularTopics = ["Alergi", "Gangguan Kecemasan", "Diet Sehat", "Anak", "Wajah", "Covid"];

  return (
    <section className="w-full py-12 md:py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Left Side */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Berita & <span className="text-green-600 dark:text-green-500">Healthpedia</span>
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Temukan informasi kesehatan yang bermanfaat untuk hidup lebih sehat melalui artikel blog kami.
              </p>

              <Link href="/articles" className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium text-sm">
                Lihat Semua Artikel <ArrowRight className="w-4" />
              </Link>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-4 text-sm">
                Atau Telusuri Topik Populer
              </h3>

              {/* Popular Topics Pills */}
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    className="px-3 py-1.5 rounded-full text-xs text-gray-700 dark:text-gray-300 
                    border border-gray-300 dark:border-gray-600 
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Chips */}
            <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
              {categories.map((item, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm border transition ${
                    i === 0
                      ? "bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500"
                      : "text-green-700 dark:text-green-400 border-green-600 dark:border-green-500 hover:bg-green-50 dark:hover:bg-green-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Article Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Loading State */}
              {loading &&
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-60 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div>
                ))
              }

              {!loading &&
                articles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/articles/${a.slug}`}
                    className="rounded-xl overflow-hidden shadow-sm 
                    bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 
                    hover:shadow-md transition"
                  >
                    <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                      <ImageWithFallback
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
                        {a.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {a.excerpt && a.excerpt.startsWith('<') ? (
                          <div dangerouslySetInnerHTML={{ __html: a.excerpt }} />
                        ) : (
                          a.excerpt
                        )}
                      </p>

                      {a.author_name && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="truncate max-w-[120px]">{a.author_name}</span>
                        </div>
                      )}

                      <div className="flex items-center text-blue-700 dark:text-blue-400 font-medium gap-1 mt-1">
                        Selengkapnya <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}