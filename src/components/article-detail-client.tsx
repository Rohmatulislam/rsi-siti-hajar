'use client';

import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Share, Bookmark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ImageWithFallback from "@/components/image-with-fallback";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  content: string;
}

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

interface ArticleDetailClientProps {
  article: Article;
  relatedArticles: RelatedArticle[];
}

export default function ArticleDetailClient({ article, relatedArticles }: ArticleDetailClientProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt && article.excerpt.startsWith('<') ? article.excerpt.replace(/<[^>]*>/g, '') : article.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Tautan artikel telah disalin ke clipboard");
      }
    } catch {
      toast.error("Gagal membagikan artikel");
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Artikel dihapus dari bookmark" : "Artikel ditambahkan ke bookmark");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* ====== ARTIKEL UTAMA ====== */}
        <article className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="relative h-96">
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="p-8">
              {/* Metadata */}
              <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-emerald-600 dark:text-emerald-400" />
                    {new Date(article.date).toLocaleDateString("id-ID")}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-emerald-600 dark:text-emerald-400" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-emerald-600 dark:text-emerald-400" />
                    5 menit baca
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className={`border-emerald-500/50 ${
                      bookmarked
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Judul & Kategori */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-4">
                {article.title}
              </h1>
              <div className="mb-8">
                <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full dark:bg-emerald-900/40 dark:text-emerald-300 font-medium">
                  {article.category}
                </span>
              </div>

              {/* Isi Artikel */}
              <div
                className="prose dark:prose-invert prose-emerald max-w-none leading-relaxed text-gray-800 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6 mt-10 gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ditulis oleh{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {article.author}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Link href="/articles">Kembali ke Artikel</Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg">
                    <Link href="/appointment">Buat Janji Temu</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ====== SIDEBAR ARTIKEL TERKAIT ====== */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              Artikel Terkait
            </h3>

            {relatedArticles.length ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {relatedArticles.map((rel, index) => (
                  <div key={rel.id} className="py-4 first:pt-0 last:pb-0">
                    <Link
                      href={`/articles/${rel.slug}`}
                      className="block rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative w-24 h-20 rounded-md overflow-hidden flex-shrink-0 min-w-[96px]">
                          <ImageWithFallback
                            src={rel.image}
                            alt={rel.title || "Artikel Terkait"}
                            className="object-cover w-full h-full"
                            width={96}
                            height={80}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1">
                            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full dark:bg-emerald-900/40 dark:text-emerald-300 font-medium">
                              {rel.category || "Umum"}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-emerald-500 transition-colors mb-1">
                            {rel.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {rel.date ? new Date(rel.date).toLocaleDateString("id-ID", {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }) : "Tanggal tidak tersedia"}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tidak ada artikel terkait.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}